import { useCallback, useRef, useEffect } from 'react';

/**
 * A performance-optimized cache hook with persistent storage.
 *
 * @param persistence Whether to persist the cache to localStorage
 * @param debounceMs Delay in milliseconds before persisting changes (default: 1000)
 */
export const useCache = (persistence: boolean, debounceMs: number = 1000) => {
  const cacheRef = useRef<Map<string, any>>(new Map());
  const statsRef = useRef({ hits: 0, misses: 0 });

  // Refs for managing asynchronous persistence
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleCallbackRef = useRef<number | null>(null);

  /**
   * Optimized persistence function.
   * Offloads heavy serialization and I/O from the main execution path
   * using debouncing and requestIdleCallback.
   */
  const saveToPersistence = useCallback(() => {
    if (!persistence) return;

    // 1. Clear any existing pending save operations (Debounce)
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (idleCallbackRef.current !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(idleCallbackRef.current);
      idleCallbackRef.current = null;
    }

    // 2. Schedule the save operation after a debounce period
    saveTimeoutRef.current = setTimeout(() => {
      const performSave = () => {
        try {
          // Expensive operation: converting Map to Array and Mapping
          const data = {
            entries: Array.from(cacheRef.current.entries()).map(([key, entry]) => entry),
            stats: statsRef.current
          };

          // Expensive operation: JSON serialization
          const serialized = JSON.stringify(data);

          // I/O operation: Storage access
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('cache_persistence', serialized);
          }
        } catch (e) {
          console.error('Failed to save to persistence:', e);
        } finally {
          idleCallbackRef.current = null;
        }
      };

      // 3. Defer the heavy work until the browser is idle to prevent frame drops
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        idleCallbackRef.current = window.requestIdleCallback(
          () => performSave(),
          { timeout: 2000 } // Ensure it eventually runs
        );
      } else {
        // Fallback for browsers without requestIdleCallback
        performSave();
      }

      saveTimeoutRef.current = null;
    }, debounceMs);
  }, [persistence, debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (idleCallbackRef.current !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallbackRef.current);
      }
    };
  }, []);

  /**
   * Set a value in the cache.
   * Now highly efficient as it triggers asynchronous persistence.
   */
  const set = (key: string, value: any) => {
    cacheRef.current.set(key, { key, value, timestamp: Date.now() });
    saveToPersistence();
  };

  /**
   * Get a value from the cache.
   */
  const get = (key: string) => {
    const entry = cacheRef.current.get(key);
    if (entry) {
      statsRef.current.hits++;
      return entry.value;
    }
    statsRef.current.misses++;
    return null;
  };

  return { get, set };
};
