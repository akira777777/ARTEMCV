import React, { useEffect, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useReducedMotion, useIsMobile } from '../lib/hooks';

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
}

const TRAIL_LENGTH = 12;
const SPRING_CONFIG = { damping: 25, stiffness: 300, mass: 0.5 };

// Pre-calculate hues to avoid math in animation loop
const HUES = Array.from({ length: TRAIL_LENGTH }, (_, i) => 160 + (i / TRAIL_LENGTH) * 100);

// Memoized style objects for performance
const CANVAS_TRAIL_STYLE = { mixBlendMode: 'screen' } as const;

const CursorTrail: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const trailRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef<number | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, SPRING_CONFIG);
  const springY = useSpring(mouseY, SPRING_CONFIG);

  // Initialize trail points
  useEffect(() => {
    trailRef.current = Array(TRAIL_LENGTH).fill(null).map(() => ({
      x: 0,
      y: 0,
      opacity: 0,
    }));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  // Canvas trail animation
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Optimized canvas context for better performance
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2 for performance
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const animate = () => {
      if (!ctx) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      const currentX = springX.get();
      const currentY = springY.get();

      // Update trail positions by reusing objects (reduces GC pressure)
      const trail = trailRef.current;
      for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
        const p = trail[i];
        const prev = trail[i - 1];
        p.x = prev.x;
        p.y = prev.y;
        p.opacity = 1 - (i / TRAIL_LENGTH);
      }
      const p0 = trail[0];
      p0.x = currentX;
      p0.y = currentY;
      p0.opacity = 1;

      // Draw gradient trail
      for (let i = TRAIL_LENGTH - 1; i >= 0; i--) {
        const point = trail[i];
        const size = (1 - i / TRAIL_LENGTH) * 8 + 2;
        const alpha = point.opacity * 0.6;
        const hue = HUES[i];
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
        ctx.fill();

        // Glow effect
        if (i < 3) {
          const glowSize = size * 3;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 2, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, glowSize
          );
          gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, ${alpha * 0.3})`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion, isMobile, springX, springY, handleMouseMove]);

  if (prefersReducedMotion || isMobile) return null;

  return (
    <>
      {/* Canvas trail */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={CANVAS_TRAIL_STYLE}
      />
      
      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className="w-3 h-3 bg-white rounded-full" />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9997]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      >
        <div className="w-8 h-8 border border-white/30 rounded-full" />
      </motion.div>
    </>
  );
};

const MemoizedCursorTrail = React.memo(CursorTrail);
MemoizedCursorTrail.displayName = 'CursorTrail';
export default MemoizedCursorTrail;
