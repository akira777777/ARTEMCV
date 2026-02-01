import React, { Suspense } from 'react';
import { useI18n } from '../../i18n';

const GradientShaderCard = React.lazy(() => import('../GradientShaderCard'));

const LabSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden" id="lab">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <span className="text-indigo-500 font-bold text-xs uppercase tracking-[0.4em] mb-4 block">{t('lab.subtitle')}</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white">{t('lab.main_title')}</h2>
          </div>
          <p className="max-w-md opacity-50 md:text-right text-white leading-relaxed">
            {t('lab.main_desc')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group cursor-pointer md:col-span-2">
            <Suspense fallback={
              <div className="w-full h-[360px] lg:h-[440px] rounded-[2.7rem] bg-[#0f172a] animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            }>
              <GradientShaderCard />
            </Suspense>
          </div>
          <div className="group cursor-pointer">
            <div className="aspect-video glass rounded-3xl mb-6 overflow-hidden relative border border-white/10">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/20 transition-colors"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-6xl opacity-20 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500 text-white">spatial_tracking</span>
              </div>
            </div>
            <h5 className="font-bold text-xl mb-2 text-white">{t('lab.card1.title')}</h5>
            <p className="text-sm opacity-40 text-white leading-relaxed">{t('lab.card1.desc')}</p>
          </div>
          <div className="group cursor-pointer">
            <div className="aspect-video glass rounded-3xl mb-6 overflow-hidden relative border border-white/10">
              <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/20 transition-colors"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-6xl opacity-20 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500 text-white">psychology</span>
              </div>
            </div>
            <h5 className="font-bold text-xl mb-2 text-white">{t('lab.card2.title')}</h5>
            <p className="text-sm opacity-40 text-white leading-relaxed">{t('lab.card2.desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LabSection;
