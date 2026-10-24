import {
  hashIp,
  LIMITS,
  POST_PATTERN,
  postPath,
  validateComment,
} from './comments';

/**
 * Serves the static site from ASSETS. Only /api/* reaches this code
 * (assets.run_worker_first in wrangler.jsonc); tool pages never call it.
 */
function json(
  data: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      ...headers,
    },
  });
}

/** Reads at most `max` bytes; returns null when the body is larger. */
async function readLimited(request: Request, max: number) {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

async function listComments(url: URL, env: Env) {
  const post = url.searchParams.get('post') ?? '';
  if (!POST_PATTERN.test(post)) return json({ error: 'Unknown post.' }, 400);
  const { results } = await env.DB.prepare(
    `SELECT id, name, body, created_at AS createdAt FROM comments
     WHERE post = ?1 AND status = 'visible' ORDER BY created_at ASC LIMIT 200`,
  )
    .bind(post)
    .all();
  return json({ comments: results });
}

async function verifyTurnstile(token: string, ip: string, secret: string) {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: form,
    },
  );
  if (!response.ok) return false;
  const result = await response.json<{ success?: boolean }>();
  return result.success === true;
}

async function createComment(request: Request, url: URL, env: Env) {
  if (request.headers.get('origin') !== url.origin)
    return json({ error: 'Cross-site requests are not allowed.' }, 403);
  if (!request.headers.get('content-type')?.includes('application/json'))
    return json({ error: 'Send the comment as JSON.' }, 415);
  const text = await readLimited(request, LIMITS.requestBytes);
  if (text === null) return json({ error: 'Comment is too long.' }, 413);
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return json({ error: 'Send the comment as JSON.' }, 400);
  }
  const input = validateComment(parsed);
  if (!input.ok) return json({ error: input.error }, 400);
  const { post, name, body, token } = input.value;

  const ip = request.headers.get('cf-connecting-ip') ?? '';
  if (!(await verifyTurnstile(token, ip, env.TURNSTILE_SECRET)))
    return json({ error: 'Verification failed. Please try again.' }, 403);

  // Only published guides accept comments.
  const page = await env.ASSETS.fetch(new URL(postPath(post), url.origin));
  await page.body?.cancel();
  if (page.status !== 200) return json({ error: 'Unknown post.' }, 404);

  const now = new Date();
  const ipHash = await hashIp(
    ip || 'unknown',
    env.IP_HASH_SECRET,
    now.toISOString().slice(0, 10),
  );
  const since = new Date(
    now.getTime() - LIMITS.windowMinutes * 60_000,
  ).toISOString();
  const recent = await env.DB.prepare(
    'SELECT COUNT(*) AS n FROM comments WHERE ip_hash = ?1 AND created_at > ?2',
  )
    .bind(ipHash, since)
    .first<{ n: number }>();
  if ((recent?.n ?? 0) >= LIMITS.perWindow)
    return json(
      { error: 'Too many comments. Try again in a few minutes.' },
      429,
      {
        'retry-after': String(LIMITS.windowMinutes * 60),
      },
    );

  const comment = {
    id: crypto.randomUUID(),
    name,
    body,
    createdAt: now.toISOString(),
  };
  await env.DB.prepare(
    'INSERT INTO comments (id, post, name, body, ip_hash, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)',
  )
    .bind(comment.id, post, name, body, ipHash, comment.createdAt)
    .run();
  return json({ comment }, 201);
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/api/comments') {
      if (url.pathname.startsWith('/api/'))
        return json({ error: 'Not found.' }, 404);
      return env.ASSETS.fetch(request);
    }
    try {
      if (request.method === 'GET') return await listComments(url, env);
      if (request.method === 'POST')
        return await createComment(request, url, env);
      return json({ error: 'Method not allowed.' }, 405, {
        allow: 'GET, POST',
      });
    } catch (error) {
      console.error(
        JSON.stringify({
          message: 'comments api failed',
          error: String(error),
          path: url.pathname,
        }),
      );
      return json({ error: 'Something went wrong. Please try again.' }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
