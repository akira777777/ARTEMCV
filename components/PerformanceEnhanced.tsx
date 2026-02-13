import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Performance Enhanced Components
 * 
 * Collection of performance-optimized components with advanced memoization,
 * virtualization, and rendering optimizations.
 */

// ============================================================================
// TYPES
// ============================================================================

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  keyExtractor?: (item: T, index: number) => string | number;
}

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
}

interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
  label?: string;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Advanced debouncing hook with configurable delay and immediate option
 */
export function useDebounce<T>(value: T, delay: number, options: { leading?: boolean } = {}): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leadingRef = useRef(true);

  useEffect(() => {
    if (options.leading && leadingRef.current) {
      setDebouncedValue(value);
      leadingRef.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      leadingRef.current = true;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, options.leading]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedValue;
}

/**
 * Advanced throttling hook with RAF optimization
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T, 
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { leading = true, trailing = true } = options;

  const throttledCallback = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = delay - (now - lastRun.current);

    if (remaining <= 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      lastRun.current = now;
      callback(...args);
    } else if (trailing && !timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        lastRun.current = Date.now();
        timeoutRef.current = null;
        callback(...args);
      }, remaining);
    } else if (leading && !timeoutRef.current) {
      lastRun.current = now;
      callback(...args);
    }
  }, [callback, delay, leading, trailing]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback as T;
}

/**
 * Intersection Observer hook with advanced options
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<Element | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [options, hasIntersected]);

  const setElement = useCallback((element: Element | null) => {
    elementRef.current = element;
  }, []);

  return [setElement, isIntersecting, hasIntersected];
}

/**
 * Memory-safe interval hook
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      intervalRef.current = setInterval(() => savedCallback.current(), delay);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [delay]);
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(componentName: string): void {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const duration = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} render #${renderCount.current}: ${duration.toFixed(2)}ms`);
    }

    startTime.current = endTime;
  });

  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} unmounted after ${renderCount.current} renders`);
      }
    };
  }, [componentName]);
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Virtualized List Component with advanced optimizations
 */
export const VirtualList = React.memo(<T,>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
  keyExtractor = (_, index) => index
}: VirtualListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(e.currentTarget.scrollTop);
      rafRef.current = null;
    });
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            width: '100%'
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div key={keyExtractor(item, index)} style={{ height: itemHeight }}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

VirtualList.displayName = 'VirtualList';

/**
 * Lazy Image Component with advanced loading states
 */
export const LazyImage = React.memo<LazyImageProps>({
  src,
  alt,
  className = '',
  placeholder,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin
  });

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {(!isIntersecting || hasError) && placeholder && (
        <div className="absolute inset-0">{placeholder}</div>
      )}
      
      {isIntersecting && !hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          Failed to load image
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

/**
 * Debounced Input Component with advanced features
 */
export const DebouncedInput = React.memo<DebouncedInputProps>({
  value,
  onChange,
  debounceMs = 300,
  placeholder = '',
  className = '',
  label = ''
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const debouncedValue = useDebounce(internalValue, debounceMs);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${className}`}
      />
    </div>
  );
});

DebouncedInput.displayName = 'DebouncedInput';

/**
 * Memoized Component Wrapper with performance monitoring
 */
export const MemoizedComponent = React.memo(<T extends Record<string, unknown>>({
  children,
  deps,
  componentName = 'Component'
}: {
  children: (props: T) => React.ReactNode;
  deps: React.DependencyList;
  componentName?: string;
} & T) => {
  usePerformanceMonitor(componentName);
  
  const memoizedChildren = useMemo(() => children(deps as T), deps);
  
  return <>{memoizedChildren}</>;
});

MemoizedComponent.displayName = 'MemoizedComponent';

/**
 * Conditional Render with performance optimizations
 */
export const ConditionalRender = React.memo<{
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  skipMount?: boolean;
  animate?: boolean;
}>(({ condition, children, fallback = null, skipMount = false, animate = true }) => {
  if (skipMount) {
    return condition ? (
      animate ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      ) : (
        <>{children}</>
      )
    ) : (
      animate ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {fallback}
        </motion.div>
      ) : (
        <>{fallback}</>
      )
    );
  }

  return (
    <>
      {condition ? children : fallback}
    </>
  );
});

ConditionalRender.displayName = 'ConditionalRender';

/**
 * Batched State Updater for performance
 */
export function useBatchedState<T>(initialState: T): [T, (updater: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<(T | ((prev: T) => T))[]>([]);
  const updatePending = useRef(false);

  const batchedSetState = useCallback((updater: T | ((prev: T) => T)) => {
    pendingUpdates.current.push(updater);

    if (!updatePending.current) {
      updatePending.current = true;
      Promise.resolve().then(() => {
        setState(prev => {
          let currentState = prev;
          for (const update of pendingUpdates.current) {
            if (typeof update === 'function') {
              currentState = (update as (prev: T) => T)(currentState);
            } else {
              currentState = update;
            }
          }
          return currentState;
        });
        pendingUpdates.current = [];
        updatePending.current = false;
      });
    }
  }, []);

  return [state, batchedSetState];
}

/**
 * Resource Preloader for performance optimization
 */
export function useResourcePreloader(resources: string[]): [boolean, Error | null] {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const controllers: AbortController[] = [];

    const preloadResources = async () => {
      try {
        const preloadPromises = resources.map(src => {
          const controller = new AbortController();
          controllers.push(controller);
          
          return fetch(src, {
            signal: controller.signal,
            cache: 'force-cache'
          });
        });

        await Promise.all(preloadPromises);
        
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Preload failed'));
        }
      }
    };

    preloadResources();

    return () => {
      isCancelled = true;
      controllers.forEach(controller => controller.abort());
    };
  }, [resources]);

  return [isLoaded, error];
}

/**
 * Virtual Scrolling Hook for long lists
 */
export function useVirtualization<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
): {
  visibleItems: T[];
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
} {
  const [scrollTop, setScrollTop] = useState(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback((newScrollTop: number) => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(newScrollTop);
      rafRef.current = null;
    });
  }, []);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1);
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    offsetY
  };
}

export default {
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useInterval,
  usePerformanceMonitor,
  useBatchedState,
  useResourcePreloader,
  useVirtualization,
  VirtualList,
  LazyImage,
  DebouncedInput,
  MemoizedComponent,
  ConditionalRender
};
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Preload failed'));
       

[Response interrupted by a tool use result. Only one tool may be used at a time and should be placed at the end of the message.]