import React from 'react';
import { ArrowRight, Code2, Palette, Zap, Users } from 'lucide-react';
import { useI18n } from '../i18n';
import { ParticleText } from './InteractiveElements';
import { ServicesGrid } from './ServicesGrid';

export const Hero: React.FC = React.memo(() => {
  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scrollToWorks = () => {
    document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden pt-28 pb-40"
      aria-label="Hero section"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" aria-hidden="true" />
      
      {/* Decorative Purple Star */}
      <div className="hero-purple-star" aria-hidden="true" />

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
              {t('hero.title.line1')} & {t('hero.stat.uiux')}
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
      <aside className="w-full max-w-4xl px-6 mb-16" aria-label="Statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group">
            <Code2 className="w-6 h-6 mx-auto mb-2 text-indigo-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <div className="text-2xl md:text-3xl font-black text-white">50+</div>
            <div className="text-xs text-neutral-500 tracking-wider">{t('hero.stat.projects')}</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group">
            <Users className="w-6 h-6 mx-auto mb-2 text-emerald-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <div className="text-2xl md:text-3xl font-black text-white">30+</div>
            <div className="text-xs text-neutral-500 tracking-wider">{t('hero.stat.clients')}</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group">
            <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <div className="text-2xl md:text-3xl font-black text-white">3+</div>
            <div className="text-xs text-neutral-500 tracking-wider">{t('hero.stat.experience')}</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group">
            <Palette className="w-6 h-6 mx-auto mb-2 text-pink-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <div className="text-2xl md:text-3xl font-black text-white">100%</div>
            <div className="text-xs text-neutral-500 tracking-wider">{t('hero.stat.satisfaction')}</div>
          </div>
        </div>
      </aside>

      {/* Interactive Elements Section */}
      <div className="relative w-full max-w-6xl py-12 space-y-12">
        <ParticleText text="INTERACTIVE EXPERIENCE" />
        <ServicesGrid />
      </div>

      <button
        type="button"
        onClick={scrollToWorks}
        aria-label="Scroll down to explore projects"
        className="fixed bottom-8 right-10 hidden md:flex items-center gap-4 text-xs font-bold tracking-widest text-neutral-500 cursor-pointer hover:text-white transition-colors group z-40"
      >
        {t('hero.cta.scroll')} <ArrowRight className="w-4 h-4 animate-bounce group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </button>
    </section>
  );
});

Hero.displayName = 'Hero';
