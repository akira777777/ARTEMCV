import { useState, useEffect, useRef, RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook to detect when an element enters the viewport
 *
 * @example
 * const [ref, isInView] = useInView({ threshold: 0.5 });
 *
 * <div ref={ref}>
 *   {isInView && <AnimatedContent />}
 * </div>
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
): [RefObject<T | null>, boolean] {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isInView];
}

/**
 * Hook to animate elements when they come into view
 */
export function useAnimateInView<T extends HTMLElement = HTMLDivElement>(
  animationClass: string = 'animate-fade-in-up',
  options: UseInViewOptions = {},
): [RefObject<T | null>, boolean] {
  const [ref, isInView] = useInView<T>({ triggerOnce: true, ...options });

  useEffect(() => {
    const element = ref.current;
    if (element && isInView) {
      element.classList.add(animationClass);
    }
  }, [ref, isInView, animationClass]);

  return [ref, isInView];
}

/**
 * Hook to track multiple elements and their visibility
 */
export function useInViewMultiple(
  count: number,
  options: UseInViewOptions = {},
): { refs: RefObject<HTMLElement | null>[]; inViewStates: boolean[] } {
  const refs = Array.from({ length: count }, () => useRef<HTMLElement>(null));
  const [inViewStates, setInViewStates] = useState<boolean[]>(Array(count).fill(false));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.forEach((ref, index) => {
      const element = ref.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInViewStates((prev) => {
              const next = [...prev];
              next[index] = true;
              return next;
            });
            if (options.triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!options.triggerOnce) {
            setInViewStates((prev) => {
              const next = [...prev];
              next[index] = false;
              return next;
            });
          }
        },
        { threshold: options.threshold ?? 0, rootMargin: options.rootMargin ?? '0px' },
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [count, options.threshold, options.rootMargin, options.triggerOnce]);

  return { refs, inViewStates };
}

export default useInView;
