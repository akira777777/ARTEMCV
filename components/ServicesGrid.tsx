import React from 'react';
import { useI18n } from '../i18n';

interface Service {
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
}

export const ServicesGrid: React.FC = React.memo(() => {
  const { t } = useI18n();

  const services: Service[] = [
    {
      titleKey: 'service.1.name',
      descriptionKey: 'service.1.desc',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-supporting-500">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      titleKey: 'service.2.name',
      descriptionKey: 'service.2.desc',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <line x1="3" x2="21" y1="9" y2="9" />
          <line x1="9" x2="9" y1="21" y2="9" />
        </svg>
      ),
    },
    {
      titleKey: 'service.3.name',
      descriptionKey: 'service.3.desc',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-supporting-400">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full py-20 px-4 flex flex-col items-center justify-center relative z-10">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          {t('about.offer')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">{t('services.grid.title')}</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          {t('services.grid.subtitle')}
          {t('about.offer')}
        </p>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          {t('about.desc')}
        </p>
      </div>

      {/* Services Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mb-20">
        {services.map((item, idx) => (
          <div
            key={idx}
            className="group relative p-8 rounded-2xl bg-[#050505] border border-white/5 hover:border-supporting-500/30 ease-smooth hover:-translate-y-1 overflow-hidden visual-depth-2 interactive-element"
            style={{ 
              transformStyle: 'preserve-3d',
              willChange: 'transform'
            }}
          >
            {/* Gradient background highlight on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-supporting-500/5 to-primary-500/5 opacity-0 group-hover:opacity-100 ease-smooth" />

            <div className="relative z-10">
              <div className="mb-6 p-3 bg-white/5 w-fit rounded-xl group-hover:bg-white/10 ease-smooth visual-depth-1">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-supporting-200 ease-smooth">
                {t(item.titleKey)}
              </h3>

              <p className="text-gray-400 leading-relaxed text-sm md:text-base readable-text-sm">
                {t(item.descriptionKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ServicesGrid.displayName = 'ServicesGrid';
