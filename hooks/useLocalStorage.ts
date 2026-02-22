import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

// Custom event name for cross-tab synchronization
const STORAGE_EVENT = 'storage-change';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;
type RemoveValue = () => void;

interface UseLocalStorageReturn<T> {
  /** Current value */
  value: T;
  /** Set value in localStorage */
  setValue: SetValue<T>;
  /** Remove value from localStorage */
  removeValue: RemoveValue;
  /** Whether value is loaded (for SSR) */
  isLoaded: boolean;
}

/**
 * Custom event dispatcher for same-tab updates
 */
function dispatchStorageEvent(key: string, newValue: string | null) {
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key, newValue } }));
}

/**
 * Hook to persist state in localStorage with type safety
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Object with value, setValue, removeValue, and isLoaded
 * @example
 * ```tsx
 * const { value, setValue, removeValue } = useLocalStorage('theme', 'dark');
 *
 * // Set value
 * setValue('light');
 *
 * // Functional update
 * setValue(prev => prev === 'dark' ? 'light' : 'dark');
 *
 * // Remove
 * removeValue();
 * ```
 */
export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
  // SSR safety - use syncExternalStore for better hydration handling
  const getServerSnapshot = useCallback(() => JSON.stringify(initialValue), [initialValue]);

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return JSON.stringify(initialValue);
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  }, [key, initialValue]);

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === 'undefined') return () => {};

      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === key) {
          callback();
        }
      };

      const handleCustomEvent = (event: Event) => {
        const customEvent = event as CustomEvent<{ key: string; newValue: string | null }>;
        if (customEvent.detail?.key === key) {
          callback();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      window.addEventListener(STORAGE_EVENT, handleCustomEvent);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener(STORAGE_EVENT, handleCustomEvent);
      };
    },
    [key],
  );

  const storedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const parsedValue: T = useCallback(() => {
    try {
      return JSON.parse(storedValue) as T;
    } catch {
      return initialValue;
    }
  }, [storedValue, initialValue])();

  const setValue: SetValue<T> = useCallback(
    (value) => {
      if (typeof window === 'undefined') return;

      try {
        const currentValue = parsedValue;
        const valueToStore = value instanceof Function ? value(currentValue) : value;

        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
          dispatchStorageEvent(key, null);
        } else {
          const serialized = JSON.stringify(valueToStore);
          window.localStorage.setItem(key, serialized);
          dispatchStorageEvent(key, serialized);
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, parsedValue],
  );

  const removeValue: RemoveValue = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(key);
      dispatchStorageEvent(key, null);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  return {
    value: parsedValue,
    setValue,
    removeValue,
    isLoaded,
  };
}

/**
 * Hook to get multiple localStorage values at once
 * @param keys - Array of keys to retrieve
 * @returns Record of key-value pairs
 * @example
 * ```tsx
 * const values = useLocalStorageItems(['theme', 'language']);
 * console.log(values.theme, values.language);
 * ```
 */
export function useLocalStorageItems(keys: string[]): Record<string, unknown> {
  const [values, setValues] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadValues = () => {
      const result: Record<string, unknown> = {};
      for (const key of keys) {
        try {
          const item = window.localStorage.getItem(key);
          result[key] = item !== null ? JSON.parse(item) : null;
        } catch {
          result[key] = null;
        }
      }
      setValues(result);
    };

    loadValues();

    const handleStorageChange = () => {
      loadValues();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(STORAGE_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(STORAGE_EVENT, handleStorageChange);
    };
  }, [keys]);

  return values;
}
