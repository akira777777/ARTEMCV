/**
 * Chat Response Cache Manager
 * Caches chat responses to reduce API quota usage
 */

interface CachedResponse {
  timestamp: number;
  response: string;
  sources: Array<{ title: string; uri: string }>;
}

export class ChatCacheManager {
  private static readonly CACHE_KEY = 'astra_chat_cache';
  private static readonly CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days
  private static readonly MAX_CACHE_SIZE = 100; // Max 100 cached responses

  /**
   * Generate cache key from message hash
   */
  private static generateKey(message: string): string {
    // Simple hash for message (good enough for cache)
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.codePointAt(i) || 0;
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `msg_${Math.abs(hash)}`;
  }

  /**
   * Get cached response for a message
   */
  static getResponse(message: string): CachedResponse | null {
    try {
      const cache = this.loadCache();
      const key = this.generateKey(message);
      const cached = cache[key];

      if (!cached) return null;

      // Check expiry
      const age = Date.now() - cached.timestamp;
      if (age > this.CACHE_EXPIRY) {
        delete cache[key];
        this.saveCache(cache);
        return null;
      }

      return cached;
    } catch (error) {
      console.error('Error reading chat cache:', error);
      return null;
    }
  }

  /**
   * Cache a response
   */
  static cacheResponse(
    message: string,
    response: string,
    sources: Array<{ title: string; uri: string }> = []
  ): void {
    try {
      const cache = this.loadCache();
      const key = this.generateKey(message);

      // Enforce max cache size
      const keys = Object.keys(cache);
      if (keys.length >= this.MAX_CACHE_SIZE) {
        // Remove oldest entry
        const oldest = keys.reduce((min, k) =>
          cache[k].timestamp < cache[min].timestamp ? k : min, keys[0] || ''
        );
        if (oldest) delete cache[oldest];
      }

      cache[key] = {
        timestamp: Date.now(),
        response,
        sources
      };

      this.saveCache(cache);
    } catch (error) {
      console.error('Error caching chat response:', error);
      // Silently fail - don't break the app
    }
  }

  /**
   * Clear all cached responses
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.error('Error clearing chat cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static getStats(): { count: number; size: number } {
    const cache = this.loadCache();
    const count = Object.keys(cache).length;
    const size = JSON.stringify(cache).length;
    return { count, size };
  }

  /**
   * Load cache from localStorage
   */
  private static loadCache(): Record<string, CachedResponse> {
    try {
      const data = localStorage.getItem(this.CACHE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading chat cache:', error);
      return {};
    }
  }

  /**
   * Save cache to localStorage
   */
  private static saveCache(cache: Record<string, CachedResponse>): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving chat cache:', error);
      // Handle quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearAll();
      }
    }
  }
}
