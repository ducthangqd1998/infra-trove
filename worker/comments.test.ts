import { describe, expect, it } from 'vitest';
import { hashIp, LIMITS, postPath, validateComment } from './comments';

const valid = {
  post: 'en/json-trailing-commas',
  name: '  Ada   Lovelace ',
  body: 'Thanks!\r\n\r\n\r\n\r\nVery clear.',
  token: 'token',
};
describe('comment validation', () => {
  it('normalizes name and body', () => {
    const result = validateComment(valid);
    expect(result).toEqual({
      ok: true,
      value: { ...valid, name: 'Ada Lovelace', body: 'Thanks!\n\nVery clear.' },
    });
  });
  it.each([
    [{ ...valid, post: '../etc' }, 'Unknown post.'],
    [{ ...valid, post: 'fr/json-trailing-commas' }, 'Unknown post.'],
    [{ ...valid, name: ' ' }, 'name'],
    [{ ...valid, name: 'x'.repeat(LIMITS.name + 1) }, 'name'],
    [{ ...valid, body: 'x' }, 'comment'],
    [{ ...valid, body: 'x'.repeat(LIMITS.body + 1) }, 'comment'],
    [{ ...valid, body: 'http://a http://b http://c' }, 'links'],
    [{ ...valid, token: '' }, 'verification'],
    [null, 'JSON'],
  ])('rejects %j', (input, message) => {
    const result = validateComment(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain(message);
  });
  it('drops control characters', () => {
    const result = validateComment({ ...valid, body: 'ok\u0000\u0007 fine' });
    expect(result.ok && result.value.body).toBe('ok fine');
  });
});
describe('ip hashing', () => {
  it('is stable within a day and changes across days and secrets', async () => {
    const a = await hashIp('203.0.113.7', 'secret', '2026-10-24');
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(await hashIp('203.0.113.7', 'secret', '2026-10-24')).toBe(a);
    expect(await hashIp('203.0.113.7', 'secret', '2026-10-25')).not.toBe(a);
    expect(await hashIp('203.0.113.7', 'other', '2026-10-24')).not.toBe(a);
    expect(a).not.toContain('203');
  });
});
describe('post paths', () => {
  it('maps keys to published routes', () => {
    expect(postPath('en/unix-cron-basics')).toBe('/blog/unix-cron-basics/');
    expect(postPath('vi/unix-cron-basics')).toBe('/vi/blog/unix-cron-basics/');
  });
});
