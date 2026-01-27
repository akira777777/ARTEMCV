
import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n';
import GradientShaderCard from './GradientShaderCard';

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
            <div className="relative w-[320px] h-[360px] lg:w-[420px] lg:h-[440px]">
              <div className="absolute inset-0 rounded-[3rem] glass-card border-white/10" />
              <div className="absolute -inset-6 rounded-[3.5rem] bg-gradient-to-b from-white/10 via-white/0 to-white/0 blur-3xl" aria-hidden />
              <motion.div
                className="absolute inset-3 rounded-[2.7rem] bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(16,185,129,0.3),transparent_30%)]"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                aria-hidden
              />
              <motion.div
                className="absolute inset-4 rounded-[2.4rem] overflow-hidden"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              >
                <div className="relative h-full w-full bg-gradient-to-br from-[#0f172a] via-[#0b1120] to-black">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.2),transparent_30%)]" aria-hidden />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05),transparent_35%,rgba(255,255,255,0.08))] opacity-60" aria-hidden />
                  
                  {/* Gradient Shader Card Element */}
                  <GradientShaderCard />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
