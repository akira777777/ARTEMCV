import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code2, Palette, Zap, Users } from 'lucide-react';
import { useI18n } from '../i18n';
import { ServicesGrid } from './ServicesGrid';
import { scrollToSection } from '../lib/utils';

const LazyParticleText = React.lazy(() => import('./InteractiveElements').then(m => ({ default: m.ParticleText })));

const FloatingOrb: React.FC<{ 
  delay: number; 
  size: number; 
  color: string;
  mouseX: number;
  mouseY: number;
}> = React.memo(({ delay, size, color, mouseX, mouseY }) => {
  const springConfig = { stiffness: 100 - delay * 10, damping: 20 };
  const x = useSpring(mouseX * (0.3 - delay * 0.05), springConfig);
  const y = useSpring(mouseY * (0.3 - delay * 0.05), springConfig);

  React.useEffect(() => {
    x.set(mouseX * (0.3 - delay * 0.05));
    y.set(mouseY * (0.3 - delay * 0.05));
  }, [mouseX, mouseY, x, y, delay]);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        x,
        y,
        filter: 'blur(1px)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.6, 1, 0.6],
        scale: [1, 1.2, 1],
      }}
      transition={{
        opacity: { duration: 2, repeat: Infinity, delay: delay * 0.3 },
        scale: { duration: 3, repeat: Infinity, delay: delay * 0.3 },
      }}
    />
  );
});

const AnimatedLetter: React.FC<{ 
  letter: string; 
  index: number;
}> = React.memo(({ letter, index }) => {
  const baseDelay = index * 0.1;

  return (
    <motion.span
      className="inline-block relative"
      initial={{ opacity: 0, y: 100, rotateX: -90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.8,
        delay: baseDelay,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.1,
        color: '#8b5cf6',
        textShadow: '0 0 40px rgba(139, 92, 246, 0.8)',
        transition: { duration: 0.2 },
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {letter}
      {(letter === 'U' || letter === 'E') && (
        <motion.span
          className="absolute -top-2 -right-1 w-3 h-3 rounded-full"
          style={{
            background: letter === 'U' ? '#ec4899' : '#22d3ee',
            boxShadow: `0 0 15px ${letter === 'U' ? 'rgba(236, 72, 153, 0.8)' : 'rgba(34, 211, 238, 0.8)'}`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
        />
      )}
    </motion.span>
  );
});

const CustomCursor: React.FC<{ mouseX: number; mouseY: number }> = React.memo(({ mouseX, mouseY }) => {
  const springConfig = { stiffness: 500, damping: 28 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '2px solid rgba(139, 92, 246, 0.8)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)',
        }}
      />
    </>
  );
});

const Hero: React.FC = React.memo(() => {
  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  }, []);

  const scrollToWorks = useCallback(() => {
    document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const orbColors = [
    'linear-gradient(135deg, #ec4899, #f472b6)',
    'linear-gradient(135deg, #22d3ee, #67e8f9)',
    'linear-gradient(135deg, #a855f7, #c084fc)',
    'linear-gradient(135deg, #3b82f6, #60a5fa)',
    'linear-gradient(135deg, #10b981, #34d399)',
  ];

  type Particle = {
    id: number;
    delay: number;
    size: number;
    x: number;
    y: number;
  };

  const particles = useMemo((): Particle[] => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 15,
      size: Math.random() * 8 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
    })),
    []
  );

  const stats = useMemo(() => [
    { 
      value: '50+', 
      label: t('hero.stats.projects'), 
      icon: Code2,
      color: 'text-blue-400',
      delay: 0.2 
    },
    { 
      value: '8Y+', 
      label: t('hero.stats.experience'), 
      icon: Zap,
      color: 'text-purple-400',
      delay: 0.4 
    },
    { 
      value: '30+', 
      label: t('hero.stats.clients'), 
      icon: Users,
      color: 'text-pink-400',
      delay: 0.6 
    },
    { 
      value: '12', 
      label: t('hero.stats.awards'), 
      icon: Palette,
      color: 'text-cyan-400',
      delay: 0.8 
    },
  ], [t]);

  const progress = Math.min(scrollY / Math.max(globalThis.document?.body.scrollHeight - globalThis.window?.innerHeight || 1, 1) * 100, 100);

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden pt-28 pb-40"
      aria-label="Hero section"
    >
      <AnimatePresence>
        {isHovering && (
          <CustomCursor 
            mouseX={mousePosition.x + (containerRef.current?.getBoundingClientRect().left ?? 0) + (containerRef.current?.getBoundingClientRect().width ?? 0) / 2} 
            mouseY={mousePosition.y + (containerRef.current?.getBoundingClientRect().top ?? 0) + (containerRef.current?.getBoundingClientRect().height ?? 0) / 2} 
          />
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.12)_0%,transparent_50%)]" />
        
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full opacity-20 pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: '#8B5CF6'
            }}
            animate={{ 
              y: [-20, 20],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {orbColors.map((color, i) => (
          <FloatingOrb
            key={i}
            delay={i}
            size={12 + i * 4}
            color={color}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
          />
        ))}
      </div>

      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-secondary z-[100]"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Scroll progress indicator"
      />

      <div className="z-10 relative w-full max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-xs tracking-widest font-bold text-primary-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              ✦ {t('hero.badge')}
            </motion.div>
              
            <motion.h1 
              className="text-[11vw] sm:text-[9vw] lg:text-[6.5rem] leading-[0.9] font-display font-black tracking-tighter text-white select-none uppercase"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {'JULES'.split('').map((letter, index) => (
                <AnimatedLetter key={index} letter={letter} index={index} />
              ))}
            </motion.h1>

            <motion.p
              className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.button
                onClick={scrollToWorks}
                className="px-8 py-4 bg-primary text-white font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('hero.cta.explore')} <ArrowRight className="w-4 h-4 inline-block ml-2" />
              </motion.button>
              <button
                onClick={scrollToContact}
                className="px-8 py-4 border border-white/10 text-white font-semibold rounded-full hover:bg-white/5 transition-colors"
              >
                {t('hero.cta.contact')}
              </button>
            </motion.div>
          </div>

          <aside className="hidden lg:block">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + stat.delay }}
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 tracking-wider uppercase">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <motion.div
        className="relative w-full max-w-6xl py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <Suspense fallback={null}>
          <LazyParticleText text="INTERACTIVE EXPERIENCE" />
        </Suspense>
        <ServicesGrid />
      </motion.div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
