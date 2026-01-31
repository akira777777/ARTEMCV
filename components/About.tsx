import React from 'react';
import { SKILLS, SERVICES } from '../constants';
import { useI18n } from '../i18n';

export const About: React.FC = React.memo(() => {
  const { t } = useI18n();
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="studio" className="py-24 md:py-40 border-t border-white/5 bg-neutral-950 relative overflow-hidden">
      <div className="absolute -top-32 left-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl float-slow" aria-hidden="true" />
      <div className="absolute -bottom-40 right-0 w-[28rem] h-[28rem] rounded-full bg-emerald-400/10 blur-3xl float-slower" aria-hidden="true" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight uppercase">
              {t('footer.ready.title.main')} <br />
              <span className="text-neutral-500">{t('footer.ready.title.sub')}</span>
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-lg">
              {t('about.desc')}
            </p>
            <div className="pt-8">
              <button
                onClick={scrollToContact}
                aria-label="Navigate to contact section"
                className="relative px-8 py-4 bg-white text-black text-xs font-bold tracking-widest rounded-full hover:bg-neutral-200 transition-colors transform hover:scale-105 duration-300 cta-button sheen-sweep glow-pulse-soft"
              >
                {t('about.cta.collaborate')}
              </button>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="space-y-6" role="complementary" aria-label="Technical skills">
            <h3 className="text-xs font-bold tracking-widest text-neutral-500 mb-4 border-b border-white/10 pb-4">{t('about.expertise')}</h3>
            {SKILLS.map((category) => (
              <div key={category.name} className="space-y-3">
                <h4 className="text-sm font-bold text-white">{t(category.name)}</h4>
                <ul className="flex flex-wrap gap-2" role="list">
                  {category.items.map((skill) => (
                    <li key={skill}>
                      <span
                        className="px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-neutral-300 hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                      >
                        {skill}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div id="services" className="mt-32 scroll-mt-24">
          <h3 className="text-xs font-bold tracking-widest text-neutral-500 mb-8 border-b border-white/10 pb-4">{t('about.offer')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
            {[
              { name: t('service.1.name'), desc: t('service.1.desc') },
              { name: t('service.2.name'), desc: t('service.2.desc') },
              { name: t('service.3.name'), desc: t('service.3.desc') },
              { name: t('service.4.name'), desc: t('service.4.desc') },
              { name: t('service.5.name'), desc: t('service.5.desc') },
              { name: t('service.6.name'), desc: t('service.6.desc') },
            ].map((service, index) => (
              <article key={service.name} className="service-card rounded-2xl px-6 py-5 group cursor-pointer transition-transform duration-500 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-display font-medium group-hover:text-neutral-300 transition-colors">
                    {t(service.name)}
                  </h4>
                  <span className="text-xs text-neutral-500" aria-label={`Service number ${index + 1}`}>0{index + 1}</span>
                </div>
                <p className="text-sm text-neutral-500 mt-2">{t(service.desc)}</p>
                <div className="mt-4 h-px bg-white/5 group-hover:bg-white/15 transition-colors" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
