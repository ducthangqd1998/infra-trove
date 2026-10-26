import { describe, expect, it, vi } from 'vitest';
import { onRequest } from './_middleware';

describe('Cloudflare Pages basic auth middleware', () => {
  it('returns 401 when basic auth env vars are not configured', async () => {
    const next = vi.fn();
    const request = new Request('https://infratrove.thangmai.tech/');
    const response = await onRequest({
      request,
      env: {},
      next,
      functionPath: '',
      waitUntil: vi.fn(),
      params: {},
      data: {},
    });

    expect(response.status).toBe(401);
    expect(response.headers.get('WWW-Authenticate')).toContain('Basic');
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when authorization header is missing', async () => {
    const next = vi.fn();
    const request = new Request('https://infratrove.thangmai.tech/');
    const response = await onRequest({
      request,
      env: {
        BASIC_AUTH_USER: 'admin',
        BASIC_AUTH_PASSWORD: 'secretpassword',
      },
      next,
      functionPath: '',
      waitUntil: vi.fn(),
      params: {},
      data: {},
    });

    expect(response.status).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when authorization credentials are incorrect', async () => {
    const next = vi.fn();
    const badAuth = btoa('admin:wrongpassword');
    const request = new Request('https://infratrove.thangmai.tech/', {
      headers: {
        Authorization: `Basic ${badAuth}`,
      },
    });
    const response = await onRequest({
      request,
      env: {
        BASIC_AUTH_USER: 'admin',
        BASIC_AUTH_PASSWORD: 'secretpassword',
      },
      next,
      functionPath: '',
      waitUntil: vi.fn(),
      params: {},
      data: {},
    });

    expect(response.status).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when authorization credentials match', async () => {
    const next = vi.fn().mockResolvedValue(new Response('OK', { status: 200 }));
    const validAuth = btoa('admin:secretpassword');
    const request = new Request('https://infratrove.thangmai.tech/', {
      headers: {
        Authorization: `Basic ${validAuth}`,
      },
    });
    const response = await onRequest({
      request,
      env: {
        BASIC_AUTH_USER: 'admin',
        BASIC_AUTH_PASSWORD: 'secretpassword',
      },
      next,
      functionPath: '',
      waitUntil: vi.fn(),
      params: {},
      data: {},
    });

    expect(response.status).toBe(200);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
