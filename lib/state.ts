import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * Enhanced State Management Utilities
 *
 * Advanced state management patterns with persistence, validation,
 * and performance optimizations.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface StateOptions<T> {
  persist?: boolean;
  persistKey?: string;
  validate?: (value: T) => boolean | string;
  defaultValue?: T;
  debounceMs?: number;
  history?: boolean;
  historyLimit?: number;
}

export interface UseStateWithHistoryResult<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  history: T[];
  currentIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
  error: string | null;
}

export interface UseSessionStorageResult<T> extends UseLocalStorageResult<T> {}

export interface UseAsyncStateResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (asyncFn: () => Promise<T>) => Promise<void>;
  reset: () => void;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Enhanced useState with persistence, validation, and debouncing
 */
export function useStateEnhanced<T>(
  initialValue: T,
  options: StateOptions<T> = {},
): [T, (value: T | ((prev: T) => T)) => void, { isValid: boolean; error: string | null }] {
  const {
    persist = false,
    persistKey,
    validate,
    defaultValue,
    debounceMs = 0,
    history = false,
    historyLimit = 10,
  } = options;

  const [value, setValue] = useState<T>(initialValue);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<T[]>(history ? [initialValue] : []);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const historyRef = useRef<number>(0);

  // Persistence logic
  useEffect(() => {
    if (!persist || !persistKey) return;

    try {
      const stored = localStorage.getItem(persistKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setValue(parsed);
        if (history) {
          setHistory([parsed]);
          historyRef.current = 0;
        }
      }
    } catch (err) {
      console.warn(`Failed to load persisted state for key ${persistKey}:`, err);
      if (defaultValue !== undefined) {
        setValue(defaultValue);
      }
    }
  }, [persist, persistKey, defaultValue, history]);

  // Debounced persistence
  useEffect(() => {
    if (!persist || !persistKey) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(persistKey, JSON.stringify(value));
      } catch (err) {
        console.warn(`Failed to persist state for key ${persistKey}:`, err);
      }
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, persist, persistKey, debounceMs]);

  // Validation logic
  useEffect(() => {
    if (!validate) return;

    const validationResult = validate(value);
    if (typeof validationResult === 'string') {
      setIsValid(false);
      setError(validationResult);
    } else if (typeof validationResult === 'boolean') {
      setIsValid(validationResult);
      if (validationResult) {
        setError(null);
      }
    }
  }, [value, validate]);

  // History management
  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const resolvedValue =
        typeof newValue === 'function' ? (newValue as Function)(value) : newValue;

      setValue(resolvedValue);

      if (history) {
        setHistory((prev) => {
          const newHistory = prev.slice(0, historyRef.current + 1);
          newHistory.push(resolvedValue);

          if (newHistory.length > historyLimit) {
            newHistory.shift();
          } else {
            historyRef.current++;
          }

          return newHistory;
        });
      }
    },
    [value, history, historyLimit],
  );

  return [value, updateValue, { isValid, error }];
}

/**
 * useState with undo/redo functionality
 */
export function useStateWithHistory<T>(
  initialValue: T,
  options: { limit?: number } = {},
): UseStateWithHistoryResult<T> {
  const { limit = 10 } = options;
  const [value, setValue] = useState<T>(initialValue);
  const [history, setHistory] = useState<T[]>([initialValue]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setValueWithHistory = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const resolvedValue =
        typeof newValue === 'function' ? (newValue as Function)(value) : newValue;

      setValue(resolvedValue);
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(resolvedValue);

        if (newHistory.length > limit) {
          newHistory.shift();
        } else {
          setCurrentIndex(newHistory.length - 1);
        }

        return newHistory;
      });
    },
    [value, currentIndex, limit],
  );

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setValue(history[currentIndex - 1]);
    }
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setValue(history[currentIndex + 1]);
    }
  }, [currentIndex, history]);

  const clearHistory = useCallback(() => {
    setHistory([value]);
    setCurrentIndex(0);
  }, [value]);

  return {
    value,
    setValue: setValueWithHistory,
    history,
    currentIndex,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    undo,
    redo,
    clearHistory,
  };
}

/**
 * Local storage hook with error handling and validation
 */
export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageResult<T> {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const [error, setError] = useState<string | null>(null);

  const setValueWrapper = useCallback(
    (value: T) => {
      try {
        setError(null);
        setValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        setError('Failed to save to localStorage');
        console.error(`Error setting localStorage key "${key}":`, err);
      }
    },
    [key],
  );

  const removeValue = useCallback(() => {
    try {
      setError(null);
      setValue(initialValue as T);
      window.localStorage.removeItem(key);
    } catch (err) {
      setError('Failed to remove from localStorage');
      console.error(`Error removing localStorage key "${key}":`, err);
    }
  }, [key, initialValue]);

  return { value, setValue: setValueWrapper, removeValue, error };
}

