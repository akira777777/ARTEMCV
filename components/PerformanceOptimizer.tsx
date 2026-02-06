import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * PerformanceOptimizer - Set of utilities and hooks for performance optimization
 */

// Hook for debouncing expensive operations
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for throttling operations
export const useThrottle = <T,>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastExecuted.current >= delay) {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }
    }, delay - (Date.now() - lastExecuted.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};

// Hook for efficient state updates
export const useBatchedState = <T,>(initialState: T): [T, (updater: T | ((prev: T) => T)) => void] => {
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
};

// Component for virtualizing long lists
interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const VirtualList = <T,>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5
}: VirtualListProps<T>): React.ReactElement => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex + 1),
    [items, startIndex, endIndex]
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;

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
            top: startIndex * itemHeight,
            width: '100%'
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component for memoized rendering
interface MemoizedRenderProps {
  children: (props: any) => React.ReactNode;
  deps: React.DependencyList;
  fallback?: React.ReactNode;
}

export const MemoizedRender: React.FC<MemoizedRenderProps> = ({ children, deps, fallback = null }) => {
  const memoizedChildren = useMemo(() => children(deps), deps);
  
  return <>{memoizedChildren || fallback}</>;
};

// Component for conditional rendering with performance optimization
interface ConditionalRenderProps {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  skipMount?: boolean;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({ 
  condition, 
  children, 
  fallback = null, 
  skipMount = false 
}) => {
  if (skipMount) {
    return condition ? <>{children}</> : <>{fallback}</>;
  }

  return (
    <MemoizedRender deps={[condition]}>
      {() => condition ? children : fallback}
    </MemoizedRender>
  );
};

// Hook for measuring performance of components
export const usePerformanceMeasure = (componentName: string) => {
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = performance.now();
    
    return () => {
      if (startTime.current !== null) {
        const endTime = performance.now();
        const renderTime = endTime - startTime.current;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`${componentName} rendered in ${renderTime.toFixed(2)}ms`);
        }
      }
    };
  }, [componentName]);
};
