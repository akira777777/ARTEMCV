import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { logger } from './logger-enhanced';

/**
 * Enhanced Performance Management Utilities
 * 
 * Advanced performance monitoring, optimization, and debugging tools.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  memoryUsage?: MemoryInfo;
  connectionType?: string;
}

export interface PerformanceConfig {
  enableLogging?: boolean;
  enableMonitoring?: boolean;
  enableProfiling?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  sampleRate?: number;
  thresholds?: {
    lighthouse?: {
      performance?: number;
      accessibility?: number;
      bestPractices?: number;
      seo?: number;
    };
    coreWebVitals?: {
      lcp?: number; // Largest Contentful Paint (ms)
      fid?: number; // First Input Delay (ms)
      cls?: number; // Cumulative Layout Shift
    };
  };
}

export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    gzippedSize: number;
    modules: string[];
  }>;
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Performance monitoring hook with comprehensive metrics collection
 */
export function usePerformanceMonitor(config: PerformanceConfig = {}) {
  const {
    enableLogging = process.env.NODE_ENV === 'development',
    enableMonitoring = true,
    enableProfiling = false,
    logLevel = 'info',
    sampleRate = 1.0,
    thresholds = {}
  } = config;

  const metricsRef = useRef<PerformanceMetrics | null>(null);
  const observerRefs = useRef<PerformanceObserver[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const log = useCallback((level: string, message: string, data?: any) => {
    if (!enableLogging || Math.random() > sampleRate) return;

    const loggerFn = (logger as any)[level] || logger.info;
    loggerFn(message, data);
  }, [enableLogging, sampleRate]);

  const collectMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const resource = performance.getEntriesByType('resource');

    // Core Web Vitals
    let lcp = 0;
    let cls = 0;
    let fid = 0;

    // LCP (Largest Contentful Paint)
    const lcpEntry = performance.getEntriesByType('largest-contentful-paint')[0];
    if (lcpEntry) {
      lcp = lcpEntry.startTime;
    }

    // CLS (Cumulative Layout Shift)
    const clsEntries = performance.getEntriesByType('layout-shift') as LayoutShift[];
    cls = clsEntries.reduce((acc, entry) => acc + entry.value, 0);

    // FID (First Input Delay)
    const fidEntries = performance.getEntriesByType('first-input') as FirstInputEvent[];
    if (fidEntries.length > 0) {
      fid = fidEntries[0].processingStart - fidEntries[0].startTime;
    }

    // Memory usage
    const memory = (performance as any).memory as MemoryInfo;

    // Connection type
    const connection = (navigator as any).connection;
    const connectionType = connection ? connection.effectiveType : 'unknown';

    const metrics: PerformanceMetrics = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: lcp,
      cumulativeLayoutShift: cls,
      firstInputDelay: fid,
      timeToInteractive: navigation.domInteractive - navigation.navigationStart,
      totalBlockingTime: resource.reduce((acc, entry) => {
        const duration = entry.duration;
        return acc + (duration > 50 ? duration - 50 : 0);
      }, 0),
      memoryUsage: memory,
      connectionType
    };

    metricsRef.current = metrics;

    if (enableLogging) {
      log('info', 'Performance metrics collected', metrics);
    }

    return metrics;
  }, [enableLogging, log]);

  const checkThresholds = useCallback((metrics: PerformanceMetrics) => {
    if (!thresholds.coreWebVitals) return;

    const { lcp: lcpThreshold, fid: fidThreshold, cls: clsThreshold } = thresholds.coreWebVitals;

    if (lcpThreshold && metrics.largestContentfulPaint > lcpThreshold) {
      log('warn', `LCP threshold exceeded: ${metrics.largestContentfulPaint}ms > ${lcpThreshold}ms`);
    }

    if (fidThreshold && metrics.firstInputDelay > fidThreshold) {
      log('warn', `FID threshold exceeded: ${metrics.firstInputDelay}ms > ${fidThreshold}ms`);
    }

    if (clsThreshold && metrics.cumulativeLayoutShift > clsThreshold) {
      log('warn', `CLS threshold exceeded: ${metrics.cumulativeLayoutShift} > ${clsThreshold}`);
    }
  }, [thresholds, log]);

  const startMonitoring = useCallback(async () => {
    if (!enableMonitoring || isMonitoring) return;

    setIsMonitoring(true);

    // Set up performance observers
    if ('PerformanceObserver' in window) {
      // LCP Observer
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          log('debug', 'LCP updated', { value: lastEntry.startTime });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        observerRefs.current.push(lcpObserver);
      } catch (error) {
        log('warn', 'Failed to create LCP observer', error);
      }

      // CLS Observer
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as LayoutShift).hadRecentInput) {
              clsValue += (entry as LayoutShift).value;
            }
          }
          log('debug', 'CLS updated', { value: clsValue });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        observerRefs.current.push(clsObserver);
      } catch (error) {
        log('warn', 'Failed to create CLS observer', error);
      }

      // FID Observer
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const delay = (entry as FirstInputEvent).processingStart - entry.startTime;
            log('debug', 'FID recorded', { delay });
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        observerRefs.current.push(fidObserver);
      } catch (error) {
        log('warn', 'Failed to create FID observer', error);
      }
    }

    // Collect initial metrics
    const metrics = await collectMetrics();
    checkThresholds(metrics);
  }, [enableMonitoring, isMonitoring, collectMetrics, checkThresholds, log]);

  const stopMonitoring = useCallback(() => {
    if (!isMonitoring) return;

    setIsMonitoring(false);

    // Disconnect observers
    observerRefs.current.forEach(observer => observer.disconnect());
    observerRefs.current = [];

    log('info', 'Performance monitoring stopped');
  }, [isMonitoring, log]);

  const getMetrics = useCallback(() => metricsRef.current, []);

  const clearMetrics = useCallback(() => {
    metricsRef.current = null;
    log('debug', 'Performance metrics cleared');
  }, [log]);

  useEffect(() => {
    if (enableMonitoring) {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [enableMonitoring, startMonitoring, stopMonitoring]);

  return {
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getMetrics,
    clearMetrics,
    collectMetrics,
    checkThresholds
  };
}

/**
 * Bundle size analysis hook
 */
export function useBundleAnalysis() {
  const [analysis, setAnalysis] = useState<BundleAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeBundle = useCallback(async () => {
    setIsLoading(true);

    try {
      // This would typically be implemented with webpack-bundle-analyzer data
      // or similar build-time analysis tools
      const response = await fetch('/api/bundle-analysis');
      const data = await response.json();

      setAnalysis(data);
    } catch (error) {
      logger.error('Failed to analyze bundle:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analysis,
    isLoading,
    analyzeBundle
  };
}

/**
 * Memory usage monitoring hook
 */
export function useMemoryMonitor(threshold: number = 100 * 1024 * 1024) {
  const [memoryUsage, setMemoryUsage] = useState<MemoryInfo | null>(null);
  const [isExceedingThreshold, setIsExceedingThreshold] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const checkMemory = useCallback(() => {
    if (!(performance as any).memory) return;

    const memory = (performance as any).memory as MemoryInfo;
    setMemoryUsage(memory);

    if (memory.usedJSHeapSize > threshold) {
      setIsExceedingThreshold(true);
      logger.warn('Memory usage threshold exceeded:', { usedJSHeapSize: memory.usedJSHeapSize });
    } else {
      setIsExceedingThreshold(false);
    }
  }, [threshold]);

  useEffect(() => {
    checkMemory();
    intervalRef.current = window.setInterval(checkMemory, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkMemory]);

  return {
    memoryUsage,
    isExceedingThreshold,
    checkMemory
  };
}

/**
 * Render performance monitoring hook
 */
export function useRenderMonitor(componentName: string) {
  const renderCount = useRef(0);
  // Track running statistics instead of accumulating every render time in an
  // unbounded array.  The spread-based Math.max/min on a large array can cause
  // a "Maximum call stack size exceeded" error and wastes memory.
  const totalRenderTime = useRef(0);
  const minRenderTime = useRef(Infinity);
  const maxRenderTime = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const currentTime = performance.now();
    const renderTime = currentTime - lastRenderTime.current;

    totalRenderTime.current += renderTime;
    if (renderTime < minRenderTime.current) minRenderTime.current = renderTime;
    if (renderTime > maxRenderTime.current) maxRenderTime.current = renderTime;
    lastRenderTime.current = currentTime;

    // Log performance if it's slow
    if (renderTime > 16) { // More than one frame at 60fps
      logger.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
    }

    return () => {
      // Component unmount
      const avgRenderTime = renderCount.current > 0
        ? totalRenderTime.current / renderCount.current
        : 0;
      logger.info(`${componentName} unmounted after ${renderCount.current} renders. Avg render time: ${avgRenderTime.toFixed(2)}ms`);
    };
  });

  const getStats = useCallback(() => {
    const count = renderCount.current;
    const avgRenderTime = count > 0 ? totalRenderTime.current / count : 0;

    return {
      renderCount: count,
      avgRenderTime,
      maxRenderTime: count > 0 ? maxRenderTime.current : 0,
      minRenderTime: count > 0 ? minRenderTime.current : 0,
    };
  }, []);

  return {
    getStats
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Performance utilities for common optimization tasks
 */
export const performanceUtils = {
  /**
   * Debounce function with performance monitoring
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    options: { leading?: boolean; trailing?: boolean; monitor?: boolean } = {}
  ): T => {
    let timeout: NodeJS.Timeout | null = null;
    let lastCallTime = 0;
    let callCount = 0;

    const debounced = ((...args: Parameters<T>) => {
      const now = Date.now();
      callCount++;
      lastCallTime = now;

      const callNow = options.leading && !timeout;

      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        timeout = null;
        if (!options.leading) {
          func(...args);
        }
      }, wait);

      if (callNow) {
        func(...args);
      }

      if (options.monitor && callCount % 100 === 0) {
        logger.info(`Debounced function called ${callCount} times, last call: ${now - lastCallTime}ms ago`);
      }
    }) as T;

    return debounced;
  },

  /**
   * Throttle function with performance monitoring
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number,
    options: { leading?: boolean; trailing?: boolean; monitor?: boolean } = {}
  ): T => {
    let inThrottle: boolean;
    let lastFunc: NodeJS.Timeout;
    let lastRan: number;
    let callCount = 0;

    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        lastRan = Date.now();
        inThrottle = true;
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        }, Math.max(limit - (Date.now() - lastRan), 0));
      }

      callCount++;
      if (options.monitor && callCount % 100 === 0) {
        logger.info(`Throttled function called ${callCount} times`);
      }
    }) as T;
  },

  /**
   * Memoize function with cache size monitoring
   */
  memoize: <T extends (...args: any[]) => any>(
    func: T,
    options: { maxSize?: number; monitor?: boolean } = {}
  ): T => {
    const cache = new Map();
    const maxSize = options.maxSize || 100;
    let hitCount = 0;
    let missCount = 0;

    const memoized = ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        hitCount++;
        if (options.monitor && hitCount % 100 === 0) {
          logger.info(`Cache hit ratio: ${(hitCount / (hitCount + missCount) * 100).toFixed(2)}%`);
        }
        return cache.get(key);
      }

      missCount++;
      const result = func(...args);
      cache.set(key, result);

      // Evict oldest entries if cache is full
      if (cache.size > maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      return result;
    }) as T;

    return memoized;
  },

  /**
   * Measure function execution time
   */
  measure: async <T>(func: () => Promise<T> | T, label: string): Promise<T> => {
    const start = performance.now();
    const result = await func();
    const end = performance.now();

    logger.info(`${label} took ${end - start}ms`);
    return result;
  },

  /**
   * Check if element is in viewport with performance optimization
   */
  isInViewport: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Get element intersection ratio
   */
  getIntersectionRatio: (element: HTMLElement): number => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
    const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));

    const visibleArea = visibleHeight * visibleWidth;
    const totalArea = rect.height * rect.width;

    return totalArea > 0 ? visibleArea / totalArea : 0;
  }
};

/**
 * Performance profiler for React components
 */
export class PerformanceProfiler {
  private measurements: Map<string, number[]> = new Map();

  start(name: string): void {
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
  }

  end(name: string): number {
    const times = this.measurements.get(name);
    if (!times) return 0;

    const duration = performance.now();
    times.push(duration);
    return duration;
  }

  getStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const times = this.measurements.get(name);
    if (!times || times.length === 0) return null;

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return { avg, min, max, count: times.length };
  }

  getAllStats(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const stats: Record<string, { avg: number; min: number; max: number; count: number }> = {};

    for (const [name, times] of this.measurements) {
      if (times.length > 0) {
        stats[name] = {
          avg: times.reduce((a, b) => a + b, 0) / times.length,
          min: Math.min(...times),
          max: Math.max(...times),
          count: times.length
        };
      }
    }

    return stats;
  }

  clear(): void {
    this.measurements.clear();
  }
}

export const profiler = new PerformanceProfiler();

export default {
  usePerformanceMonitor,
  useBundleAnalysis,
  useMemoryMonitor,
  useRenderMonitor,
  performanceUtils,
  PerformanceProfiler,
  profiler
};