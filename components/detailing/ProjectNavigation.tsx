import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';

const ProjectNavigation: React.FC = () => {
  const { t } = useI18n();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" aria-label={t('detailing.nav.home_label')}>
          <div className="size-9 bg-blue-500 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform" aria-hidden="true">
            <span className="material-symbols-outlined text-white text-xl">directions_car</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Detailing Hub <span className="text-blue-500">3D</span></h2>
        </Link>
        <nav className="hidden md:flex items-center gap-10" aria-label="Project navigation">
          <a className="text-sm font-medium text-white/60 hover:text-white transition-colors" href="#process">{t('detailing.nav.process')}</a>
          <a className="text-sm font-medium text-white/60 hover:text-white transition-colors" href="#technical">{t('detailing.nav.technical')}</a>
          <a className="text-sm font-medium text-white/60 hover:text-white transition-colors" href="#impact">{t('detailing.nav.impact')}</a>
          <button className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105">
            {t('detailing.nav.launch')}
          </button>
        </nav>
        <div className="md:hidden">
          <span className="material-symbols-outlined text-white" aria-hidden="true">menu</span>
        </div>
      </div>
    </header>
  );
};

export default ProjectNavigation;
