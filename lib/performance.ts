/**
 * Performance optimization utilities
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: 'script' | 'style' | 'image' | 'font' = 'script', type?: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  if (as === 'font') link.crossOrigin = 'anonymous';
  
  document.head.appendChild(link);
}

/**
 * Preconnect to external domains
 */
export function preconnect(domain: string, crossOrigin = true) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  if (crossOrigin) link.crossOrigin = 'anonymous';
  
  document.head.appendChild(link);
}

/**
 * Lazy load images with IntersectionObserver
 */
export function useLazyImage(src: string, placeholder?: string) {
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || loadedRef.current) return;

    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadedRef.current = true;
              img.src = src;
              observerRef.current?.unobserve(img);
            }
          });
        },
        { rootMargin: '50px' }
      );
      observerRef.current.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      img.src = src;
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src]);

  return { imgRef, placeholder };
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function calls using RAF
 */
export function useThrottleRAF<T extends (...args: unknown[]) => void>(callback: T) {
  const rafRef = useRef<number | null>(null);
  const latestArgs = useRef<Parameters<T> | null>(null);

  const throttledCallback = useCallback((...args: Parameters<T>) => {
    latestArgs.current = args;
    
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        if (latestArgs.current) {
          callback(...latestArgs.current);
        }
        rafRef.current = null;
      });
    }
  }, [callback]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return throttledCallback;
}

/**
 * Measure component render performance
 */
export function useRenderPerf(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Perf] ${componentName} render #${renderCount.current}: ${duration.toFixed(2)}ms`);
    }
    
    startTime.current = endTime;
  });

  return renderCount.current;
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement, offset = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Request idle callback with fallback
 */
export function requestIdle(callback: () => void, timeout = 2000) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout });
  }
  return setTimeout(callback, 1);
}
