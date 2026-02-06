import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWithTimeout } from '../lib/utils';

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

describe('fetchWithTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('aborts the request when the timeout elapses', async () => {
    const fetchMock = createAbortableFetch();
    vi.stubGlobal('fetch', fetchMock);

    const promise = fetchWithTimeout('https://example.com', {}, 10);
    const assertion = expect(promise).rejects.toMatchObject({ name: 'AbortError' });

    await vi.advanceTimersByTimeAsync(20);

    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('respects an external abort signal', async () => {
    const fetchMock = createAbortableFetch();
    vi.stubGlobal('fetch', fetchMock);

    const controller = new AbortController();
    const promise = fetchWithTimeout('https://example.com', { signal: controller.signal }, 5000);
    const assertion = expect(promise).rejects.toMatchObject({ name: 'AbortError' });

    controller.abort();

    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
