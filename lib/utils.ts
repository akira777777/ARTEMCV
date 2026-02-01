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
 * WebP support detection caching
 */
let isWebPSupported: boolean | null = null;
let webPSupportPromise: Promise<boolean> | null = null;

/**
 * Detects WebP support in the browser and caches the result
 * @returns Promise resolving to boolean indicating WebP support
 */
export function checkWebPSupport(): Promise<boolean> {
  // Return cached result if available
  if (isWebPSupported !== null) return Promise.resolve(isWebPSupported);
  if (webPSupportPromise) return webPSupportPromise;

  // Handle SSR or non-browser environments
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    return Promise.resolve(true); // Assume supported or handle gracefully in SSR
  }

  webPSupportPromise = new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      isWebPSupported = webP.height === 2;
      resolve(isWebPSupported);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });

  return webPSupportPromise;
}

/**
 * Synchronously gets the cached WebP support status
 * @returns boolean | null (null if not yet detected)
 */
export function getCachedWebPSupport(): boolean | null {
  return isWebPSupported;
}
