import { useState, useEffect } from 'react';

/**
 * Hook to detect user's preference for reduced motion
 * Used for accessibility - respects prefers-reduced-motion media query
 * @returns Boolean indicating if reduced motion is preferred
 * @example
 * ```tsx
 * const shouldReduceMotion = useReducedMotion();
 *
 * return (
 *   <motion.div
 *     animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
 *     initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
 *   />
 * );
 * ```
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(
        'matches' in event ? event.matches : (event as MediaQueryList).matches,
      );
    };

    // Modern API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Legacy API fallback
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to get animation configuration based on reduced motion preference
 * @param animationConfig - Normal animation configuration
 * @returns Animation configuration respecting user's preferences
 * @example
 * ```tsx
 * const motionProps = useMotionPreference({
 *   initial: { opacity: 0, y: 20 },
 *   animate: { opacity: 1, y: 0 },
 *   transition: { duration: 0.5 }
 * });
 *
 * return <motion.div {...motionProps} />;
 * ```
 */
export function useMotionPreference<T extends Record<string, unknown>>(
  animationConfig: T,
): Partial<T> | T {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    // Return minimal animation config for reduced motion
    return {} as Partial<T>;
  }

  return animationConfig;
}
