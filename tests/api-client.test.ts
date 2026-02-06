import { describe, it, expect, vi, afterEach } from 'vitest';
import { createApiClient, RequestAbortedError } from '../lib/api-client';

const createAbortError = () => {
  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
};

const createAbortableFetch = () =>
  vi.fn((_url: string, init?: RequestInit) => {
    return new Promise((_resolve, reject) => {
      const signal = init?.signal as AbortSignal | undefined;
      if (signal?.aborted) {
        reject(createAbortError());
        return;
      }
      signal?.addEventListener('abort', () => reject(createAbortError()), { once: true });
    });
  });

describe('api-client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses JSON responses', async () => {
    const headers =
      typeof Headers !== 'undefined'
        ? new Headers({ 'content-type': 'application/json' })
        : { get: (key: string) => (key === 'content-type' ? 'application/json' : null) };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers,
      text: vi.fn().mockResolvedValue(JSON.stringify({ ok: true })),
    });

    vi.stubGlobal('fetch', fetchMock);

    const api = createApiClient({ baseUrl: '', retries: 0 });
    const response = await api.get<{ ok: boolean }>('/health');

    expect(response.status).toBe(200);
    expect(response.data.ok).toBe(true);
  });

  it('handles empty responses gracefully', async () => {
    const headers =
      typeof Headers !== 'undefined'
        ? new Headers()
        : { get: (_key: string) => null };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      headers,
      text: vi.fn().mockResolvedValue(''),
    });

    vi.stubGlobal('fetch', fetchMock);

    const api = createApiClient({ baseUrl: '', retries: 0 });
    const response = await api.get('/empty');

    expect(response.status).toBe(204);
    expect(response.data).toBeUndefined();
  });

  it('surfaces aborts as RequestAbortedError', async () => {
    const fetchMock = createAbortableFetch();
    vi.stubGlobal('fetch', fetchMock);

    const api = createApiClient({ baseUrl: '', retries: 0, timeout: 5000 });
    const controller = new AbortController();
    const request = api.get('/abort', { signal: controller.signal, retries: 0 });

    controller.abort();

    await expect(request).rejects.toBeInstanceOf(RequestAbortedError);
  });
});
