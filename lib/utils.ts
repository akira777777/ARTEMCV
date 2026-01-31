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
