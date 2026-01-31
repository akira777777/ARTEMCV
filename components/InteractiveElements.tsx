import React from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedLink Component - Link with animated SVG underline effect
 */
export const AnimatedLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}> = React.memo(({ href, children, className = '', target, rel }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-block ${className}`}
    >
      {children}
      <motion.svg
        className="absolute left-0 bottom-0 w-full"
        height="4"
        viewBox="0 0 100 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <motion.path
          d="M0 2 Q25 0, 50 2 T100 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isHovered ? 1 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </motion.svg>
    </motion.a>
  );
});

AnimatedLink.displayName = 'AnimatedLink';

/**
 * InteractiveDotGrid Component - Interactive grid of dots that respond to mouse movement
 */
export const InteractiveDotGrid: React.FC = React.memo(() => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const gridSize = 8;
  const dotSize = 40;
  const gapSize = 20;

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getDotDistance = (dotX: number, dotY: number) => {
    const dx = dotX - mousePosition.x;
    const dy = dotY - mousePosition.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getDotScale = (distance: number) => {
    const maxDistance = 150;
    if (distance > maxDistance) return 1;
    return 1 + (maxDistance - distance) / maxDistance * 0.8;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-96 flex items-center justify-center perspective"
      role="presentation"
      aria-hidden="true"
    >
      <div className="relative" style={{ width: gridSize * (dotSize + gapSize), height: gridSize * (dotSize + gapSize) }}>
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const row = Math.floor(index / gridSize);
          const col = index % gridSize;
          const x = col * (dotSize + gapSize);
          const y = row * (dotSize + gapSize);
          const distance = getDotDistance(x + dotSize / 2, y + dotSize / 2);
          const scale = getDotScale(distance);

          return (
            <motion.div
              key={index}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
              style={{
                left: x,
                top: y,
              }}
              animate={{
                scale: scale,
                boxShadow: `0 0 ${15 * scale}px rgba(99, 102, 241, ${0.6 * scale})`,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            />
          );
        })}
      </div>
    </div>
  );
});

InteractiveDotGrid.displayName = 'InteractiveDotGrid';

/**
 * Eyes Component - Interactive eyes that follow mouse movement
 */
export const Eyes: React.FC = React.memo(() => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-96 flex items-center justify-center gap-16 perspective"
      role="presentation"
      aria-hidden="true"
    >
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.6)]"
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <motion.div
            className="w-12 h-12 rounded-full bg-black"
            animate={{
              x: mousePosition.x * 0.3,
              y: mousePosition.y * 0.3,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          />
        </motion.div>
      ))}
    </div>
  );
});

Eyes.displayName = 'Eyes';

/**
 * ParticleText Component - Text with animated particle effects
 */
export const ParticleText: React.FC<{ text: string }> = React.memo(({ text }) => {
  const [particles, setParticles] = React.useState<Array<{ id: number; x: number; y: number }>>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  let particleId = React.useRef(0);

  const createParticles = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticles = Array.from({ length: 8 }, () => ({
      id: particleId.current++,
      x,
      y,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 600);
  };

  return (
    <div
      ref={containerRef}
      onClick={createParticles}
      className="relative w-full py-20 text-center cursor-pointer group"
    >
      <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 select-none uppercase transition-all group-hover:from-indigo-400 group-hover:to-purple-500">
        {text}
      </h2>

      {/* Particle effects */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 pointer-events-none"
          initial={{ x: particle.x, y: particle.y, opacity: 1, scale: 1 }}
          animate={{
            x: particle.x + (Math.random() - 0.5) * 200,
            y: particle.y + (Math.random() - 0.5) * 200,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
});

ParticleText.displayName = 'ParticleText';

/**
 * Combined Interactive Section with Eyes, ParticleText, and DotGrid
 */
export const InteractiveSection: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-black via-neutral-950 to-black">
      <div className="absolute -top-32 left-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl float-slow" aria-hidden="true" />
      <div className="container mx-auto px-6 relative z-10">
        <ParticleText text="INTERACT & EXPLORE" />
        <Eyes />
        <div className="mt-16">
          <InteractiveDotGrid />
        </div>
        <p className="text-center text-neutral-400 text-sm mt-12">
          ✨ Move your mouse and click to see the magic
        </p>
      </div>
    </section>
  );
};

InteractiveSection.displayName = 'InteractiveSection';
