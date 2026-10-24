/** Pure comment rules, shared by the Worker and its unit tests. */
export const LIMITS = {
  name: 60,
  body: 2000,
  links: 2,
  perWindow: 3,
  windowMinutes: 10,
  requestBytes: 8192,
};
/** Post keys mirror content ids: "en/json-trailing-commas", "vi/unix-cron-basics". */
export const POST_PATTERN = /^(en|vi)\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
export type CommentInput = {
  post: string;
  name: string;
  body: string;
  token: string;
};
type Result = { ok: true; value: CommentInput } | { ok: false; error: string };
// Control characters other than newline and tab are dropped.
const controls = /[\u0000-\u0008\u000b-\u001f\u007f]/g;
export function validateComment(raw: unknown): Result {
  if (!raw || typeof raw !== 'object')
    return { ok: false, error: 'Send a JSON object.' };
  const input = raw as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === 'string' ? value : '');
  const post = text(input.post);
  const name = text(input.name)
    .replace(controls, '')
    .replace(/\s+/g, ' ')
    .trim();
  const body = text(input.body)
    .replace(/\r\n?/g, '\n')
    .replace(controls, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const token = text(input.token);
  if (!POST_PATTERN.test(post)) return { ok: false, error: 'Unknown post.' };
  if (!name || name.length > LIMITS.name)
    return {
      ok: false,
      error: `Enter a name of 1 to ${LIMITS.name} characters.`,
    };
  if (body.length < 2 || body.length > LIMITS.body)
    return {
      ok: false,
      error: `Write a comment of 2 to ${LIMITS.body} characters.`,
    };
  if ((body.match(/https?:\/\//gi) ?? []).length > LIMITS.links)
    return {
      ok: false,
      error: `Use at most ${LIMITS.links} links in a comment.`,
    };
  if (!token) return { ok: false, error: 'Complete the verification first.' };
  return { ok: true, value: { post, name, body, token } };
}
/** HMAC of the address and the UTC day: lets us rate-limit without keeping the IP. */
export async function hashIp(ip: string, secret: string, day: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${day}:${ip}`),
  );
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}
/** Site path of a post key, used to confirm the post is published. */
export function postPath(post: string) {
  const [lang, slug] = post.split('/');
  return lang === 'en' ? `/blog/${slug}/` : `/vi/blog/${slug}/`;
}
