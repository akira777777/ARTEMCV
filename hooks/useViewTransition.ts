import { useCallback } from 'react';

/**
 * View Transitions API Hook
 * 
 * Provides smooth page transitions using the native View Transitions API.
 * Falls back gracefully for browsers that don't support it.
 * 
 * @example
 * const { startTransition } = useViewTransition();
 * 
 * const handleNavigate = () => {
 *   startTransition(() => {
 *     navigate('/new-page');
 *   });
 * };
 */
export function useViewTransition() {
  const startTransition = useCallback(
    (callback: () => void, options?: { name?: string }) => {
      // Check for View Transitions API support
      if ('startViewTransition' in document) {
        // @ts-ignore - TypeScript might not know about this API yet
        const transition = document.startViewTransition(callback);
        
        // Optionally set transition name for specific elements
        if (options?.name) {
          transition.ready.then(() => {
            const element = document.querySelector(`[data-transition-name="${options.name}"]`);
            if (element) {
              (element as HTMLElement).style.viewTransitionName = options.name;
            }
          });
        }
        
        return transition;
      } else {
        // Fallback for browsers without support
        callback();
        return null;
      }
    },
    []
  );

  const isSupported = typeof document !== 'undefined' && 'startViewTransition' in document;

  return {
    startTransition,
    isSupported,
  };
}

/**
 * Hook for animating elements on scroll with intersection observer
 */
export function useScrollAnimation() {
  const observeElement = useCallback(
    (element: Element, callback: (isIntersecting: boolean) => void, options?: IntersectionObserverInit) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          callback(entry.isIntersecting);
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -10% 0px',
          ...options,
        }
      );

      observer.observe(element);
      
      return () => observer.disconnect();
    },
    []
  );

  return { observeElement };
}

export default useViewTransition;
