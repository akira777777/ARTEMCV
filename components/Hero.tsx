import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code2, Palette, Zap, Users } from 'lucide-react';
import { useI18n } from '../i18n';
import { ServicesGrid } from './ServicesGrid';

// Lazy load ParticleText to prevent chunk duplication
const ParticleText = React.lazy(() => import('./InteractiveElements').then(m => ({ default: m.ParticleText })));

// Floating orbs that follow cursor
const FloatingOrb: React.FC<{
  delay: number;
  size: number;
  color: string;
  mouseX: number;
  mouseY: number;
}> = ({ delay, size, color, mouseX, mouseY }) => {
  const springConfig = { stiffness: 100 - delay * 10, damping: 20 };
  const x = useSpring(mouseX * (0.3 - delay * 0.05), springConfig);
  const y = useSpring(mouseY * (0.3 - delay * 0.05), springConfig);

  useEffect(() => {
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
};

// Letter animation component for ARTEM
const AnimatedLetter: React.FC<{
  letter: string;
  index: number;
  mouseX: number;
  mouseY: number;
}> = ({ letter, index, mouseX, mouseY }) => {
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
        color: '#a855f7',
        textShadow: '0 0 40px rgba(168, 85, 247, 0.8)',
        transition: { duration: 0.2 },
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {letter}
      {/* Dot decoration for specific letters */}
      {(letter === 'R' || letter === 'E') && (
        <motion.span
          className="absolute -top-2 -right-1 w-3 h-3 rounded-full"
          style={{
            background: letter === 'R' ? '#ec4899' : '#22d3ee',
            boxShadow: `0 0 15px ${letter === 'R' ? 'rgba(236, 72, 153, 0.8)' : 'rgba(34, 211, 238, 0.8)'}`,
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
};

// Custom cursor component
const CustomCursor: React.FC<{ mouseX: number; mouseY: number }> = ({ mouseX, mouseY }) => {
  const springConfig = { stiffness: 500, damping: 28 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '2px solid rgba(168, 85, 247, 0.8)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {/* Inner dot */}
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
};

export const Hero: React.FC = React.memo(() => {
  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Track scroll for parallax effects
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

  // Generate floating particles
  const particles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 15,
      size: Math.random() * 8 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
    })),
    []
  );

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
      {/* Scroll Progress Bar */}
      <div 
        className="scroll-progress" 
        style={{ width: `${Math.min(scrollY / (document.body.scrollHeight - window.innerHeight) * 100, 100)}%` }}
      />
  
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.12)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.1)_0%,transparent_50%)]" />
          
        {/* Interactive Grid */}
        <div className="interactive-grid" />
          
        {/* Floating Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, 
                ${particle.id % 3 === 0 ? '#10B981' : particle.id % 3 === 1 ? '#06B6D4' : '#F59E0B'}, 
                transparent)`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: [-20, -window.innerHeight - 20]
            }}
            transition={{
              duration: 15,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
          
        {/* Blob Background Elements */}
        <motion.div
          className="blob-bg"
          style={{
            width: '400px',
            height: '400px',
            background: 'linear-gradient(45deg, #10B981, #06B6D4)',
            top: '10%',
            left: '5%',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
          
        <motion.div
          className="blob-bg"
          style={{
            width: '300px',
            height: '300px',
            background: 'linear-gradient(45deg, #F59E0B, #10B981)',
            bottom: '15%',
            right: '8%',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
  
      {/* Holographic Abstract Sphere with Parallax */}
      <motion.div
        className="holo-abstract-sphere top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        aria-hidden="true"
        style={{
          y: scrollY * 0.3
        }}
      />
  
      {/* Main Typography with 3D Tilt Effect */}
      <div className="z-10 relative w-full max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs tracking-widest font-bold text-emerald-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className="text-emerald-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                ✦
              </motion.span>
              {t('hero.badge')}
            </motion.div>
              
            <motion.div 
              className="flex items-center justify-center lg:justify-start mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-4xl md:text-6xl font-display font-bold mr-4 gradient-text" aria-hidden="true">∞</span>
            </motion.div>
              
            <motion.h1 
              className="text-[11vw] sm:text-[9vw] lg:text-[6.5rem] leading-[0.9] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-300 select-none uppercase"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              JULES
            </motion.h1>
              
            <motion.p 
              className="mt-4 text-lg md:text-xl text-white font-medium tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {t('hero.title.line1')} &amp; {t('hero.stat.uiux')}
            </motion.p>
              
            <motion.p 
              className="mt-3 text-sm md:text-base text-neutral-400 max-w-2xl mx-auto lg:mx-0 font-light tracking-wide leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {t('hero.desc')}
            </motion.p>

            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.button
                type="button"
                onClick={scrollToWorks}
                className="neon-button px-7 py-3 rounded-full text-xs font-bold tracking-widest"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={t('hero.cta.portfolio')}
              >
                {t('hero.cta.portfolio')}
              </motion.button>
              <motion.button
                type="button"
                onClick={scrollToContact}
                className="px-7 py-3 rounded-full border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-widest hover:bg-emerald-500/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={t('hero.cta.contact')}
              >
                {t('hero.cta.contact')}
              </motion.button>
            </motion.div>

            <motion.div 
              className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              {[t('hero.label.brand'), t('hero.label.web'), t('hero.label.motion'), t('hero.label.design')].map((label, index) => (
                <motion.span 
                  key={label} 
                  className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Stats Card with 3D Effect */}
          <motion.div 
            className="card-3d relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 }}
          >
            <div className="card-3d-inner glass-card-modern rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="text-xs uppercase tracking-widest text-emerald-400">{t('hero.stat.backend')}</div>
                <div className="text-xs text-emerald-500">{t('hero.stat.ai')}</div>
              </div>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-black/40 px-4 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-xs text-emerald-300">{t('hero.stat.projects')}</span>
                  <motion.span 
                    className="text-lg font-black text-emerald-400"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    50+
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-black/40 px-4 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-xs text-cyan-300">{t('hero.stat.clients')}</span>
                  <motion.span 
                    className="text-lg font-black text-cyan-400"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    30+
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between rounded-2xl border border-orange-500/20 bg-black/40 px-4 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-xs text-orange-300">{t('hero.stat.experience')}</span>
                  <motion.span 
                    className="text-lg font-black text-orange-400"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    3+
                  </motion.span>
                </motion.div>
              </div>
              <motion.div 
                className="mt-6 text-xs text-emerald-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                {t('hero.stat.nps')}: <span className="text-emerald-400 font-bold">98</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <aside className="w-full max-w-4xl px-6 mb-16 mt-16" aria-label="Statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { icon: Code2, value: '50+', label: t('hero.stat.projects'), color: 'text-indigo-400', delay: 0 },
            { icon: Users, value: '30+', label: t('hero.stat.clients'), color: 'text-emerald-400', delay: 0.1 },
            { icon: Zap, value: '3+', label: t('hero.stat.experience'), color: 'text-yellow-400', delay: 0.2 },
            { icon: Palette, value: '100%', label: t('hero.stat.satisfaction'), color: 'text-pink-400', delay: 0.3 },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all group cursor-pointer"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.5 + stat.delay, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
                borderColor: 'rgba(168, 85, 247, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color} group-hover:scale-110 transition-transform`} aria-hidden="true" />
              <motion.div
                className="text-2xl md:text-3xl font-black text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 + stat.delay }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs text-neutral-500 tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </aside>

      {/* Interactive Elements Section */}
      <motion.div
        className="relative w-full max-w-6xl py-12 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <Suspense fallback={<div className="h-24 w-full" aria-label="Loading interactive text..." />}>
          <ParticleText text="INTERACTIVE EXPERIENCE" />
        </Suspense>
        <ServicesGrid />
      </motion.div>

      <motion.button
        type="button"
        onClick={scrollToWorks}
        aria-label="Scroll down to explore projects"
        className="fixed bottom-8 right-10 hidden md:flex items-center gap-4 text-xs font-bold tracking-widest text-neutral-500 hover:text-white transition-colors group z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('hero.cta.scroll')} <ArrowRight className="w-4 h-4 animate-bounce group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </motion.button>
    </section>
  );
});

Hero.displayName = 'Hero';
