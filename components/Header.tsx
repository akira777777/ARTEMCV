
import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '../i18n';

const Header: React.FC = () => {
  const { t } = useI18n();
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5" role="navigation" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          <a className="flex items-center space-x-2 cursor-pointer group" href="#top">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center overflow-hidden bg-indigo-600 font-bold text-white text-xs">
              AM
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-white">Artem Mikhailov</span>
          </a>

          <div className="hidden md:flex items-center space-x-12">
            <a href="#services" className="text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-all">
              {t('header.services')}
            </a>
            <a href="#work" className="text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-all">
              {t('header.work')}
            </a>
            <a href="#contact" className="text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-all">
              {t('header.contact')}
            </a>
          </div>

          <div className="flex items-center space-x-6">
            <a 
              href="https://t.me/younghustle45"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              {t('header.contact.telegram')}
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Header);
