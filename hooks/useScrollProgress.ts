import { useState, useEffect, useCallback, RefObject } from 'react';

interface ScrollProgress {
  progress: number;
  scrollY: number;
  scrollHeight: number;
  viewportHeight: number;
}

/**
 * Hook to track scroll progress
 * 
 * @example
 * const { progress, scrollY } = useScrollProgress();
 * 
 * <div style={{ transform: `scaleX(${progress})` }} />
 */
export function useScrollProgress(): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    scrollHeight: 0,
    viewportHeight: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight - viewportHeight;
      const progress = scrollHeight > 0 ? scrollY / scrollHeight : 0;

      setState({
        progress,
        scrollY,
        scrollHeight,
        viewportHeight,
      });
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return state;
}

/**
 * Hook to track scroll progress within a specific element
 */
export function useElementScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>
): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    scrollHeight: 0,
    viewportHeight: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const scrollY = element.scrollTop;
      const viewportHeight = element.clientHeight;
      const scrollHeight = element.scrollHeight - viewportHeight;
      const progress = scrollHeight > 0 ? scrollY / scrollHeight : 0;

      setState({
        progress,
        scrollY,
        scrollHeight,
        viewportHeight,
      });
    };

    handleScroll();

    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);

  return state;
}

/**
 * Hook to track when user scrolls past a certain point
 */
export function useScrollThreshold(threshold: number = 100): boolean {
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsPastThreshold(window.scrollY > threshold);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isPastThreshold;
}

/**
 * Hook to smoothly scroll to an element
 */
export function useSmoothScroll() {
  const scrollTo = useCallback((target: string | number | HTMLElement, offset: number = 0) => {
    let element: Element | null = null;

    if (typeof target === 'string') {
      element = document.querySelector(target);
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
      return;
    } else {
      element = target;
    }

    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return { scrollTo };
}

export default useScrollProgress;
