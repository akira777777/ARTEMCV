import React, { useRef, useState, useCallback } from 'react';
import { useCanvas } from '../lib/useCanvas';

// OPTIMIZATION: Constants defined outside component to avoid recreation
const PARTICLE_COUNT = 100;
const PARTICLE_STRIDE = 4; // x, y, vx, vy
const CONNECTION_DISTANCE = 100;
const CONNECTION_DISTANCE_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE; // Pre-calc square to avoid Math.sqrt()
const MAX_PARTICLES = 200; // Limit total particles for better performance

// OPTIMIZATION: Pre-defined colors to avoid string concatenation in loop
const HEX_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899']; // Tailwind blue, violet, pink

interface EnhancedGradientShaderCardProps {
  className?: string;
}

const EnhancedGradientShaderCard: React.FC<EnhancedGradientShaderCardProps> = ({ className }) => {
  const mouseRef = useRef({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  
  // OPTIMIZATION: Float32Array for high-performance arithmetic and memory locality
  // Layout: [x1, y1, vx1, vy1, x2, y2, vx2, vy2, ...]
  const particlesRef = useRef<Float32Array | null>(null);
  
  // OPTIMIZATION: Cache gradient to avoid createLinearGradient every frame
  const gradientCacheRef = useRef<CanvasGradient | null>(null);
  
  // OPTIMIZATION: Pre-allocated arrays for particle management
  const particlePoolRef = useRef<Float32Array | null>(null);
  const activeParticleIndicesRef = useRef<Uint8Array | null>(null);
  const activeParticleCountRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    // Initialize Float32Array only if size changes significantly or first run
    if (!particlesRef.current || particlesRef.current.length !== MAX_PARTICLES * PARTICLE_STRIDE) {
      particlesRef.current = new Float32Array(MAX_PARTICLES * PARTICLE_STRIDE);
      particlePoolRef.current = new Float32Array(MAX_PARTICLES * PARTICLE_STRIDE);
      activeParticleIndicesRef.current = new Uint8Array(MAX_PARTICLES);
      activeParticleCountRef.current = 0;
    }

    const data = particlesRef.current;
    const activeIndices = activeParticleIndicesRef.current!;
    // If we have fewer particles than target (e.g. initial load), add them
    if (activeParticleCountRef.current < PARTICLE_COUNT) {
        for (let i = activeParticleCountRef.current; i < PARTICLE_COUNT; i++) {
          const idx = i * PARTICLE_STRIDE;
          data[idx] = Math.random() * width;      // x
          data[idx + 1] = Math.random() * height; // y
          data[idx + 2] = (Math.random() - 0.5) * 0.5; // vx
          data[idx + 3] = (Math.random() - 0.5) * 0.5; // vy
          activeIndices[i] = 1;
        }
        activeParticleCountRef.current = PARTICLE_COUNT;
    }
  }, []);

  const createMouseParticle = useCallback((x: number, y: number) => {
    if (activeParticleCountRef.current >= MAX_PARTICLES) {
      // Remove oldest particle to make room (shift)
      // Note: This shift operation is O(N) which is expensive for large MAX_PARTICLES
      // A ring buffer would be O(1) but more complex to manage with linear memory stride
      for (let i = 0; i < MAX_PARTICLES - 1; i++) {
        const srcIdx = (i + 1) * PARTICLE_STRIDE;
        const dstIdx = i * PARTICLE_STRIDE;
        const data = particlesRef.current!;
        data[dstIdx] = data[srcIdx];
        data[dstIdx + 1] = data[srcIdx + 1];
        data[dstIdx + 2] = data[srcIdx + 2];
        data[dstIdx + 3] = data[srcIdx + 3];
      }
      activeParticleCountRef.current = MAX_PARTICLES - 1;
    }

    const data = particlesRef.current!;
    const activeIndices = activeParticleIndicesRef.current!;
    const newIdx = activeParticleCountRef.current * PARTICLE_STRIDE;
    
    data[newIdx] = x;                              // x
    data[newIdx + 1] = y;                          // y
    data[newIdx + 2] = (Math.random() - 0.5) * 1;  // vx
    data[newIdx + 3] = (Math.random() - 0.5) * 1;  // vy
    
    activeIndices[activeParticleCountRef.current] = 1;
    activeParticleCountRef.current++;
  }, []);

  const animate = useCallback((
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ) => {
    if (!particlesRef.current) return;
    
    const data = particlesRef.current;
    const activeIndices = activeParticleIndicesRef.current!;
    const activeCount = activeParticleCountRef.current;

    // Clear canvas efficiently
    ctx.clearRect(0, 0, width, height);

    // OPTIMIZATION: Batched drawing for connections
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let i = 0; i < activeCount; i++) {
      if (!activeIndices[i]) continue;
      
      const idx = i * PARTICLE_STRIDE;
      const x = data[idx];
      const y = data[idx + 1];

      // Update positions
      data[idx] += data[idx + 2];     // x += vx
      data[idx + 1] += data[idx + 3]; // y += vy

      // Bounce off walls
      if (data[idx] < 0 || data[idx] > width) data[idx + 2] *= -1;
      if (data[idx + 1] < 0 || data[idx + 1] > height) data[idx + 3] *= -1;

      // Mouse interaction - attract particles near mouse
      if (isHovered) {
        const dx = mouseRef.current.x - data[idx];
        const dy = mouseRef.current.y - data[idx + 1];
        const distSq = dx * dx + dy * dy;
        
        if (distSq < 5000) { // Within influence radius
          const force = Math.min(0.1, 1000 / distSq); // Inverse square law with cap
          data[idx + 2] += dx * force * 0.05;
          data[idx + 3] += dy * force * 0.05;
          
          // Add particles at mouse position when hovering
          if (Math.random() > 0.7) {
            createMouseParticle(mouseRef.current.x, mouseRef.current.y);
          }
        }
      }

      // Check connections (Inner loop optimization)
      for (let j = i + 1; j < activeCount; j++) {
        if (!activeIndices[j]) continue;
        
        const jdx = j * PARTICLE_STRIDE;
        const dx = data[idx] - data[jdx];
        const dy = data[idx + 1] - data[jdx + 1];
        
        // OPTIMIZATION: Compare squared distance to avoid expensive Math.sqrt()
        if (dx * dx + dy * dy < CONNECTION_DISTANCE_SQ) {
          ctx.moveTo(x, y);
          ctx.lineTo(data[jdx], data[jdx + 1]);
        }
      }
    }
    ctx.stroke(); // Single draw call for all lines

    // OPTIMIZATION: Use cached gradient
    if (!gradientCacheRef.current) {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, HEX_COLORS[0]);
      gradient.addColorStop(0.5, HEX_COLORS[1]);
      gradient.addColorStop(1, HEX_COLORS[2]);
      gradientCacheRef.current = gradient;
    }

    ctx.fillStyle = gradientCacheRef.current;
    ctx.beginPath();
    
    // Batch draw all particles in one path
    for (let i = 0; i < activeCount; i++) {
      if (!activeIndices[i]) continue;
      
      const idx = i * PARTICLE_STRIDE;
      ctx.moveTo(data[idx] + 2, data[idx + 1]); 
      ctx.arc(data[idx], data[idx + 1], 2, 0, Math.PI * 2);
    }
    ctx.fill();

  }, [isHovered, createMouseParticle]);

  const onResize = useCallback((width: number, height: number) => {
    gradientCacheRef.current = null;
    initParticles(width, height);
  }, [initParticles]);

  const { canvasRef, containerRef } = useCanvas({
    onResize,
    animate,
    contextAttributes: {
      alpha: true,
      desynchronized: true,
      willReadFrequently: false
    }
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    if (isHovered && Math.random() > 0.3) { // Throttle particle creation
      createMouseParticle(mouseRef.current.x, mouseRef.current.y);
    }
  }, [isHovered, createMouseParticle, containerRef]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseRef.current = { x: -100, y: -100 }; // Move off-screen
      }}
      role="img"
      aria-label="Interactive gradient shader card"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default React.memo(EnhancedGradientShaderCard);
