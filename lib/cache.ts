import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Enhanced Cache Management Utilities
 * 
 * Advanced caching with LRU eviction, persistence, compression,
 * and performance optimization.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface CacheConfig {
  maxSize?: number;
  ttl?: number;
  compression?: boolean;
  persistence?: boolean;
  persistenceKey?: string;
  persistenceStrategy?: 'localStorage' | 'sessionStorage' | 'indexedDB';
  compressionThreshold?: number;
  evictionPolicy?: 'lru' | 'lfu' | 'fifo';
  maxSizeInBytes?: number;
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  accessCount: number;
  size?: number;
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRate: number;
  totalSizeInBytes: number;
  maxSizeInBytes?: number;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Enhanced cache hook with LRU eviction and persistence
 */
export function useCache<T = any>(config: CacheConfig = {}) {
  const {
    maxSize = 100,
    ttl = 5 * 60 * 1000, // 5 minutes
    compression = false,
    persistence = false,
    persistenceKey = 'app-cache',
    persistenceStrategy = 'localStorage',
    compressionThreshold = 1024, // 1KB
    evictionPolicy = 'lru',
    maxSizeInBytes
  } = config;

  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(new Map());
  const [stats, setStats] = useState<CacheStats>({
    size: 0,
    maxSize,
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalSizeInBytes: 0,
    maxSizeInBytes
  });

  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const statsRef = useRef<CacheStats>({
    size: 0,
    maxSize,
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalSizeInBytes: 0,
    maxSizeInBytes
  });

  // Initialize from persistence
  useEffect(() => {
    if (!persistence) return;

    try {
      let storedData: any;
      switch (persistenceStrategy) {
        case 'localStorage':
          storedData = localStorage.getItem(persistenceKey);
          break;
        case 'sessionStorage':
          storedData = sessionStorage.getItem(persistenceKey);
          break;
        case 'indexedDB':
          // IndexedDB implementation would go here
          break;
      }

      if (storedData) {
        const parsed = JSON.parse(storedData);
        const newCache = new Map<string, CacheEntry<T>>();

        parsed.entries.forEach((entry: CacheEntry<T>) => {
          newCache.set(entry.key, entry);
        });

        cacheRef.current = newCache;
        statsRef.current = parsed.stats;
        setCache(newCache);
        setStats(parsed.stats);
      }
    } catch (error) {
      console.warn('Failed to load cached data:', error);
    }
  }, [persistence, persistenceKey, persistenceStrategy]);

  // Save to persistence
  const saveToPersistence = useCallback(() => {
    if (!persistence) return;

    try {
      const data = {
        entries: Array.from(cacheRef.current.entries()).map(([key, entry]) => entry),
        stats: statsRef.current
      };

      const serialized = JSON.stringify(data);

      switch (persistenceStrategy) {
        case 'localStorage':
          localStorage.setItem(persistenceKey, serialized);
          break;
        case 'sessionStorage':
          sessionStorage.setItem(persistenceKey, serialized);
          break;
        case 'indexedDB':
          // IndexedDB implementation would go here
          break;
      }
    } catch (error) {
      console.warn('Failed to save cached data:', error);
    }
  }, [persistence, persistenceKey, persistenceStrategy]);

  // Calculate entry size
  const calculateEntrySize = useCallback((entry: CacheEntry<T>): number => {
    if (entry.size) return entry.size;

    try {
      const size = new Blob([JSON.stringify(entry.value)]).size;
      entry.size = size;
      return size;
    } catch (error) {
      return 0;
    }
  }, []);

  // Check if entry has expired
  const isExpired = useCallback((entry: CacheEntry<T>): boolean => {
    return Date.now() - entry.timestamp > ttl;
  }, [ttl]);

  // Evict entries based on policy
  const evictEntries = useCallback(() => {
    const currentCache = cacheRef.current;
    const currentStats = statsRef.current;

    if (currentCache.size <= maxSize) return;

    // Remove expired entries first
    for (const [key, entry] of currentCache) {
      if (isExpired(entry)) {
        currentCache.delete(key);
        currentStats.totalSizeInBytes -= entry.size || 0;
      }
    }

    // Apply eviction policy if still over size limit
    if (currentCache.size > maxSize) {
      let entries: Array<[string, CacheEntry<T>]> = Array.from(currentCache.entries());

      switch (evictionPolicy) {
        case 'lru':
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
          break;
        case 'lfu':
          entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
          break;
        case 'fifo':
          entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
          break;
      }

      const toRemove = entries.slice(0, currentCache.size - maxSize);
      toRemove.forEach(([key, entry]) => {
        currentCache.delete(key);
        currentStats.totalSizeInBytes -= entry.size || 0;
      });
    }

    // Check byte size limit
    if (maxSizeInBytes && currentStats.totalSizeInBytes > maxSizeInBytes) {
      let entries: Array<[string, CacheEntry<T>]> = Array.from(currentCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);

      while (currentStats.totalSizeInBytes > maxSizeInBytes && entries.length > 0) {
        const [key, entry] = entries.shift()!;
        currentCache.delete(key);
        currentStats.totalSizeInBytes -= entry.size || 0;
      }
    }

    cacheRef.current = currentCache;
    statsRef.current = currentStats;
    setCache(new Map(currentCache));
    setStats({ ...currentStats });
  }, [maxSize, evictionPolicy, maxSizeInBytes, isExpired]);

  // Get value from cache
  const get = useCallback((key: string): T | null => {
    const currentCache = cacheRef.current;
    const currentStats = statsRef.current;

    const entry = currentCache.get(key);

    if (!entry || isExpired(entry)) {
      currentStats.misses++;
      currentStats.hitRate = currentStats.hits / (currentStats.hits + currentStats.misses);
      statsRef.current = currentStats;
      setStats({ ...currentStats });
      return null;
    }

    // Update access count and timestamp for LRU
    entry.accessCount++;
    entry.timestamp = Date.now();

    currentStats.hits++;
    currentStats.hitRate = currentStats.hits / (currentStats.hits + currentStats.misses);
    statsRef.current = currentStats;
    setStats({ ...currentStats });

    return entry.value;
  }, [isExpired]);

  // Set value in cache
  const set = useCallback((key: string, value: T): void => {
    const currentCache = cacheRef.current;
    const currentStats = statsRef.current;

    const existingEntry = currentCache.get(key);
    const entrySize = calculateEntrySize({ key, value, timestamp: Date.now(), accessCount: 0 });

    if (existingEntry) {
      currentStats.totalSizeInBytes -= existingEntry.size || 0;
    }

    currentStats.totalSizeInBytes += entrySize;

    const newEntry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      accessCount: 0,
      size: entrySize
    };

    currentCache.set(key, newEntry);

    // Compress if needed
    if (compression && entrySize > compressionThreshold) {
      try {
        // Simple compression simulation (in real implementation, use a compression library)
        newEntry.value = JSON.parse(JSON.stringify(value)) as T;
      } catch (error) {
        console.warn('Compression failed:', error);
      }
    }

    evictEntries();
    saveToPersistence();
  }, [calculateEntrySize, compression, compressionThreshold, evictEntries, saveToPersistence]);

  // Delete entry from cache
  const del = useCallback((key: string): boolean => {
    const currentCache = cacheRef.current;
    const currentStats = statsRef.current;

    const entry = currentCache.get(key);
    if (!entry) return false;

    currentCache.delete(key);
    currentStats.totalSizeInBytes -= entry.size || 0;
    currentStats.size = currentCache.size;

    cacheRef.current = currentCache;
    statsRef.current = currentStats;
    setCache(new Map(currentCache));
    setStats({ ...currentStats });

    saveToPersistence();
    return true;
  }, [saveToPersistence]);

  // Clear cache
  const clear = useCallback((): void => {
    cacheRef.current.clear();
    statsRef.current = {
      size: 0,
      maxSize,
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalSizeInBytes: 0,
      maxSizeInBytes
    };

    setCache(new Map());
    setStats({ ...statsRef.current });

    if (persistence) {
      try {
        switch (persistenceStrategy) {
          case 'localStorage':
            localStorage.removeItem(persistenceKey);
            break;
          case 'sessionStorage':
            sessionStorage.removeItem(persistenceKey);
            break;
          case 'indexedDB':
            // IndexedDB implementation would go here
            break;
        }
      } catch (error) {
        console.warn('Failed to clear persistent cache:', error);
      }
    }
  }, [maxSize, maxSizeInBytes, persistence, persistenceKey, persistenceStrategy]);

  // Get cache statistics
  const getStats = useCallback((): CacheStats => {
    return { ...statsRef.current };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      saveToPersistence();
    };
  }, [saveToPersistence]);

  return {
    get,
    set,
    del,
    clear,
    getStats,
    cache: cacheRef.current,
    stats: statsRef.current
  };
}

