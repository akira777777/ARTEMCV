
import React, { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '../i18n';

const Header: React.FC = () => {
  const { t } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-gradient-to-b from-[#0a0a0a]/90 to-[#0a0a0a]/70 backdrop-blur-md border-b border-white/5" role="navigation" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          <a className="flex items-center space-x-2 cursor-pointer group" href="#top">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center overflow-hidden bg-indigo-600 font-bold text-white text-xs">
              JE
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-white">Jules Engineer</span>
          </a>

          <div className="hidden md:flex items-center space-x-12">
            <a href="#services" className="relative text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-all after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">
              {t('header.services')}
            </a>
            <a href="#work" className="relative text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-all after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">
              {t('header.work')}
            </a>
            <a href="#contact" className="relative text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-all after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">
              {t('header.contact')}
            </a>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            <a 
              href="https://t.me/younghustle45"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block px-6 py-2 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-colors sheen-sweep relative"
            >
              {t('header.contact.telegram')}
            </a>
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden pb-6 space-y-4 border-t border-white/5 pt-4">
            <a 
              href="#services" 
              className="block text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-all py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('header.services')}
            </a>
            <a 
              href="#work" 
              className="block text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-all py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('header.work')}
            </a>
            <a 
              href="#contact" 
              className="block text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-all py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('header.contact')}
            </a>
            <a 
              href="https://t.me/younghustle45"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-3 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('header.contact.telegram')}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default React.memo(Header);
