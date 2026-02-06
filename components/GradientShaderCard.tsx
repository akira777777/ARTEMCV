/**
 * Interactive Gradient Shader Card with particle effects
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  colorIdx: number;
  life: number;
  maxLife: number;
}

const GradientShaderCard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const mouseThrottleRef = useRef({
    mouseX: 0,
    mouseY: 0,
    mouseUpdated: false,
    mouseAnimationId: null as number | null
  });

  const updateMousePosition = useCallback((e: MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseThrottleRef.current.mouseX = e.clientX - rect.left;
    mouseThrottleRef.current.mouseY = e.clientY - rect.top;
    mouseThrottleRef.current.mouseUpdated = true;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    updateMousePosition(e);

    if (!mouseThrottleRef.current.mouseAnimationId) {
      mouseThrottleRef.current.mouseAnimationId = requestAnimationFrame(() => {
        mouseRef.current = {
          x: mouseThrottleRef.current.mouseX,
          y: mouseThrottleRef.current.mouseY
        };

        if (isHovered) {
          const colors = [
            'rgba(99, 102, 241',   // Indigo
            'rgba(139, 92, 246',   // Violet
            'rgba(14, 165, 233',   // Sky
            'rgba(236, 72, 153'    // Pink
          ];

          for (let i = 0; i < 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const colorIdx = Math.floor(Math.random() * colors.length);
            const speed = 1 + Math.random() * 2;
            particlesRef.current.push({
              x: mouseRef.current.x,
              y: mouseRef.current.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              radius: 1 + Math.random() * 2.5,
              color: colors[colorIdx],
              colorIdx,
              life: 80,
              maxLife: 80,
            });
          }
        }

        mouseThrottleRef.current.mouseAnimationId = null;
        mouseThrottleRef.current.mouseUpdated = false;
      });
    }
  }, [isHovered, updateMousePosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: false,
      desynchronized: true,
      willReadFrequently: false
    });
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    let time = 0;

    // Create gradients
    const bgGradient = ctx.createLinearGradient(0, 0, w, h);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(0.5, '#1e1b4b');
    bgGradient.addColorStop(1, '#0f172a');

    const gradOverlay = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.hypot(w, h) * 0.8);
    gradOverlay.addColorStop(0, 'rgba(99, 102, 241, 0.1)');
    gradOverlay.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)');
    gradOverlay.addColorStop(1, 'rgba(15, 23, 42, 0.2)');

    // Scanlines
    const scanlineCanvas = document.createElement('canvas');
    scanlineCanvas.width = canvas.width;
    scanlineCanvas.height = canvas.height;
    const sCtx = scanlineCanvas.getContext('2d');
    if (sCtx) {
      sCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      sCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      sCtx.lineWidth = 1;
      sCtx.beginPath();
      for (let y = 0; y < h; y += 3) {
        sCtx.moveTo(0, y);
        sCtx.lineTo(w, y);
      }
      sCtx.stroke();
    }

    // Grid setup
    const gridSize = 35;
    const xValues: number[] = [];
    const yValues: number[] = [];
    for (let x = 0; x < w; x += gridSize) xValues.push(x);
    for (let y = 0; y < h; y += gridSize) yValues.push(y);
    const wavePartX = new Float32Array(xValues.length);
    const wavePartY = new Float32Array(yValues.length);

    // Colors
    const COLORS_BASE = [
      'rgba(99, 102, 241',
      'rgba(139, 92, 246',
      'rgba(14, 165, 233',
      'rgba(236, 72, 153'
    ];
    const ALPHA_STEPS = 8;

    const COLOR_STRINGS = COLORS_BASE.map(base => {
      const core: string[] = [];
      const glow: string[] = [];
      for (let a = 1; a <= ALPHA_STEPS; a++) {
        const alpha = (a / ALPHA_STEPS) * 0.7;
        core.push(`${base}, ${alpha.toFixed(2)})`);
        glow.push(`${base}, ${(alpha * 0.25).toFixed(2)})`);
      }
      return { core, glow };
    });

    const batches: Particle[][][] = COLORS_BASE.map(() =>
      Array.from({ length: ALPHA_STEPS }, () => [] as Particle[])
    );

    const PARTICLE_POOL_SIZE = 80;
    const particlePool: Particle[] = [];
    let activeParticleCount = 0;

    for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
      particlePool.push({
        x: 0, y: 0, vx: 0, vy: 0, radius: 0, color: '', colorIdx: 0, life: 0, maxLife: 0
      });
    }

    const createParticles = (x: number, y: number, count: number = 1) => {
      for (let i = 0; i < count; i++) {
        if (activeParticleCount < PARTICLE_POOL_SIZE) {
          const p = particlePool[activeParticleCount++];
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.8 + Math.random() * 1.5;
          const colorIdx = Math.floor(Math.random() * COLORS_BASE.length);
          
          p.x = x;
          p.y = y;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.radius = 1 + Math.random() * 2;
          p.colorIdx = colorIdx;
          p.color = COLORS_BASE[colorIdx];
          p.life = 60;
          p.maxLife = 60;
        }
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationId: number;

    const drawGrid = () => {
      time += 0.008;
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.lineWidth = 1;

      const time15 = time * 15;
      const time10 = time * 10;

      for (let i = 0; i < xValues.length; i++) {
        const x = xValues[i];
        wavePartX[i] = Math.sin((x + time15) * 0.015) * 4;
      }

      for (let i = 0; i < yValues.length; i++) {
        const y = yValues[i];
        wavePartY[i] = Math.cos((y + time10) * 0.015) * 4;
      }

      ctx.beginPath();
      for (let i = 0; i < xValues.length; i++) {
        const x = xValues[i];
        const wx = wavePartX[i];

        for (let j = 0; j < yValues.length; j++) {
          const y = yValues[j];
          const wy = wavePartY[j];
          const wave = wx + wy;
          
          ctx.moveTo(x + 1.5, y + wave);
          ctx.arc(x, y + wave, 1.5, 0, Math.PI * 2);

          if (x + gridSize < w) {
            ctx.moveTo(x, y + wave);
            ctx.lineTo(x + gridSize, y + wavePartY[j]);
          }

          if (y + gridSize < h) {
            ctx.moveTo(x + wave, y);
            ctx.lineTo(x + wave, y + gridSize);
          }
        }
      }
      ctx.stroke();
    };

    const drawParticles = () => {
      for (let c = 0; c < COLORS_BASE.length; c++) {
        for (let a = 0; a < ALPHA_STEPS; a++) {
          batches[c][a].length = 0;
        }
      }

      for (let i = activeParticleCount - 1; i >= 0; i--) {
        const p = particlePool[i];
        
        p.vy += 0.04;
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (p.life <= 0) {
          if (i < activeParticleCount - 1) {
            const lastActiveIdx = activeParticleCount - 1;
            const temp = particlePool[i];
            particlePool[i] = particlePool[lastActiveIdx];
            particlePool[lastActiveIdx] = temp;
          }
          activeParticleCount--;
          continue;
        }

        const alphaNorm = p.life / p.maxLife;
        const alphaIdx = Math.min(Math.floor(alphaNorm * ALPHA_STEPS), ALPHA_STEPS - 1);
        batches[p.colorIdx][alphaIdx].push(p);
      }

      for (let c = 0; c < COLORS_BASE.length; c++) {
        const colorSet = COLOR_STRINGS[c];
        for (let a = 0; a < ALPHA_STEPS; a++) {
          const activeParticles = batches[c][a];
          if (activeParticles.length === 0) continue;

          ctx.beginPath();
          ctx.fillStyle = colorSet.glow[a];
          for (let i = 0; i < activeParticles.length; i++) {
            const p = activeParticles[i];
            ctx.moveTo(p.x + p.radius * 2, p.y);
            ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          }
          ctx.fill();

          ctx.beginPath();
          ctx.fillStyle = colorSet.core[a];
          for (let i = 0; i < activeParticles.length; i++) {
            const p = activeParticles[i];
            ctx.moveTo(p.x + p.radius, p.y);
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      }
    };

    const drawHoverGlow = () => {
      if (!isHovered) return;

      const glow = ctx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, 120);
      glow.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      glow.addColorStop(0.5, 'rgba(139, 92, 246, 0.1)');
      glow.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 25, 0, Math.PI * 2);
      ctx.stroke();
    };

    const animate = () => {
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);

      drawGrid();
      ctx.fillStyle = gradOverlay;
      ctx.fillRect(0, 0, w, h);
      drawParticles();
      drawHoverGlow();
      ctx.drawImage(scanlineCanvas, 0, 0, w, h);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (mouseThrottleRef.current.mouseAnimationId) {
        cancelAnimationFrame(mouseThrottleRef.current.mouseAnimationId);
      }
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [handleMouseMove, isHovered]);

  const handleFocus = () => setIsHovered(true);
  const handleBlur = () => {
    setIsHovered(false);
    mouseRef.current = { x: -100, y: -100 };
  };

  return (
    <div 
      className="w-full h-[360px] lg:h-[440px] rounded-[2rem] overflow-hidden relative bg-[#0f172a] cursor-crosshair group"
      onMouseEnter={handleFocus}
      onMouseLeave={handleBlur}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      role="img"
      aria-label="Interactive gradient shader card"
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      
      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-[2rem] pointer-events-none border border-white/5 group-hover:border-indigo-500/30 transition-colors duration-500" />
      
      {/* Outer glow */}
      <div className="absolute -inset-px rounded-[2rem] pointer-events-none bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm" />

      {/* Labels */}
      <div className="absolute left-6 top-6 flex items-center gap-2 text-sm text-white/40 font-medium z-10">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span>Motion-first UI</span>
      </div>
      
      <div className="absolute right-6 bottom-6 flex items-center gap-2 text-sm text-white/40 font-medium z-10">
        <span>Interactive 3D</span>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-indigo-500/50 to-transparent" />
      <div className="absolute top-0 left-0 w-px h-20 bg-gradient-to-b from-indigo-500/50 to-transparent" />
      <div className="absolute bottom-0 right-0 w-20 h-px bg-gradient-to-l from-purple-500/50 to-transparent" />
      <div className="absolute bottom-0 right-0 w-px h-20 bg-gradient-to-t from-purple-500/50 to-transparent" />
    </div>
  );
};

const MemoizedGradientShaderCard = React.memo(GradientShaderCard);
MemoizedGradientShaderCard.displayName = 'GradientShaderCard';
export default MemoizedGradientShaderCard;
