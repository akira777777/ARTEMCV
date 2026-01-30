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

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    let time = 0;

    const gridSize = 40;
    const xValues: number[] = [];
    const yValues: number[] = [];
    for (let x = 0; x < w; x += gridSize) xValues.push(x);
    for (let y = 0; y < h; y += gridSize) yValues.push(y);

    const wavePartX = new Float32Array(xValues.length);
    const lineDispX = new Float32Array(xValues.length);
    const wavePartY = new Float32Array(yValues.length);
    const lineDispY = new Float32Array(yValues.length);

    // Create initial particle emitter
    const createParticles = (x: number, y: number, count: number = 3) => {
      const colors = ['#20B5B5', '#0088FF', '#209B58', '#00FF88'];
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

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      if (isHovered) {
        createParticles(mouseRef.current.x, mouseRef.current.y, 2);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    let animationId: number;

    const animate = () => {
      // Clear with gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, w, h);
      bgGradient.addColorStop(0, '#0a1a2e');
      bgGradient.addColorStop(0.5, '#16213e');
      bgGradient.addColorStop(1, '#0f3460');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);

      // Draw animated mesh grid
      time += 0.01;
      // const gridSize = 40; // Moved to outer scope
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.1)';
      ctx.lineWidth = 1;

      // Precompute values
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

      // Draw gradient overlay
      const gradOverlay = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.hypot(w, h) * 0.7);
      gradOverlay.addColorStop(0, 'rgba(0, 255, 136, 0.15)');
      gradOverlay.addColorStop(0.5, 'rgba(0, 136, 255, 0.1)');
      gradOverlay.addColorStop(1, 'rgba(10, 26, 46, 0.3)');
      ctx.fillStyle = gradOverlay;
      ctx.fillRect(0, 0, w, h);

      // Update and draw particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Apply gravity/damping
        p.vy += 0.05;
        p.vx *= 0.99;
        p.vy *= 0.99;
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle with glow
        const alpha = (p.life / p.maxLife) * 0.8;
        ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        
        // Glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowColor = 'transparent';

      // Draw interactive center glow when hovered
      if (isHovered) {
        const glow = ctx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, 100);
        glow.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
        glow.addColorStop(1, 'rgba(0, 136, 255, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        // Draw interactive circle
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 30, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Add scanlines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = 0; y < h; y += 4) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [isHovered]);

  return (
    <div 
      className="w-full h-[360px] lg:h-[440px] rounded-[2.7rem] overflow-hidden relative bg-[#0a1a2e] cursor-crosshair transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseRef.current = { x: 0, y: 0 };
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          display: 'block',
          backgroundColor: '#0a1a2e',
        }}
      />
      
      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-[2.7rem] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(0, 255, 136, 0.1), transparent 40%), radial-gradient(circle at 70% 70%, rgba(0, 136, 255, 0.1), transparent 50%)',
          boxShadow: 'inset 0 0 30px rgba(0, 255, 136, 0.05)',
        }}
      />

      {/* Labels */}
      <div className="absolute left-6 top-6 text-sm text-emerald-300/60 font-medium z-10">Motion-first UI</div>
      <div className="absolute right-6 bottom-6 text-sm text-cyan-300/60 font-medium z-10">Interactive 3D</div>
    </div>
  );
};

export default React.memo(GradientShaderCard);
