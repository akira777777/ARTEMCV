import React, { useState, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code2, Palette, Zap, Users } from 'lucide-react';
import { useI18n } from '../i18n';
import { ServicesGrid } from './ServicesGrid';

// Lazy load ParticleText to prevent chunk duplication
const ParticleText = React.lazy(() => import('./InteractiveElements').then(m => ({ default: m.ParticleText })));

export const Hero: React.FC = React.memo(() => {
  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

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
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" aria-hidden="true" />
      
      {/* Holographic Abstract Sphere */}
      <div className="holo-abstract-sphere top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" aria-hidden="true" />

      {/* Main Typography */}
      <div className="z-10 relative w-full max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest font-bold text-neutral-300 mb-6">
              <span className="text-indigo-300">✦</span>
              {t('hero.badge')}
            </div>
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <span className="text-4xl md:text-6xl font-display font-bold mr-4 animate-pulse" aria-hidden="true">∞</span>
            </div>
            <h1 className="text-[11vw] sm:text-[9vw] lg:text-[6.5rem] leading-[0.9] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 select-none uppercase">
              JULES
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white font-medium tracking-wide">
              {t('hero.title.line1')} &amp; {t('hero.stat.uiux')}
            </p>
            <p className="mt-3 text-sm md:text-base text-neutral-400 max-w-2xl mx-auto lg:mx-0 font-light tracking-wide leading-relaxed">
              {t('hero.desc')}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                type="button"
                onClick={scrollToWorks}
                className="px-7 py-3 rounded-full bg-white text-black text-xs font-bold tracking-widest hover:bg-neutral-200 transition-colors"
                aria-label={t('hero.cta.portfolio')}
              >
                {t('hero.cta.portfolio')}
              </button>
              <button
                type="button"
                onClick={scrollToContact}
                className="px-7 py-3 rounded-full border border-white/20 text-white text-xs font-bold tracking-widest hover:bg-white/10 transition-colors"
                aria-label={t('hero.cta.contact')}
              >
                {t('hero.cta.contact')}
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start">
              {[t('hero.label.brand'), t('hero.label.web'), t('hero.label.motion'), t('hero.label.design')].map((label) => (
                <span key={label} className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-neutral-300">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-transparent blur-2xl" aria-hidden="true" />
            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="text-xs uppercase tracking-widest text-neutral-400">{t('hero.stat.backend')}</div>
                <div className="text-xs text-neutral-500">{t('hero.stat.ai')}</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <span className="text-xs text-neutral-400">{t('hero.stat.projects')}</span>
                  <span className="text-lg font-black text-white">50+</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <span className="text-xs text-neutral-400">{t('hero.stat.clients')}</span>
                  <span className="text-lg font-black text-white">30+</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <span className="text-xs text-neutral-400">{t('hero.stat.experience')}</span>
                  <span className="text-lg font-black text-white">3+</span>
                </div>
              </div>
              <div className="mt-6 text-xs text-neutral-500">
                {t('hero.stat.nps')}: <span className="text-white font-bold">98</span>
              </div>
            </div>
          </div>
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
