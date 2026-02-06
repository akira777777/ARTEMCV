import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code2, Palette, Zap, Users } from 'lucide-react';
import { useI18n } from '../i18n';
import { ServicesGrid } from './ServicesGrid';
import { scrollToSection } from '../lib/utils';

// Lazy load ParticleText to prevent chunk duplication
const LazyParticleText = React.lazy(() => import('./InteractiveElements').then(m => ({ default: m.ParticleText })));

/**
 * Floating orb component that follows cursor movement with physics-based animation
 * Uses framer-motion springs for smooth, natural movement
 */
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

/**
 * Individual letter animation component for the hero name
 * Applies staggered entrance animation and hover effects
 */
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
      {/* Dot decoration for specific letters */}
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

// Custom cursor component
/**
 * Custom animated cursor with trailing effect
 * Uses framer-motion for smooth animations and spring physics
 */
const CustomCursor: React.FC<{ mouseX: number; mouseY: number }> = React.memo(({ mouseX, mouseY }) => {
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
          border: '2px solid rgba(139, 92, 246, 0.8)',
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
});

/**
 * Hero section component with interactive animations and 3D effects
 * Features:
 * - Animated typography with staggered entrance
 * - Interactive cursor with trailing effect
 * - Floating orbs that follow mouse movement
 * - Parallax background effects
 * - Scroll progress indicator
 * - Responsive design with mobile considerations
 */
const Hero: React.FC = React.memo(() => {
  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  /**
   * Track scroll position for parallax effects
   * Uses passive scroll listener for performance
   */
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Handles mouse movement for interactive effects
   * Calculates relative mouse position within the container
   */
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

  const name = 'JULES';
  const orbColors = [
    'linear-gradient(135deg, #ec4899, #f472b6)', // pink
    'linear-gradient(135deg, #22d3ee, #67e8f9)', // cyan
    'linear-gradient(135deg, #a855f7, #c084fc)', // purple
    'linear-gradient(135deg, #3b82f6, #60a5fa)', // blue
    'linear-gradient(135deg, #10b981, #34d399)', // green
  ];
  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Define particle type
  type Particle = {
    id: number;
    delay: number;
    size: number;
    x: number;
    y: number;
  };

  // Generate floating particles
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

  // Stats for the aside section
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
      {/* Custom Cursor */}
      <AnimatePresence>
        {isHovering && (
          <CustomCursor 
            mouseX={mousePosition.x + (containerRef.current?.getBoundingClientRect().left ?? 0) + (containerRef.current?.getBoundingClientRect().width ?? 0) / 2} 
            mouseY={mousePosition.y + (containerRef.current?.getBoundingClientRect().top ?? 0) + (containerRef.current?.getBoundingClientRect().height ?? 0) / 2} 
          />
        )}
      </AnimatePresence>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" aria-hidden="true" />
      
      {/* Animated gradient mesh background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
        }}
        animate={{
          background: [
            'radial-gradient(circle at 30% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Decorative Purple Star */}
      <motion.div 
        className="absolute pointer-events-none"
        style={{
          width: '1275px',
          height: '1275px',
          aspectRatio: '1 / 1',
          backgroundImage: 'url(/purple-star1.svg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          top: '-400px',
          right: '-400px',
        }}
        initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
        animate={{ 
          opacity: 0.4, 
          rotate: 360,
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          opacity: { duration: 2 },
          rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
        role="img"
        aria-label="Decorative purple star background element"
      />

      {/* Floating Orbs */}
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

      {/* Scroll Progress Bar */}
      <div 
        className="scroll-progress" 
        style={{ width: `${Math.min(scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1) * 100, 100)}%` }}
        role="progressbar"
        aria-valuenow={Math.min(scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1) * 100, 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Scroll progress indicator"
      />

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.12)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(139,92,246,0.1)_0%,transparent_50%)]" />
        
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
                ${particle.id % 4 === 0 ? '#0EA5E9' : particle.id % 4 === 1 ? '#10B981' : particle.id % 4 === 2 ? '#F59E0B' : '#8B5CF6'}, 
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
            aria-hidden="true"
            role="presentation"
          />
        ))}
        
        {/* Blob Background Elements */}
        <motion.div
          className="blob-bg"
          style={{
            width: '400px',
            height: '400px',
            background: 'linear-gradient(45deg, #0EA5E9, #10B981)',
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
          aria-hidden="true"
          role="presentation"
        />
        
        <motion.div
          className="blob-bg"
          style={{
            width: '300px',
            height: '300px',
            background: 'linear-gradient(45deg, #F59E0B, #8B5CF6)',
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
          aria-hidden="true"
          role="presentation"
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
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-xs tracking-widest font-bold text-primary-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className="text-primary-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
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
              className="text-[11vw] sm:text-[9vw] lg:text-[6.5rem] leading-[0.9] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-primary-300 select-none uppercase"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{ fontSize: 'clamp(2rem, 10vw, 6.5rem)' }}
            >
              {(t('hero.title.line1') + ' ' + t('hero.title.line2')).split('').map((letter, index) => (
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
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('hero.cta.explore')}{" "}
                <ArrowRight className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </motion.button>
              <motion.button
                onClick={scrollToContact}
                className="px-8 py-4 border border-primary/30 text-primary font-semibold rounded-full hover:bg-primary/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('hero.cta.contact')}
              </motion.button>
            </motion.div>
          </div>

          {/* Stats Section */}
          <aside className="hidden lg:block">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 rounded-xl glass-card-modern border border-primary/20 hover:border-secondary/50 transition-all group cursor-pointer"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.5 + stat.delay, duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 0 30px rgba(14, 165, 233, 0.3)',
                    borderColor: 'rgba(16, 185, 129, 0.5)',
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
                  <div className="text-xs text-gray-500 tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* Interactive Elements Section */}
      <motion.div
        className="relative w-full max-w-6xl py-12 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <Suspense fallback={<div className="h-32 w-full" />} />
        <Suspense fallback={<div className="h-24 w-full" aria-label="Loading interactive text..." />}>
          <LazyParticleText text="INTERACTIVE EXPERIENCE" />
        </Suspense>
        <ServicesGrid />
      </motion.div>

      <motion.button
        type="button"
        className="fixed bottom-8 right-10 hidden md:flex items-center gap-4 text-xs font-bold tracking-widest text-gray-500 hover:text-white transition-colors group z-40"
        onClick={scrollToWorks}
        aria-label={t('hero.cta.scroll')}
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
export default Hero;
