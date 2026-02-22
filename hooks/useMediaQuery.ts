import { useState, useEffect, useCallback } from 'react';

// Breakpoint definitions matching Tailwind defaults
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

interface UseMediaQueryOptions {
  /** Default value for SSR */
  defaultValue?: boolean;
  /** Callback when query matches */
  onMatch?: (matches: boolean) => void;
}

/**
 * Hook to listen to CSS media queries
 * @param query - Media query string or breakpoint name
 * @param options - Configuration options
 * @returns Boolean indicating if media query matches
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isDesktop = useMediaQuery('lg'); // Uses breakpoint
 * ```
 */
export function useMediaQuery(
  query: string | Breakpoint,
  options: UseMediaQueryOptions = {},
): boolean {
  const { defaultValue = false, onMatch } = options;

  // Convert breakpoint to media query
  const mediaQuery =
    typeof query === 'string' && query in breakpoints
      ? `(min-width: ${breakpoints[query as Breakpoint]}px)`
      : query;

  const [matches, setMatches] = useState<boolean>(defaultValue);

  const handleChange = useCallback(
    (event: MediaQueryListEvent | MediaQueryList) => {
      const newMatches = 'matches' in event ? event.matches : (event as MediaQueryList).matches;
      setMatches(newMatches);
      onMatch?.(newMatches);
    },
    [onMatch],
  );

  useEffect(() => {
    // SSR safety check
    if (typeof window === 'undefined' || !('matchMedia' in window)) {
      return;
    }

    const mediaQueryList = window.matchMedia(mediaQuery);

    // Set initial value
    handleChange(mediaQueryList);

    // Modern API
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Legacy API fallback
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [mediaQuery, handleChange]);

  return matches;
}

/**
 * Hook to check if current viewport is mobile
 * @returns Boolean indicating if viewport is less than md breakpoint
 */
export function useIsMobile(): boolean {
  return !useMediaQuery('md', { defaultValue: false });
}

/**
 * Hook to check if current viewport is tablet
 * @returns Boolean indicating if viewport is between md and lg breakpoints
 */
export function useIsTablet(): boolean {
  const isMd = useMediaQuery('md', { defaultValue: false });
  const isLg = useMediaQuery('lg', { defaultValue: true });
  return isMd && !isLg;
}

/**
 * Hook to check if current viewport is desktop
 * @returns Boolean indicating if viewport is lg or larger
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('lg', { defaultValue: true });
}
