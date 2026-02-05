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
 * Centralized WebP support detection to prevent redundant DOM operations.
 * Uses a cached promise and a synchronous flag to eliminate re-renders.
 */
let webpSupportPromise: Promise<boolean> | null = null;
let webpSupportCache: boolean | null = null;

/**
 * Returns a promise that resolves to true if the browser supports WebP.
 * The result is cached to avoid redundant DOM operations.
 */
export function checkWebPSupport(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (webpSupportPromise) return webpSupportPromise;

  webpSupportPromise = new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => {
      const isSupported = img.height === 2;
      webpSupportCache = isSupported;
      resolve(isSupported);
    };
    img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });

  return webpSupportPromise;
}

/**
 * Returns the cached WebP support status if available, or null.
 * Allows components to initialize state synchronously.
 */
export function getWebPSupportSync(): boolean | null {
  return webpSupportCache;
}
