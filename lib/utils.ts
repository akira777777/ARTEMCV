/**
 * Shared utility functions
 */

/**
 * Smooth scroll to a section by ID
 * @param sectionId - The ID of the section to scroll to (without #)
 */
export function scrollToSection(sectionId: string): void {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
}

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
let supportsWebPSync: boolean | null = null;

/**
 * Asynchronously checks for WebP support and caches the result.
 */
export function checkWebPSupport(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (supportsWebPSync !== null) return Promise.resolve(supportsWebPSync);
  if (supportsWebPCache) return supportsWebPCache;

  supportsWebPCache = new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      const result = webP.height === 2;
      supportsWebPSync = result;
      resolve(result);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });

  return supportsWebPCache;
}

/**
 * Synchronously returns the cached WebP support status.
 * Returns true by default if the check hasn't completed yet to prioritize modern formats.
 */
export function getWebPSupportSync(): boolean {
  if (typeof window === 'undefined') return false;
  return supportsWebPSync ?? true;
}
