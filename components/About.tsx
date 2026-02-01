import React from 'react';
import { useI18n } from '../i18n';

export const About: React.FC = React.memo(() => {
  const { t } = useI18n();
  
  return (
    <section id="studio" className="py-24 md:py-40 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight uppercase mb-8">
            {t('footer.ready.title.main')} <br />
            <span className="text-neutral-500">{t('footer.ready.title.sub')}</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 leading-relaxed mb-8">
            {t('about.desc')}
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white text-black text-xs font-bold tracking-widest rounded-full hover:bg-neutral-200 transition-colors"
          >
            {t('about.cta.collaborate')}
          </button>
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';
