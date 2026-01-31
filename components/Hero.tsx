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

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20"
      aria-label="Hero section"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" aria-hidden="true" />

      {/* Main Typography */}
      <div className="z-10 text-center mb-12 relative">
        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl md:text-6xl font-display font-bold mr-4 animate-pulse" aria-hidden="true">∞</span>
        </div>
        <h1 className="text-[12vw] leading-[0.85] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 select-none uppercase">
          JULES
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white font-medium tracking-wide">
          {t('hero.title.line1')} & {t('hero.stat.uiux')}
        </p>
        <p className="mt-4 text-neutral-400 max-w-lg mx-auto text-sm md:text-base font-light tracking-wide leading-relaxed">
          {t('hero.desc')}
        </p>
      </div>

      {/* Interactive Elements Section */}
      <div className="relative w-full max-w-6xl py-20 space-y-12">
        <ParticleText text="INTERACTIVE EXPERIENCE" />
        <ServicesGrid />
      </div>

      {/* Stats Section */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6" role="complementary" aria-label="Statistics">
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
      </div>

      <button
        type="button"
        onClick={scrollToWorks}
        aria-label="Scroll down to explore projects"
        className="absolute bottom-4 right-10 hidden md:flex items-center gap-4 text-xs font-bold tracking-widest text-neutral-500 cursor-pointer hover:text-white transition-colors group"
      >
        {t('hero.cta.scroll')} <ArrowRight className="w-4 h-4 animate-bounce group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </button>
    </section>
  );
});
