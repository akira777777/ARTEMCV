import React, { useRef, useState, useCallback } from 'react';
import { useCanvas } from '../lib/useCanvas';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
}

const OptimizedGradientShaderCard: React.FC = () => {
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Throttle mouse movement using requestAnimationFrame for better performance
  const mouseThrottleRef = useRef({
    mouseX: 0,
    mouseY: 0,
    mouseAnimationId: null as number | null
  });

  const resourcesRef = useRef<{
    bgGradient: CanvasGradient | null;
    gradOverlay: CanvasGradient | null;
    scanlineCanvas: HTMLCanvasElement | null;
    xValues: number[];
    yValues: number[];
    wavePartX: Float32Array;
    wavePartY: Float32Array;
    lineDispX: Float32Array;
    lineDispY: Float32Array;
  }>({
    bgGradient: null,
    gradOverlay: null,
    scanlineCanvas: null,
    xValues: [],
    yValues: [],
    wavePartX: new Float32Array(0),
    wavePartY: new Float32Array(0),
    lineDispX: new Float32Array(0),
    lineDispY: new Float32Array(0),
  });

  const onResize = useCallback((width: number, height: number, ctx: CanvasRenderingContext2D) => {
    const res = resourcesRef.current;
    
    // Cache gradients
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(0.5, '#1e293b');
    bgGradient.addColorStop(1, '#0c4a6e');
    res.bgGradient = bgGradient;

    const gradOverlay = ctx.createRadialGradient(width * 0.5, height * 0.5, 0, width * 0.5, height * 0.5, Math.hypot(width, height) * 0.7);
    gradOverlay.addColorStop(0, 'rgba(14, 165, 233, 0.15)');
    gradOverlay.addColorStop(0.5, 'rgba(16, 185, 129, 0.1)');
    gradOverlay.addColorStop(1, 'rgba(15, 23, 42, 0.3)');
    res.gradOverlay = gradOverlay;

    // Pre-render scanlines to offscreen canvas
    const dpr = window.devicePixelRatio || 1;
    const scanlineCanvas = document.createElement('canvas');
    scanlineCanvas.width = Math.floor(width * dpr);
    scanlineCanvas.height = Math.floor(height * dpr);
    const sCtx = scanlineCanvas.getContext('2d');
    if (sCtx) {
      sCtx.scale(dpr, dpr);
      sCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      sCtx.lineWidth = 1;
      sCtx.beginPath();
      for (let y = 0; y < height; y += 4) {
        sCtx.moveTo(0, y);
        sCtx.lineTo(width, y);
      }
      sCtx.stroke();
    }
    res.scanlineCanvas = scanlineCanvas;

    // Grid precomputation
    const gridSize = 40;
    res.xValues = [];
    res.yValues = [];
    for (let x = 0; x < width; x += gridSize) res.xValues.push(x);
    for (let y = 0; y < height; y += gridSize) res.yValues.push(y);

    // Allocate TypedArrays
    const xLen = res.xValues.length;
    const yLen = res.yValues.length;

    if (res.wavePartX.length !== xLen) {
        res.wavePartX = new Float32Array(xLen);
        res.lineDispX = new Float32Array(xLen);
    }
    if (res.wavePartY.length !== yLen) {
        res.wavePartY = new Float32Array(yLen);
        res.lineDispY = new Float32Array(yLen);
    }
  }, []);

  const animate = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, timeMs: number) => {
    const res = resourcesRef.current;
    if (!res.bgGradient) return;

    // Use derived time (seconds roughly)
    const time = timeMs * 0.000625;

    // Clear canvas efficiently
    ctx.fillStyle = res.bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw Grid
    const { xValues, yValues, wavePartX, wavePartY, lineDispX, lineDispY } = res;
    const gridSize = 40;

    const time20 = time * 20;
    const time15 = time * 15;

    for (let i = 0; i < xValues.length; i++) {
      const x = xValues[i];
      wavePartX[i] = Math.sin((x + time20) * 0.02) * 3;
      lineDispX[i] = Math.cos((x + time20) * 0.02) * 3;
    }

    for (let i = 0; i < yValues.length; i++) {
      const y = yValues[i];
      wavePartY[i] = Math.cos((y + time15) * 0.02) * 3;
      lineDispY[i] = Math.sin((y + time20) * 0.02) * 3;
    }

    ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let i = 0; i < xValues.length; i++) {
      const x = xValues[i];
      const wx = wavePartX[i];
      const hasNextX = (x + gridSize < width);

      for (let j = 0; j < yValues.length; j++) {
        const y = yValues[j];
        const wy = wavePartY[j];
        const wave = wx + wy;
        
        ctx.moveTo(x + 2, y + wave);
        ctx.arc(x, y + wave, 2, 0, Math.PI * 2);

        if (hasNextX) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + gridSize, y + lineDispY[j]);
        }

        if (y + gridSize < height) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + lineDispX[i], y + gridSize);
        }
      }
    }
    ctx.stroke();

    if (res.gradOverlay) {
        ctx.fillStyle = res.gradOverlay;
        ctx.fillRect(0, 0, width, height);
    }

    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.vy += 0.05;
      p.vx *= 0.99;
      p.vy *= 0.99;

      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = (p.life / p.maxLife) * 0.8;
      ctx.fillStyle = `${p.color}, ${alpha})`;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}, ${alpha * 0.3})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}, ${alpha})`;
      ctx.fill();
    }

    if (isHovered) {
      const glow = ctx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, 100);
      glow.addColorStop(0, 'rgba(14, 165, 233, 0.3)');
      glow.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 30, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (res.scanlineCanvas) {
      ctx.drawImage(res.scanlineCanvas, 0, 0, width, height);
    }
  }, [isHovered]);

  const { canvasRef, containerRef } = useCanvas({
    onResize,
    animate,
    contextAttributes: {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    }
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    mouseThrottleRef.current.mouseX = e.clientX - rect.left;
    mouseThrottleRef.current.mouseY = e.clientY - rect.top;

    if (!mouseThrottleRef.current.mouseAnimationId) {
      mouseThrottleRef.current.mouseAnimationId = requestAnimationFrame(() => {
        mouseRef.current = {
          x: mouseThrottleRef.current.mouseX,
          y: mouseThrottleRef.current.mouseY
        };

        if (isHovered) {
          const colors = [
            'rgba(14, 165, 233',  // Sky Blue
            'rgba(16, 185, 129',  // Emerald
            'rgba(245, 158, 11',  // Amber
            'rgba(139, 92, 246'   // Violet
          ];

          for (let i = 0; i < 2; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const speed = 1 + Math.random() * 2;
            particlesRef.current.push({
              x: mouseRef.current.x,
              y: mouseRef.current.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              radius: 1 + Math.random() * 3,
              color: colors[Math.floor(Math.random() * colors.length)],
              life: 100,
              maxLife: 100,
            });
          }
        }

        mouseThrottleRef.current.mouseAnimationId = null;
      });
    }
  }, [isHovered, containerRef]);

  const handleFocus = () => setIsHovered(true);
  const handleBlur = () => {
    setIsHovered(false);
    mouseRef.current = { x: -100, y: -100 };
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-[360px] lg:h-[440px] rounded-[2.7rem] overflow-hidden relative bg-[#0f172a] cursor-crosshair transition-all"
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseMove={handleMouseMove}
      tabIndex={0}
      role="img"
      aria-label="Interactive gradient shader card"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full gradient-shader-canvas"
      />
      
      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-[2.7rem] pointer-events-none gradient-shader-border"
      />

      {/* Labels */}
      <div className="absolute left-6 top-6 text-sm text-primary-300/60 font-medium z-10">Motion-first UI</div>
      <div className="absolute right-6 bottom-6 text-sm text-secondary-300/60 font-medium z-10">Interactive 3D</div>
    </div>
  );
};

export default React.memo(OptimizedGradientShaderCard);
