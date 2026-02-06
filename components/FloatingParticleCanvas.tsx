import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

// Performance: Pre-calculate colors to avoid string interpolation in render loop
const OPACITY_STEPS = 10;
const CONNECTION_COLORS = Array.from({ length: OPACITY_STEPS }, (_, i) => {
  const opacity = ((i + 1) / OPACITY_STEPS) * 0.2;
  return `rgba(99, 102, 241, ${opacity})`;
});

/**
 * FloatingParticleCanvas - Canvas-based particle system with interactive physics
 * Uses requestAnimationFrame for optimal performance and hardware acceleration
 */
export const FloatingParticleCanvas: React.FC<{ 
  className?: string; 
  particleCount?: number;
  interactionRadius?: number;
  backgroundColor?: string;
}> = React.memo(({ 
  className = '', 
  particleCount = 100, 
  interactionRadius = 100,
  backgroundColor = 'transparent'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isInside: false });
  const animationFrameRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Performance: Use batches to reduce draw calls
  const batchesRef = useRef<number[][]>(Array.from({ length: OPACITY_STEPS }, () => []));

  // Initialize particles
  useEffect(() => {
    const initParticles = () => {
      const particles: Particle[] = [];
      const colors = [
        'rgba(99, 102, 241, 0.8)', // indigo-500
        'rgba(139, 92, 246, 0.8)', // purple-500
        'rgba(236, 72, 153, 0.8)', // pink-500
        'rgba(59, 130, 246, 0.8)', // blue-500
      ];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.2,
        });
      }

      particlesRef.current = particles;
    };

    if (dimensions.width > 0 && dimensions.height > 0) {
      initParticles();
    }
  }, [particleCount, dimensions]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Mouse interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseEnter = () => {
      mouseRef.current.isInside = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isInside = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas with background color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update canvas dimensions if needed
      if (dimensions.width !== canvas.width || dimensions.height !== canvas.height) {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
      }

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const batches = batchesRef.current;

      // Reset batches
      for (let i = 0; i < OPACITY_STEPS; i++) {
        batches[i].length = 0;
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply mouse interaction if mouse is inside
        if (mouse.isInside) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < interactionRadius * interactionRadius) {
            const distance = Math.sqrt(distSq);
            const force = (interactionRadius - distance) / interactionRadius;
            const angle = Math.atan2(dy, dx);
            
            // Repel particles from mouse
            p.vx += Math.cos(angle) * force * 0.2;
            p.vy += Math.sin(angle) * force * 0.2;
          }
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Boundary collision
        if (p.x <= 0 || p.x >= dimensions.width) p.vx *= -1;
        if (p.y <= 0 || p.y >= dimensions.height) p.vy *= -1;

        // Keep particles within bounds
        p.x = Math.max(0, Math.min(dimensions.width, p.x));
        p.y = Math.max(0, Math.min(dimensions.height, p.y));

        // Apply friction
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.8', p.opacity.toString());
        ctx.fill();

        // Calculate connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          // Performance: Use squared distance check to avoid Math.sqrt
          if (distSq < 10000) { // 100^2
            const distance = Math.sqrt(distSq);

            // Map opacity to step index
            let step = Math.floor((1 - distance / 100) * OPACITY_STEPS);
            if (step < 0) step = 0;
            if (step >= OPACITY_STEPS) step = OPACITY_STEPS - 1;

            batches[step].push(p.x, p.y, p2.x, p2.y);
          }
        }
      }

      // Performance: Draw batches
      ctx.lineWidth = 0.5;
      for (let i = 0; i < OPACITY_STEPS; i++) {
        const batch = batches[i];
        if (batch.length === 0) continue;

        ctx.beginPath();
        ctx.strokeStyle = CONNECTION_COLORS[i];

        for (let k = 0; k < batch.length; k += 4) {
          ctx.moveTo(batch[k], batch[k+1]);
          ctx.lineTo(batch[k+2], batch[k+3]);
        }
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [dimensions, interactionRadius, backgroundColor]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: backgroundColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
});

FloatingParticleCanvas.displayName = 'FloatingParticleCanvas';
