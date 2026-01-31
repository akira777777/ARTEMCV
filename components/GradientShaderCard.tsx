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
  const particlesRef = useRef<Particle[]>([]);
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

    // Create initial particle emitter
    const createParticles = (x: number, y: number, count: number = 3) => {
      const colors = [
        'rgba(14, 165, 233',  // Sky Blue
        'rgba(16, 185, 129',  // Emerald
        'rgba(245, 158, 11',  // Amber
        'rgba(139, 92, 246'   // Violet
      ];
      for (let i = 0; i < count; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const speed = 1 + Math.random() * 2;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 100,
          maxLife: 100,
        });
      }
    };

    // Throttle mouse movement for better performance
    let lastMouseTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseTime < 16) return; // ~60fps throttle
      lastMouseTime = now;
      
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      if (isHovered) {
        createParticles(mouseRef.current.x, mouseRef.current.y, 2);
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
        // Faster color formatting
        ctx.fillStyle = `${p.color}, ${alpha})`;
        
        // shadowBlur is extremely expensive, replaced with a glow arc
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}, ${alpha * 0.3})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}, ${alpha})`;
        ctx.fill();
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
