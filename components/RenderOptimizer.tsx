import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * RenderOptimizer - Component to optimize rendering performance
 * Uses techniques like requestIdleCallback, virtualization, and selective rendering
 */
interface RenderOptimizerProps {
  children: React.ReactNode;
  priority?: 'low' | 'medium' | 'high';
  fallback?: React.ReactNode;
  shouldRender?: boolean;
}

export const RenderOptimizer: React.FC<RenderOptimizerProps> = ({
  children,
  priority = 'medium',
  fallback = null,
  shouldRender = true
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure we're on the client-side for performance optimizations
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate timeout based on priority
  const getTimeout = useCallback(() => {
    switch (priority) {
      case 'high':
        return 0; // Immediate
      case 'medium':
        return 16; // Next frame
      case 'low':
        return 100; // Delayed
      default:
        return 16;
    }
  }, [priority]);

  // Schedule rendering based on priority and browser idle time
  useEffect(() => {
    if (!shouldRender || !isClient) {
      setIsRendered(false);
      return;
    }

    if (priority === 'high' || !('requestIdleCallback' in window)) {
      // For high priority or browsers without idle callback, render immediately
      setIsRendered(true);
      return;
    }

    // Use requestIdleCallback for lower priority renders
    const timeout = getTimeout();
    
    if (timeout === 0) {
      setIsRendered(true);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        const idleCallbackId = requestIdleCallback(() => {
          setIsRendered(true);
        }, { timeout: 100 }); // Max wait time of 100ms

        // Cleanup function to cancel if component unmounts
        return () => {
          cancelIdleCallback(idleCallbackId);
        };
      } else {
        // Fallback for browsers without requestIdleCallback
        setIsRendered(true);
      }
    }, timeout);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [priority, shouldRender, isClient, getTimeout]);

  // Show fallback or children based on render state
  if (!shouldRender) {
    return <>{fallback}</>;
  }

  if (!isRendered) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * PerformanceMonitor - Hook to monitor component performance
 */
export const usePerformanceMonitor = (componentName: string, enabled = true) => {
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    startTime.current = performance.now();
    
    return () => {
      if (startTime.current !== null) {
        const endTime = performance.now();
        const renderTime = endTime - startTime.current;
        
        // Log performance if it exceeds threshold
        if (renderTime > 16.67) { // More than one frame at 60fps
          console.warn(`Performance Warning: ${componentName} took ${renderTime.toFixed(2)}ms to render`);
        } else if (process.env.NODE_ENV === 'development') {
          console.log(`${componentName} rendered in ${renderTime.toFixed(2)}ms`);
        }
      }
    };
  }, [componentName, enabled]);
};

/**
 * LazyRender - Component that defers rendering until element is in viewport
 */
interface LazyRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export const LazyRender: React.FC<LazyRenderProps> = ({
  children,
  fallback = null,
  threshold = 0.1,
  rootMargin = '0px',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!elementRef.current || !('IntersectionObserver' in window)) {
      // Fallback: show immediately if IntersectionObserver is not supported
      setIsVisible(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
};

/**
 * MemoizedComponent - Wrapper to ensure components are properly memoized
 */
interface MemoizedComponentProps<T> {
  component: React.ComponentType<T>;
  props: T;
  deps: React.DependencyList;
}

export const MemoizedComponent = <T extends {}>({
  component: Component,
  props,
  deps
}: MemoizedComponentProps<T>) => {
  const Memoized = React.useMemo(() => React.memo(Component), []);
  return <Memoized {...props} />;
};

/**
 * FPSMonitor - Component to monitor frames per second
 */
export const FPSMonitor: React.FC = () => {
  const [fps, setFps] = useState(0);
  const lastTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const fpsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const calculateFPS = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      frameCountRef.current++;

      if (delta >= 1000) { // 1 second passed
        const currentFPS = Math.round((frameCountRef.current * 1000) / delta);
        setFps(currentFPS);
        
        // Reset counters
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      // Continue monitoring
      fpsIntervalRef.current = setTimeout(calculateFPS, 1000 - (delta % 1000));
    };

    calculateFPS();

    return () => {
      if (fpsIntervalRef.current) {
        clearTimeout(fpsIntervalRef.current);
      }
    };
  }, []);

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-green-400 text-xs p-2 rounded z-[9999] font-mono">
      FPS: {fps}
    </div>
  );
};