/**
 * Cache-aware data fetching hook
 */
export function useCachedData<T = any>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    staleTime?: number;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchInterval?: number;
  } = {}
) {
  const { ttl = 5 * 60 * 1000, staleTime = 2 * 60 * 1000, refetchOnMount = true, refetchOnWindowFocus = false, refetchInterval } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const mountedRef = useRef(true);

  const cache = useCache<T>({ maxSize: 50, ttl });

  const fetchData = useCallback(async (force = false) => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      // Try to get from cache first
      if (!force) {
        const cachedData = cache.get(key);
        if (cachedData) {
          const entry = Array.from(cache.cache.entries()).find(([k]) => k === key)?.[1];
          const isStale = entry && (Date.now() - entry.timestamp > staleTime);

          if (!isStale) {
            setData(cachedData);
            setLoading(false);
            return;
          }
        }
      }

      // Fetch fresh data
      const freshData = await fetcher();
      cache.set(key, freshData);
      setData(freshData);

    } catch (err) {
      setError(err);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [key, fetcher, cache, staleTime]);

  // Initial fetch
  useEffect(() => {
    if (refetchOnMount) {
      fetchData();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [refetchOnMount]); // eslint-disable-line react-hooks/exhaustive-deps

  // Window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, fetchData]);

  // Interval refetch
  useEffect(() => {
    if (!refetchInterval) return;

    const interval = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval, fetchData]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const invalidate = useCallback(() => {
    cache.del(key);
    setData(null);
  }, [cache, key]);

  return {
    data,
    loading,
    error,
    refetch,
    invalidate
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Cache utilities for common tasks
 */
export const cacheUtils = {
  /**
   * Create cache key from function arguments
   */
  createCacheKey: (...args: any[]): string => {
    return JSON.stringify(args);
  },

  /**
   * Compress data (simple implementation)
   */
  compress: (data: any): string => {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.warn('Compression failed:', error);
      return '';
    }
  },

  /**
   * Decompress data
   */
  decompress: (compressed: string): any => {
    try {
      return JSON.parse(compressed);
    } catch (error) {
      console.warn('Decompression failed:', error);
      return null;
    }
  },

  /**
   * Calculate data size in bytes
   */
  calculateSize: (data: any): number => {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch (error) {
      return 0;
    }
  },

  /**
   * Clear all caches
   */
  clearAllCaches: () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      // Clear IndexedDB would go here
    } catch (error) {
      console.warn('Failed to clear caches:', error);
    }
  },

  /**
   * Get cache usage statistics
   */
  getCacheUsage: () => {
    const localStorageUsage = JSON.stringify(localStorage).length;
    const sessionStorageUsage = JSON.stringify(sessionStorage).length;

    return {
      localStorage: {
        size: localStorageUsage,
        limit: 5 * 1024 * 1024, // 5MB estimate
        usagePercent: (localStorageUsage / (5 * 1024 * 1024)) * 100
      },
      sessionStorage: {
        size: sessionStorageUsage,
        limit: 5 * 1024 * 1024, // 5MB estimate
        usagePercent: (sessionStorageUsage / (5 * 1024 * 1024)) * 100
      }
    };
  }
};

export default {
  useCache,
  useCachedData,
  cacheUtils
};