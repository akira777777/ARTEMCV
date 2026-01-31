import React, { useRef, useEffect, useState } from 'react';

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

const GradientShaderCard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const dpr = globalThis.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    let time = 0;

    // Cache gradients (created once, not every frame)
    const bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(0.5, '#1e293b');
    bgGradient.addColorStop(1, '#0c4a6e');

    const gradOverlay = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.hypot(w, h) * 0.7);
    gradOverlay.addColorStop(0, 'rgba(14, 165, 233, 0.15)');
    gradOverlay.addColorStop(0.5, 'rgba(16, 185, 129, 0.1)');
    gradOverlay.addColorStop(1, 'rgba(15, 23, 42, 0.3)');

    // Pre-render scanlines to offscreen canvas
    const scanlineCanvas = document.createElement('canvas');
    scanlineCanvas.width = canvas.width;
    scanlineCanvas.height = canvas.height;
    const sCtx = scanlineCanvas.getContext('2d');
    if (sCtx) {
      sCtx.scale(dpr, dpr);
      sCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      sCtx.lineWidth = 1;
      sCtx.beginPath();
      for (let y = 0; y < h; y += 4) {
        sCtx.moveTo(0, y);
        sCtx.lineTo(w, y);
      }
      sCtx.stroke();
    }

    // Grid precomputation
    const gridSize = 40;
    const xValues: number[] = [];
    const yValues: number[] = [];
    for (let x = 0; x < w; x += gridSize) xValues.push(x);
    for (let y = 0; y < h; y += gridSize) yValues.push(y);
    const wavePartX = new Float32Array(xValues.length);
    const wavePartY = new Float32Array(yValues.length);
    const lineDispX = new Float32Array(xValues.length);
    const lineDispY = new Float32Array(yValues.length);

    // Pre-allocate particle pool to avoid GC
    const MAX_PARTICLES = 150;
    const COLORS = [
      'rgba(14, 165, 233',  // Sky Blue
      'rgba(16, 185, 129',  // Emerald
      'rgba(245, 158, 11',  // Amber
      'rgba(139, 92, 246'   // Violet
    ];

    const pool = new Array(MAX_PARTICLES).fill(null).map(() => ({
      active: false,
      x: 0, y: 0, vx: 0, vy: 0, radius: 0, colorIdx: 0, life: 0, maxLife: 0
    }));

    const createParticles = (x: number, y: number, count: number = 2) => {
      let created = 0;
      for (let i = 0; i < MAX_PARTICLES && created < count; i++) {
        const p = pool[i];
        if (!p.active) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 2;
          p.active = true;
          p.x = x;
          p.y = y;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.radius = 1 + Math.random() * 3;
          p.colorIdx = Math.floor(Math.random() * COLORS.length);
          p.life = 100;
          p.maxLife = 100;
          created++;
        }
      }
    };

    // Throttle mouse movement using requestAnimationFrame for better performance
    let mouseX = 0;
    let mouseY = 0;
    let mouseUpdated = false;
    let mouseAnimationId: number | null = null;
    
    const updateMousePosition = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseUpdated = true;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Update mouse position immediately but don't process it until next frame
      updateMousePosition(e);
      
      // Only schedule animation frame if not already scheduled
      if (!mouseAnimationId) {
        mouseAnimationId = requestAnimationFrame(() => {
          // Process the latest mouse position
          mouseRef.current = { x: mouseX, y: mouseY };
          
          if (isHovered) {
            createParticles(mouseX, mouseY, 2);
          }
          
          mouseAnimationId = null;
          mouseUpdated = false;
        });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationId: number;

    const drawGrid = () => {
      time += 0.01;
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)';
      ctx.lineWidth = 1;

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

      ctx.beginPath();
      for (let i = 0; i < xValues.length; i++) {
        const x = xValues[i];
        const wx = wavePartX[i];
        const hasNextX = (x + gridSize < w);

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

          if (y + gridSize < h) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + lineDispX[i], y + gridSize);
          }
        }
      }
      ctx.stroke();
    };

    const drawParticles = () => {
      // Group by color and quantized alpha for batched drawing
      // Quantizing alpha into 4 steps: 0.2, 0.4, 0.6, 0.8
      const ALPHA_STEPS = 4;
      const batches: number[][][] = COLORS.map(() =>
        new Array(ALPHA_STEPS).fill(null).map(() => [])
      );

      for (let i = 0; i < MAX_PARTICLES; i++) {
        const p = pool[i];
        if (!p.active) continue;
        
        p.vy += 0.05;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (p.life <= 0) {
          p.active = false;
          continue;
        }

        const alphaNorm = p.life / p.maxLife;
        const alphaIdx = Math.min(Math.floor(alphaNorm * ALPHA_STEPS), ALPHA_STEPS - 1);
        batches[p.colorIdx][alphaIdx].push(i);
      }

      // Draw batched particles
      for (let c = 0; c < COLORS.length; c++) {
        const baseColor = COLORS[c];
        for (let a = 0; a < ALPHA_STEPS; a++) {
          const indices = batches[c][a];
          if (indices.length === 0) continue;

          const alpha = (a + 1) / ALPHA_STEPS * 0.8;

          // Draw Glow Layer (combined)
          ctx.beginPath();
          ctx.fillStyle = `${baseColor}, ${alpha * 0.3})`;
          for (const idx of indices) {
            const p = pool[idx];
            ctx.moveTo(p.x + p.radius * 2, p.y);
            ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          }
          ctx.fill();

          // Draw Core Layer (combined)
          ctx.beginPath();
          ctx.fillStyle = `${baseColor}, ${alpha})`;
          for (const idx of indices) {
            const p = pool[idx];
            ctx.moveTo(p.x + p.radius, p.y);
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      }
    };

    const drawHoverGlow = () => {
      if (!isHovered) return;

      const glow = ctx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, 100);
      glow.addColorStop(0, 'rgba(14, 165, 233, 0.3)');
      glow.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 30, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawScanlines = () => {
      ctx.drawImage(scanlineCanvas, 0, 0, w, h);
    };

    const animate = () => {
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);

      drawGrid();

      ctx.fillStyle = gradOverlay;
      ctx.fillRect(0, 0, w, h);

      drawParticles();
      drawHoverGlow();
      drawScanlines();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (mouseAnimationId) {
        cancelAnimationFrame(mouseAnimationId);
      }
      cancelAnimationFrame(animationId);
    };
  }, [isHovered]);

  const handleFocus = () => setIsHovered(true);
  const handleBlur = () => {
    setIsHovered(false);
    mouseRef.current = { x: 0, y: 0 };
  };

  return (
    <div 
      className="w-full h-[360px] lg:h-[440px] rounded-[2.7rem] overflow-hidden relative bg-[#0f172a] cursor-crosshair transition-all"
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      onFocus={handleFocus}
      onBlur={handleBlur}
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

export default React.memo(GradientShaderCard);
