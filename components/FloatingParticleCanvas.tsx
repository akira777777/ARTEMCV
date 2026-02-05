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
  rgbaPrefix: string;
}

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

  const interactionRadiusSq = interactionRadius * interactionRadius;
  const connectionRadiusSq = 10000; // 100 * 100

  useEffect(() => {
    const initParticles = () => {
      const particles: Particle[] = [];
      const colorData = [
        { prefix: 'rgba(99, 102, 241,', base: 'rgba(99, 102, 241, 0.8)' },
        { prefix: 'rgba(139, 92, 246,', base: 'rgba(139, 92, 246, 0.8)' },
        { prefix: 'rgba(236, 72, 153,', base: 'rgba(236, 72, 153, 0.8)' },
        { prefix: 'rgba(59, 130, 246,', base: 'rgba(59, 130, 246, 0.8)' },
      ];

      for (let i = 0; i < particleCount; i++) {
        const color = colorData[Math.floor(Math.random() * colorData.length)];
        particles.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: color.base,
          rgbaPrefix: color.prefix,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      particlesRef.current = particles;
    };

    if (dimensions.width > 0 && dimensions.height > 0) {
      initParticles();
    }
  }, [particleCount, dimensions]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const handleMouseEnter = () => { mouseRef.current.isInside = true; };
    const handleMouseLeave = () => { mouseRef.current.isInside = false; };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: backgroundColor === 'transparent' });
    if (!ctx) return;

    const animate = () => {
      if (backgroundColor === 'transparent') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (dimensions.width !== canvas.width || dimensions.height !== canvas.height) {
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
      }

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const numParticles = particles.length;

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        if (mouse.isInside) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < interactionRadiusSq) {
            const distance = Math.sqrt(distSq);
            const force = (interactionRadius - distance) / interactionRadius;
            const invDist = 1 / (distance || 1);
            p.vx += (dx * invDist) * force * 0.2;
            p.vy += (dy * invDist) * force * 0.2;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= dimensions.width) p.vx *= -1;
        if (p.y <= 0 || p.y >= dimensions.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(dimensions.width, p.x));
        p.y = Math.max(0, Math.min(dimensions.height, p.y));
        p.vx *= 0.99;
        p.vy *= 0.99;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.rgbaPrefix} ${p.opacity})`;
        ctx.fill();
      }

      const opacitySteps = 5;
      const connectionPaths = Array.from({ length: opacitySteps }, () => new Path2D());
      for (let i = 0; i < numParticles; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < numParticles; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < connectionRadiusSq) {
            const distance = Math.sqrt(distSq);
            const normalizedDist = 1 - distance / 100;
            const step = Math.floor(normalizedDist * (opacitySteps - 1));
            const path = connectionPaths[step];
            path.moveTo(p1.x, p1.y);
            path.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.lineWidth = 0.5;
      for (let s = 0; s < opacitySteps; s++) {
        const alpha = (s + 1) / opacitySteps * 0.2;
        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.stroke(connectionPaths[s]);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [dimensions, interactionRadius, interactionRadiusSq, backgroundColor]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: backgroundColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        role="presentation"
        aria-label="Floating particles background"
      />
    </div>
  );
});

FloatingParticleCanvas.displayName = 'FloatingParticleCanvas';
