/**
 * Shared utility functions
 */

/**
 * HTML escaping for safe Telegram HTML parse mode
 * Escapes special characters to prevent HTML injection
 */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Email validation pattern
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Creates a fetch request with automatic timeout and abort handling
 * @param url - The URL to fetch
 * @param options - Fetch options (without signal)
 * @param timeoutMs - Timeout in milliseconds (default: 12000)
 * @returns Promise with the fetch response
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 12_000
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Centralized WebP support detection to prevent redundant DOM operations
 */
let supportsWebPCache: Promise<boolean> | null = null;

export function checkWebPSupport(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);

  if (supportsWebPCache) return supportsWebPCache;

  supportsWebPCache = new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });

  return supportsWebPCache;
}
