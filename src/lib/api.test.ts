import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiFetch, setAuthToken, getAuthToken } from './api';

describe('api client', () => {
  beforeEach(() => {
    sessionStorage.clear();
    setAuthToken(null);
    vi.restoreAllMocks();
  });

  it('manages auth token correctly', () => {
    expect(getAuthToken()).toBeNull();
    setAuthToken('test-token');
    expect(getAuthToken()).toBe('test-token');
    expect(sessionStorage.getItem('insight_token')).toBe('test-token');
    setAuthToken(null);
    expect(getAuthToken()).toBeNull();
    expect(sessionStorage.getItem('insight_token')).toBeNull();
  });

  it('injects Authorization header when token is present', async () => {
    setAuthToken('my-secret-jwt');
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    global.fetch = mockFetch;

    await apiFetch('/api/test');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/test');
    expect((init.headers as Headers).get('Authorization')).toBe('Bearer my-secret-jwt');
  });

  it('does not overwrite existing Authorization header', async () => {
    setAuthToken('my-secret-jwt');
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    global.fetch = mockFetch;

    await apiFetch('/api/test', {
      headers: { Authorization: 'Bearer custom-token' },
    });

    const [, init] = mockFetch.mock.calls[0];
    expect((init.headers as Headers).get('Authorization')).toBe('Bearer custom-token');
  });

  it('sends request without Authorization header when token is absent', async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
    global.fetch = mockFetch;

    await apiFetch('/api/test');

    const [, init] = mockFetch.mock.calls[0];
    expect((init.headers as Headers).has('Authorization')).toBe(false);
  });
});
