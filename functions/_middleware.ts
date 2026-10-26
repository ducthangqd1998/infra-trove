// Basic auth middleware for Cloudflare Pages.
// Protects all routes, including <project>.pages.dev and preview deployments.
// Credentials come from the Pages environment variables BASIC_AUTH_USER / BASIC_AUTH_PASSWORD.

interface Env {
  BASIC_AUTH_USER?: string;
  BASIC_AUTH_PASSWORD?: string;
}

interface EventContext<Env, P extends string, Data> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
}

type PagesFunction<
  Env = unknown,
  P extends string = string,
  Data extends Record<string, unknown> = Record<string, unknown>,
> = (context: EventContext<Env, P, Data>) => Response | Promise<Response>;

const encoder = new TextEncoder();

// Hash both sides first so comparison time and length do not depend on the input.
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(a)),
    crypto.subtle.digest('SHA-256', encoder.encode(b)),
  ]);
  const subtle = crypto.subtle as unknown as {
    timingSafeEqual?: (x: ArrayBuffer, y: ArrayBuffer) => boolean;
  };
  if (typeof subtle.timingSafeEqual === 'function') {
    return subtle.timingSafeEqual(ha, hb);
  }
  const viewA = new Uint8Array(ha);
  const viewB = new Uint8Array(hb);
  if (viewA.length !== viewB.length) return false;
  let diff = 0;
  for (let i = 0; i < viewA.length; i++) {
    diff |= viewA[i] ^ viewB[i];
  }
  return diff === 0;
}

function unauthorized(): Response {
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Restricted", charset="UTF-8"',
    },
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;

  // Fail closed when the secrets are missing.
  if (!env.BASIC_AUTH_USER || !env.BASIC_AUTH_PASSWORD) return unauthorized();

  const header = request.headers.get('Authorization') ?? '';
  const [scheme, encoded] = header.split(' ');
  if (scheme !== 'Basic' || !encoded) return unauthorized();

  let decoded: string;
  try {
    decoded = new TextDecoder().decode(
      Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)),
    );
  } catch {
    return unauthorized();
  }

  const sep = decoded.indexOf(':');
  if (sep < 0) return unauthorized();

  const [userOk, passOk] = await Promise.all([
    safeEqual(decoded.slice(0, sep), env.BASIC_AUTH_USER),
    safeEqual(decoded.slice(sep + 1), env.BASIC_AUTH_PASSWORD),
  ]);
  if (!userOk || !passOk) return unauthorized();

  return next();
};