/**
 * Session storage hook with error handling and validation
 */
export function useSessionStorage<T>(key: string, initialValue: T): UseSessionStorageResult<T> {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const [error, setError] = useState<string | null>(null);

  const setValueWrapper = useCallback(
    (value: T) => {
      try {
        setError(null);
        setValue(value);
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        setError('Failed to save to sessionStorage');
        console.error(`Error setting sessionStorage key "${key}":`, err);
      }
    },
    [key],
  );

  const removeValue = useCallback(() => {
    try {
      setError(null);
      setValue(initialValue as T);
      window.sessionStorage.removeItem(key);
    } catch (err) {
      setError('Failed to remove from sessionStorage');
      console.error(`Error removing sessionStorage key "${key}":`, err);
    }
  }, [key, initialValue]);

  return { value, setValue: setValueWrapper, removeValue, error };
}

/**
 * Async state hook for handling async operations
 */
export function useAsyncState<T>(): UseAsyncStateResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * State with throttling for performance optimization
 */
export function useStateThrottled<T>(
  initialValue: T,
  throttleMs: number = 100,
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextValueRef = useRef<T | null>(null);
  const isUpdatingRef = useRef(false);

  const setValueThrottled = useCallback(
    (newValue: T) => {
      nextValueRef.current = newValue;

      if (isUpdatingRef.current) {
        return;
      }

      isUpdatingRef.current = true;
      setValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (nextValueRef.current !== null && nextValueRef.current !== newValue) {
          setValue(nextValueRef.current);
          nextValueRef.current = null;
        }
        isUpdatingRef.current = false;
      }, throttleMs);
    },
    [throttleMs],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, setValueThrottled];
}

/**
 * State with debouncing for performance optimization
 */
export function useStateDebounced<T>(
  initialValue: T,
  debounceMs: number = 300,
): [T, T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setValueDebounced = useCallback(
    (newValue: T) => {
      setValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(newValue);
      }, debounceMs);
    },
    [debounceMs],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, debouncedValue, setValueDebounced];
}

/**
 * Derived state hook with memoization and caching
 */
export function useDerivedState<T, D>(
  dependencies: D[],
  deriveFn: (dependencies: D[]) => T,
  options: { cacheSize?: number; equalityFn?: (a: T, b: T) => boolean } = {},
): T {
  const { cacheSize = 10, equalityFn = (a: T, b: T) => a === b } = options;
  const cacheRef = useRef<Map<string, T>>(new Map());
  const dependenciesRef = useRef<D[]>(dependencies);

  const derivedValue = useMemo(() => {
    const key = JSON.stringify(dependencies);
    const cached = cacheRef.current.get(key);

    if (cached !== undefined) {
      return cached;
    }

    const newValue = deriveFn(dependencies);
    cacheRef.current.set(key, newValue);

    // Limit cache size
    if (cacheRef.current.size > cacheSize) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }

    return newValue;
  }, [dependencies, deriveFn, cacheSize]);

  // Clear cache when dependencies change significantly
  useEffect(() => {
    const currentDeps = dependenciesRef.current;
    const hasSignificantChange = dependencies.some((dep, index) => dep !== currentDeps[index]);

    if (hasSignificantChange) {
      cacheRef.current.clear();
      dependenciesRef.current = dependencies;
    }
  }, [dependencies]);

  return derivedValue;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Create a state reducer with middleware support
 */
export function createStateReducer<T, A>(
  reducer: (state: T, action: A) => T,
  middleware: Array<(state: T, action: A, next: (state: T, action: A) => T) => T> = [],
) {
  return (state: T, action: A): T => {
    const next = (s: T, a: A) => reducer(s, a);
    return middleware.reduceRight((acc, mw) => (s, a) => mw(s, a, acc), next)(state, action);
  };
}

/**
 * Create a state validator
 */
export function createStateValidator<T>(rules: Record<keyof T, (value: any) => boolean | string>) {
  return (state: T): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
    const errors: Partial<Record<keyof T, string>> = {};

    for (const [key, rule] of Object.entries(rules)) {
      const result = rule(state[key as keyof T]);
      if (typeof result === 'string') {
        errors[key as keyof T] = result;
      } else if (!result) {
        errors[key as keyof T] = 'Invalid value';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
}

/**
 * State persistence utilities
 */
export const statePersistence = {
  save: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to save state to localStorage: ${key}`, error);
      return false;
    }
  },

  load: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to load state from localStorage: ${key}`, error);
      return defaultValue;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove state from localStorage: ${key}`, error);
      return false;
    }
  },

  clearAll: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage', error);
      return false;
    }
  },
};

export default {
  useStateEnhanced,
  useStateWithHistory,
  useLocalStorage,
  useSessionStorage,
  useAsyncState,
  useStateThrottled,
  useStateDebounced,
  useDerivedState,
  createStateReducer,
  createStateValidator,
  statePersistence,
};
