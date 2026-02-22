import { useState, useEffect, RefObject, useCallback, useRef } from 'react';

interface MousePosition {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** X coordinate relative to element (0-1) */
  elementX: number;
  /** Y coordinate relative to element (0-1) */
  elementY: number;
  /** Whether mouse is over the element */
  isInside: boolean;
}

interface UseMousePositionOptions {
  /** Ref to track position relative to element */
  ref?: RefObject<HTMLElement | null>;
  /** Throttle delay in ms */
  throttleMs?: number;
  /** Include touch events */
  includeTouch?: boolean;
}

const defaultPosition: MousePosition = {
  x: 0,
  y: 0,
  elementX: 0,
  elementY: 0,
  isInside: false,
};

/**
 * Hook to track mouse position globally or relative to an element
 * @param options - Configuration options
 * @returns Mouse position state
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const { x, y, elementX, elementY, isInside } = useMousePosition({ ref, throttleMs: 16 });
 * ```
 */
export function useMousePosition(options: UseMousePositionOptions = {}): MousePosition {
  const { ref, throttleMs = 16, includeTouch = true } = options;
  const [position, setPosition] = useState<MousePosition>(defaultPosition);
  const lastUpdateRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pendingUpdateRef = useRef<{ x: number; y: number } | null>(null);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      const now = performance.now();
      
      // Store pending update
      pendingUpdateRef.current = { x: clientX, y: clientY };

      // Throttle using requestAnimationFrame and time check
      if (now - lastUpdateRef.current >= throttleMs) {
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(() => {
            if (pendingUpdateRef.current) {
              const { x, y } = pendingUpdateRef.current;
              
              let newPosition: MousePosition = {
                x,
                y,
                elementX: 0,
                elementY: 0,
                isInside: false,
              };

              if (ref?.current) {
                const rect = ref.current.getBoundingClientRect();
                const relativeX = x - rect.left;
                const relativeY = y - rect.top;
                
                newPosition.elementX = Math.max(0, Math.min(1, relativeX / rect.width));
                newPosition.elementY = Math.max(0, Math.min(1, relativeY / rect.height));
                newPosition.isInside = 
                  relativeX >= 0 && 
                  relativeX <= rect.width && 
                  relativeY >= 0 && 
                  relativeY <= rect.height;
              }

              setPosition(newPosition);
              lastUpdateRef.current = performance.now();
              pendingUpdateRef.current = null;
            }
            rafRef.current = null;
          });
        }
      }
    },
    [ref, throttleMs]
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        updatePosition(touch.clientX, touch.clientY);
      }
    };

    const handleMouseLeave = () => {
      setPosition((prev) => ({ ...prev, isInside: false }));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    if (includeTouch) {
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    const element = ref?.current;
    if (element) {
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (element) {
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [ref, includeTouch, updatePosition]);

  return position;
}
