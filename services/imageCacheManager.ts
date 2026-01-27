/**
 * Image Cache Manager
 * Handles localStorage-based caching of generated images
 * Reduces API calls by storing and reusing generated results
 */

interface CachedImage {
  data: string; // base64 image
  timestamp: number;
  prompt: string;
}

const CACHE_PREFIX = 'artemcv_image_cache_';
const CACHE_VERSION = '1';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB total cache

export class ImageCacheManager {
  /**
   * Generate cache key from prompt and parameters
   */
  private static generateKey(prompt: string, style: string, ratio: string): string {
    const hash = `${prompt}|${style}|${ratio}`;
    return `${CACHE_PREFIX}${CACHE_VERSION}_${btoa(hash).replaceAll(/[^a-zA-Z0-9]/g, '')}`;
  }

  /**
   * Get cached image if available and not expired
   */
  static getImage(prompt: string, style: string, ratio: string): string | null {
    try {
      const key = this.generateKey(prompt, style, ratio);
      const cached = localStorage.getItem(key);
      
      if (!cached) return null;

      const parsed: CachedImage = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > CACHE_EXPIRY_MS;

      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      console.log(`[Cache HIT] Retrieved image for prompt: "${prompt.slice(0, 20)}..."`);
      return parsed.data;
    } catch (err) {
      console.error('[Cache] Error reading from cache:', err);
      return null;
    }
  }

  /**
   * Store generated image in cache
   */
  static setImage(prompt: string, style: string, ratio: string, imageData: string): void {
    try {
      // Check cache size before adding
      if (!this.canAddToCache(imageData)) {
        console.warn('[Cache] Cache full or near limit, skipping storage');
        return;
      }

      const key = this.generateKey(prompt, style, ratio);
      const cached: CachedImage = {
        data: imageData,
        timestamp: Date.now(),
        prompt: prompt.slice(0, 50),
      };

      localStorage.setItem(key, JSON.stringify(cached));
      console.log(`[Cache STORE] Stored image for prompt: "${prompt.slice(0, 20)}..."`);
    } catch (err) {
      if (err instanceof Error && err.message.includes('QuotaExceededError')) {
        console.warn('[Cache] localStorage quota exceeded, clearing old entries');
        this.clearOldest();
      } else {
        console.error('[Cache] Error writing to cache:', err);
      }
    }
  }

  /**
   * Check if we can safely add to cache
   */
  private static canAddToCache(newData: string): boolean {
    try {
      const estimatedSize = newData.length * 2; // rough estimate
      const totalSize = Object.keys(localStorage)
        .filter(k => k.startsWith(CACHE_PREFIX))
        .reduce((acc, k) => acc + (localStorage.getItem(k)?.length || 0), 0);

      return totalSize + estimatedSize < MAX_CACHE_SIZE;
    } catch {
      return false;
    }
  }

  /**
   * Clear oldest cached image
   */
  private static clearOldest(): void {
    try {
      let oldestKey = '';
      let oldestTime = Date.now();

      Object.keys(localStorage)
        .filter(k => k.startsWith(CACHE_PREFIX))
        .forEach(k => {
          try {
            const item = localStorage.getItem(k);
            if (item) {
              const parsed: CachedImage = JSON.parse(item);
              if (parsed.timestamp < oldestTime) {
                oldestTime = parsed.timestamp;
                oldestKey = k;
              }
            }
          } catch {
            // ignore parse errors
          }
        });

      if (oldestKey) {
        localStorage.removeItem(oldestKey);
        console.log('[Cache] Removed oldest entry to make space');
      }
    } catch (err) {
      console.error('[Cache] Error clearing old entries:', err);
    }
  }

  /**
   * Clear all cached images
   */
  static clearAll(): void {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(CACHE_PREFIX))
        .forEach(k => localStorage.removeItem(k));
      console.log('[Cache] Cleared all cached images');
    } catch (err) {
      console.error('[Cache] Error clearing cache:', err);
    }
  }

  /**
   * Get cache statistics
   */
  static getStats(): { count: number; sizeBytes: number; oldest: number | null } {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
      let totalSize = 0;
      let oldestTime: number | null = null;

      keys.forEach(k => {
        const item = localStorage.getItem(k);
        if (item) {
          totalSize += item.length;
          try {
            const parsed: CachedImage = JSON.parse(item);
            if (!oldestTime || parsed.timestamp < oldestTime) {
              oldestTime = parsed.timestamp;
            }
          } catch {
            // ignore
          }
        }
      });

      return {
        count: keys.length,
        sizeBytes: totalSize,
        oldest: oldestTime,
      };
    } catch {
      return { count: 0, sizeBytes: 0, oldest: null };
    }
  }
}

export default ImageCacheManager;
