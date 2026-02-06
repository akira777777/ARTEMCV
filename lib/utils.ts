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
  const timeoutController = new AbortController();
  const timeout = setTimeout(() => timeoutController.abort(), timeoutMs);

  const signals: AbortSignal[] = [timeoutController.signal];
  if (options.signal) {
    signals.push(options.signal);
  }

  let cleanup = () => {};
  let combinedSignal = timeoutController.signal;

  const anySignal = (AbortSignal as typeof AbortSignal & {
    any?: (signals: AbortSignal[]) => AbortSignal;
  }).any;

  if (signals.length > 1) {
    if (typeof anySignal === 'function') {
      combinedSignal = anySignal(signals);
    } else {
      const controller = new AbortController();
      const onAbort = () => controller.abort();

      for (const signal of signals) {
        if (signal.aborted) {
          controller.abort();
          break;
        }
        signal.addEventListener('abort', onAbort);
      }

      combinedSignal = controller.signal;
      cleanup = () => {
        for (const signal of signals) {
          signal.removeEventListener('abort', onAbort);
        }
      };
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: combinedSignal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
    cleanup();
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
