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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentX = springX.get();
      const currentY = springY.get();

      // Update trail positions
      for (let i = trailRef.current.length - 1; i > 0; i--) {
        trailRef.current[i] = {
          x: trailRef.current[i - 1].x,
          y: trailRef.current[i - 1].y,
          opacity: 1 - (i / TRAIL_LENGTH),
        };
      }
      trailRef.current[0] = { x: currentX, y: currentY, opacity: 1 };

      // Draw gradient trail
      for (let i = trailRef.current.length - 1; i >= 0; i--) {
        const point = trailRef.current[i];
        const size = (1 - i / TRAIL_LENGTH) * 8 + 2;
        const alpha = point.opacity * 0.6;

        // Gradient from emerald to indigo
        const hue = 160 + (i / TRAIL_LENGTH) * 100; // emerald to indigo
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
        ctx.fill();

        // Glow effect
        if (i < 3) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 2, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, size * 3
          );
          gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, ${alpha * 0.3})`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
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
        style={{ mixBlendMode: 'screen' }}
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

export default React.memo(CursorTrail);
