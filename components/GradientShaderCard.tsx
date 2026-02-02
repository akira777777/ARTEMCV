import React, { useRef, useEffect, useState, useCallback } from 'react';

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
  const mouseRef = useRef({ x: -100, y: -100 }); // Initialize off-screen
  const [isHovered, setIsHovered] = useState(false);

  // Throttle mouse movement using requestAnimationFrame for better performance
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
    // Update mouse position immediately but don't process it until next frame
    updateMousePosition(e);

    // Only schedule animation frame if not already scheduled
    if (!mouseThrottleRef.current.mouseAnimationId) {
      mouseThrottleRef.current.mouseAnimationId = requestAnimationFrame(() => {
        // Process the latest mouse position
        mouseRef.current = {
          x: mouseThrottleRef.current.mouseX,
          y: mouseThrottleRef.current.mouseY
        };

        if (isHovered) {
          // Create particles at mouse position
          const colors = [
            'rgba(14, 165, 233',  // Sky Blue
            'rgba(16, 185, 129',  // Emerald
            'rgba(245, 158, 11',  // Amber
            'rgba(139, 92, 246'   // Violet
          ];

          for (let i = 0; i < 2; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const colorIdx = Math.floor(Math.random() * colors.length);
            const speed = 1 + Math.random() * 2;
            particlesRef.current.push({
              x: mouseRef.current.x,
              y: mouseRef.current.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              radius: 1 + Math.random() * 3,
              color: colors[colorIdx],
              colorIdx,
              life: 100,
              maxLife: 100,
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

    // Optimized Canvas 2D context configuration
    const ctx = canvas.getContext('2d', { 
      alpha: false, // Disable transparency for better performance
      desynchronized: true, // Enable async rendering for smoother animation
      willReadFrequently: false // We don't read pixels back, better for GPU acceleration
    });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const dpr: number = (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
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
      sCtx.scale((typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1, (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1);
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

    // Optimized rendering constants
    const COLORS_BASE = [
      'rgba(14, 165, 233',  // Sky Blue
      'rgba(16, 185, 129',  // Emerald
      'rgba(245, 158, 11',  // Amber
      'rgba(139, 92, 246'   // Violet
    ];
    const ALPHA_STEPS = 10;

    // Pre-calculate color strings to avoid string concatenation in the animation loop
    const COLOR_STRINGS = COLORS_BASE.map(base => {
      const core: string[] = [];
      const glow: string[] = [];
      for (let a = 1; a <= ALPHA_STEPS; a++) {
        const alpha = (a / ALPHA_STEPS) * 0.8;
        core.push(`${base}, ${alpha.toFixed(2)})`);
        glow.push(`${base}, ${(alpha * 0.3).toFixed(2)})`);
      }
      return { core, glow };
    });

    // Pre-allocate batches for combined draw calls - store references to avoid indexing issues during swaps
    const batches: Particle[][][] = COLORS_BASE.map(() =>
      Array.from({ length: ALPHA_STEPS }, () => [] as Particle[])
    );

    // Create initial particle emitter with optimized particle management
    const PARTICLE_POOL_SIZE = 100; // Limit total particles for better performance
    const particlePool: Particle[] = [];
    let activeParticleCount = 0;
    
    // Pre-create particle objects to avoid GC pressure
    for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
      particlePool.push({
        x: 0, y: 0, vx: 0, vy: 0, radius: 0, color: '', colorIdx: 0, life: 0, maxLife: 0
      });
    }
    
    const createParticles = (x: number, y: number, count: number = 1) => {
      for (let i = 0; i < count; i++) {
        // Find inactive particle in pool
        if (activeParticleCount < PARTICLE_POOL_SIZE) {
          const p = particlePool[activeParticleCount++];
          const angle = (Math.random() * Math.PI * 2);
          const speed = 1 + Math.random() * 2;
          const colorIdx = Math.floor(Math.random() * COLORS_BASE.length);
          
          // Reset particle properties
          p.x = x;
          p.y = y;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.radius = 1 + Math.random() * 3;
          p.colorIdx = colorIdx;
          p.color = COLORS_BASE[colorIdx];
          p.life = 100;
          p.maxLife = 100;
        }
      }
    };

    // Enhanced mouse throttling with timestamp-based approach for better performance
    let lastMouseMoveTime = 0;
    const MOUSE_THROTTLE_DELAY = 16; // ~60fps limit
    let pendingMouseMove = false;
    let mouseAnimationId: number | null = null;
    
    const updateMousePosition = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { 
        x: clientX - rect.left, 
        y: clientY - rect.top 
      };
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = performance.now();
      
      // Throttle mouse events to prevent excessive processing
      if (currentTime - lastMouseMoveTime < MOUSE_THROTTLE_DELAY) {
        // Store the latest mouse position for next frame processing
        if (!pendingMouseMove) {
          pendingMouseMove = true;
          // Use microtask to ensure we process the latest position
          queueMicrotask(() => {
            if (pendingMouseMove && mouseAnimationId === null) {
              mouseAnimationId = requestAnimationFrame(() => {
                updateMousePosition(e.clientX, e.clientY);
                if (isHovered) {
                  createParticles(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top, 1);
                }
                mouseAnimationId = null;
                pendingMouseMove = false;
                lastMouseMoveTime = performance.now();
              });
            }
          });
        }
        return;
      }
      
      // Process mouse move immediately if enough time has passed
      lastMouseMoveTime = currentTime;
      updateMousePosition(e.clientX, e.clientY);
      
      if (isHovered) {
        createParticles(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top, 1);
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
      // Clear batches for this frame
      for (let c = 0; c < COLORS_BASE.length; c++) {
        for (let a = 0; a < ALPHA_STEPS; a++) {
          batches[c][a].length = 0;
        }
      }

      // Use particle pool instead of dynamic array for better performance
      for (let i = activeParticleCount - 1; i >= 0; i--) {
        const p = particlePool[i];
        
        p.vy += 0.05;
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (p.life <= 0) {
          // Move last active particle to current position and decrease count
          if (i < activeParticleCount - 1) {
            // Swap current with last active to maintain pool density
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
        // Push object reference instead of index to avoid ghosting issues during pool swaps
        batches[p.colorIdx][alphaIdx].push(p);
      }

      // Draw batched particles - minimizes fillStyle changes and draw calls
      for (let c = 0; c < COLORS_BASE.length; c++) {
        const colorSet = COLOR_STRINGS[c];
        for (let a = 0; a < ALPHA_STEPS; a++) {
          const activeParticles = batches[c][a];
          if (activeParticles.length === 0) continue;

          // Draw Glow Layer (combined)
          ctx.beginPath();
          ctx.fillStyle = colorSet.glow[a];
          for (let i = 0; i < activeParticles.length; i++) {
            const p = activeParticles[i];
            ctx.moveTo(p.x + p.radius * 2, p.y);
            ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          }
          ctx.fill();

          // Draw Core Layer (combined)
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
      // Clear canvas efficiently
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

    // Add mouse event listeners
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });

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
    mouseRef.current = { x: -100, y: -100 }; // Move off-screen
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