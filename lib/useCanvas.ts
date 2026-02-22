import { useRef, useEffect } from 'react';

export interface UseCanvasOptions {
  /**
   * Optional context attributes (e.g. { alpha: false, desynchronized: true })
   */
  contextAttributes?: CanvasRenderingContext2DSettings;
  /**
   * Callback executed when the canvas is resized.
   * Useful for re-initializing size-dependent resources.
   */
  onResize?: (width: number, height: number, ctx: CanvasRenderingContext2D) => void;
  /**
   * Animation frame callback.
   * Return false to stop animation loop.
   */
  animate?: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
  ) => void | boolean;
}

export function useCanvas(options: UseCanvasOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Use refs for callbacks to avoid re-running effect on every render if callback changes
  const animateRef = useRef(options.animate);
  const onResizeRef = useRef(options.onResize);

  useEffect(() => {
    animateRef.current = options.animate;
    onResizeRef.current = options.onResize;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    // Use container if provided, otherwise fallback to parent element
    const container = containerRef.current || canvas?.parentElement;

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', options.contextAttributes);
    if (!ctx) return;
    contextRef.current = ctx;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      // Actual size in memory (scaled to account for Retina/HighDPI)
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      // Visual size (CSS)
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Normalize coordinate system
      ctx.scale(dpr, dpr);

      if (onResizeRef.current) {
        onResizeRef.current(width, height, ctx);
      }
    };

    // Initial resize
    handleResize();

    // Loop
    const loop = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const time = timestamp - startTimeRef.current;

      if (animateRef.current) {
        const shouldContinue = animateRef.current(ctx, width, height, time);
        if (shouldContinue !== false) {
          frameRef.current = requestAnimationFrame(loop);
        }
      }
    };

    if (options.animate) {
      frameRef.current = requestAnimationFrame(loop);
    }

    // Use ResizeObserver for robust resize handling
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      resizeObserver.disconnect();
    };
    // Re-run setup only if contextAttributes change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(options.contextAttributes)]);

  return { canvasRef, containerRef, contextRef };
}
