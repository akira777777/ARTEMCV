import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Palette, Zap, Users } from 'lucide-react';
import { useI18n } from '../i18n';
import { ServicesGrid } from './ServicesGrid';
import { ParticleText } from './ParticleText';

// Extracted style objects to constants to reduce object allocations
const CONTAINER_STYLE = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  paddingTop: '80px',
  paddingBottom: '80px',
  position: 'relative' as const
};

const SECTION_CLASSES = "relative w-full flex flex-col items-center justify-start overflow-hidden pt-28 pb-40";

// Memoized stats data to prevent recreation on each render
const STATS_DATA = [
  { value: '8+', label: 'Years Experience', icon: Code2, color: 'text-blue-400', delay: 0.1 },
  { value: '50+', label: 'Projects Completed', icon: Palette, color: 'text-emerald-400', delay: 0.2 },
  { value: '20+', label: 'Happy Clients', icon: Users, color: 'text-amber-400', delay: 0.3 },
  { value: '∞', label: 'Coffee Cups', icon: Zap, color: 'text-violet-400', delay: 0.4 },
];

export const Hero: React.FC = React.memo(() => {
  const { t } = useI18n();
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
    const rect = e.currentTarget.getBoundingClientRect();
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

  // Memoize the animation variants to prevent recreation on each render
  const badgeAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  }), []);

  const titleAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.6 }
  }), []);

  const subtitleAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.8 }
  }), []);

  const descriptionAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 1.0 }
  }), []);

  const ctaAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 1.2 }
  }), []);

  const statsAnimations = useMemo(() => STATS_DATA.map((_, index) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 1.4 + index * 0.1 }
  })), []);

  return (
    <section 
      id="home"
      className={SECTION_CLASSES}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.12)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(139,92,246,0.1)_0%,transparent_50%)]" />
        
        {/* Interactive Grid */}
        <div className="interactive-grid" />
        
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
        />
      </div>

      {/* Main Content */}
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
            >
              ARTEM
            </motion.h1>
              
            <motion.p 
              className="mt-4 text-lg md:text-xl text-white font-medium tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {t('hero.title.line1')} & {t('hero.stat.uiux')}
            </motion.p>
              
            <motion.p 
              className="mt-3 text-sm md:text-base text-gray-400 max-w-2xl mx-auto lg:mx-0 font-light tracking-wide leading-relaxed"
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
                className="neon-button px-7 py-3 rounded-full text-xs font-bold tracking-widest interactive-element"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={t('hero.cta.portfolio')}
              >
                {t('hero.cta.portfolio')}
              </motion.button>
              <motion.button
                type="button"
                onClick={scrollToContact}
                className="px-7 py-3 rounded-full border border-primary/30 text-primary-300 text-xs font-bold tracking-widest hover:bg-primary/10 ease-smooth interactive-element"
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
                  className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary-300"
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
                <div className="text-xs uppercase tracking-widest text-primary-400">{t('hero.stat.backend')}</div>
                <div className="text-xs text-primary-500">{t('hero.stat.ai')}</div>
              </div>
              <div className="space-y-4">
                {STATS_DATA.slice(0, 3).map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="flex items-center justify-between rounded-2xl border border-primary/20 bg-black/40 px-4 py-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="text-xs text-primary-300">{stat.label}</span>
                    <motion.span 
                      className={`text-lg font-black ${stat.color}`}
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {stat.value}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                className="mt-6 text-xs text-primary-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                {t('hero.stat.nps')}: <span className="text-primary-400 font-bold">98</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <aside className="w-full max-w-4xl px-6 mb-16 mt-16" aria-label="Statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {STATS_DATA.map((stat, index) => (
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

      {/* Interactive Elements Section */}
      <motion.div
        className="relative w-full max-w-6xl py-12 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <ParticleText text="INTERACTIVE EXPERIENCE" />
        <ServicesGrid />
      </motion.div>

      <motion.button
        type="button"
        onClick={scrollToWorks}
        aria-label="Scroll down to explore projects"
        className="fixed bottom-8 right-10 hidden md:flex items-center gap-4 text-xs font-bold tracking-widest text-gray-500 hover:text-white transition-colors group z-40"
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
