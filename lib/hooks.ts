import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWithTimeout as fetchWithTimeoutUtil } from './utils';

/**
 * Hook to detect user's preference for reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for mouse position tracking with RAF throttling
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let latestX = 0;
    let latestY = 0;

    const handler = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setPosition({ x: latestX, y: latestY });
          rafRef.current = null;
        });
      }
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handler);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return position;
}

/**
 * Hook for scroll progress (0 to 1) with RAF throttling
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handler = () => {
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
        setProgress(Math.min(1, Math.max(0, scrollProgress)));
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => {
      window.removeEventListener('scroll', handler);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return progress;
}

/**
 * Hook for intersection observer
 */
export function useInView(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
      if (entry.isIntersecting) {
        setHasBeenInView(true);
      }
    }, optionsRef.current);

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView, hasBeenInView };
}

/**
 * Hook for window size with debounced updates
 */
export function useWindowSize() {
  const [size, setSize] = useState(() => {
    if (typeof window === 'undefined') return { width: 0, height: 0 };
    return { width: window.innerWidth, height: window.innerHeight };
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }, 100);
    };

    window.addEventListener('resize', handler, { passive: true });
    return () => {
      window.removeEventListener('resize', handler);
      clearTimeout(timeoutId);
    };
  }, []);

  return size;
}

/**
 * Hook for detecting mobile devices
 */
export function useIsMobile(breakpoint = 768) {
  const { width } = useWindowSize();
  return width > 0 && width < breakpoint;
}

/**
 * Hook for throttled callback
 */
export function useThrottle<T extends (...args: unknown[]) => void>(callback: T, delay: number): T {
  const lastRan = useRef(Date.now());
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = delay - (now - lastRan.current);

    if (remaining <= 0) {
      lastRan.current = now;
      callback(...args);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        lastRan.current = Date.now();
        callback(...args);
      }, remaining);
    }
  }, [callback, delay]) as T;
}

/**
 * Hook for debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for magnetic effect on elements
 */
export function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    setOffset({
      x: distanceX * strength,
      y: distanceY * strength,
    });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return { ref, offset, handleMouseMove, handleMouseLeave };
}

/**
 * Hook for fetch requests with automatic timeout
 * Returns a function that performs fetch with built-in AbortController and timeout
 * Uses the fetchWithTimeout utility function for consistency
 */
export function useFetchWithTimeout(timeoutMs: number = 12_000) {
  return useCallback((url: string, options: RequestInit = {}) => {
    return fetchWithTimeoutUtil(url, options, timeoutMs);
  }, [timeoutMs]);
}
