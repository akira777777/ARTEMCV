
import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n';

// Lazy load ShaderOrb with Three.js dependency
const ShaderOrb = lazy(() => import('./ShaderOrb'));

const Hero: React.FC = () => {
  const { t } = useI18n();
  return (
    <motion.section
      className="relative pt-32 pb-28 overflow-hidden border-b border-white/5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="absolute -top-40 -left-20 w-80 h-80 bg-emerald-500/15 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 right-0 w-96 h-96 bg-sky-500/15 blur-3xl" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.06),transparent_45%)]" aria-hidden />

      <div className="marquee-container w-full py-3 opacity-20">
        <div className="marquee-content">
          <h1 className="text-[11vw] font-serif uppercase leading-none tracking-tighter whitespace-nowrap">AstraDev® AstraDev® AstraDev®</h1>
        </div>
        <div className="marquee-content">
          <h1 className="text-[11vw] font-serif uppercase leading-none tracking-tighter whitespace-nowrap">AstraDev® AstraDev® AstraDev®</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full floating-badge accent-pill text-zinc-400 animate-[floaty_8s_ease-in-out_infinite]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {t('hero.badge')}
            </div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-6xl font-serif leading-tight">
                {t('hero.title.line1')} <br />
                <span className="italic text-zinc-300">{t('hero.title.line2')}</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto lg:mx-0">
                {t('hero.desc')}
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <motion.a
                href="#work"
                className="cta-button px-6 py-3 rounded-full bg-white text-black font-semibold shadow-lg shadow-emerald-500/10 hover:-translate-y-0.5 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('hero.cta.portfolio')}
              </motion.a>
              <motion.a
                href="#services"
                className="cta-button px-6 py-3 rounded-full border border-white/20 text-white font-semibold bg-white/5 hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('hero.cta.contact')}
              </motion.a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
              {[{
                label: t('hero.stat.uiux'),
                value: '60+',
                color: 'from-emerald-500/25 via-white/5 to-transparent'
              }, {
                label: t('hero.stat.backend'),
                value: '40+',
                color: 'from-sky-500/25 via-white/5 to-transparent'
              }, {
                label: t('hero.stat.ai'),
                value: '15',
                color: 'from-fuchsia-500/25 via-white/5 to-transparent'
              }, {
                label: t('hero.stat.nps'),
                value: '9.4',
                color: 'from-amber-500/25 via-white/5 to-transparent'
              }].map((item, idx) => (
                <motion.div
                  key={item.label}
                  className="rounded-3xl p-4 text-left glass-card shine-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05, duration: 0.5, ease: 'easeOut' }}
                >
                  <div className={`h-1 w-full rounded-full bg-gradient-to-r ${item.color} mb-3`} />
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 mt-1">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative w-full flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="w-full max-w-2xl"
            >
              <Suspense fallback={
                <div className="w-full h-96 rounded-3xl bg-gradient-to-br from-black to-slate-900 border border-white/10 flex items-center justify-center">
                  <div className="animate-pulse">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full"></div>
                  </div>
                </div>
              }>
                <ShaderOrb />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
