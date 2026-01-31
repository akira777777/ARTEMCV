import React from 'react';
import { useI18n } from '../i18n';

export const Footer2026: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="py-32 px-6 border-t border-white/5 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="text-5xl md:text-[7rem] font-display font-bold tracking-tighter mb-12 text-white">
          {t('cta.title')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-400 italic">EVOLVE?</span>
        </h2>

        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <button className="relative bg-white text-black px-12 py-6 rounded-full font-display text-2xl font-bold hover:scale-105 active:scale-95 transition-all">
            START A PROJECT
          </button>
        </div>

        <div className="mt-32 w-full grid grid-cols-2 md:grid-cols-4 gap-12 text-left opacity-40 text-sm border-t border-white/5 pt-12 text-white">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-white uppercase tracking-widest text-[10px]">{t('footer.social')}</span>
            <a href="https://twitter.com" className="hover:text-white transition-colors">Twitter (X)</a>
            <a href="https://linkedin.com" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://github.com/akira777777" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-white uppercase tracking-widest text-[10px]">Status</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Available Q4 2026
            </span>
            <span>London / Remote</span>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-white uppercase tracking-widest text-[10px]">Version</span>
            <span>2026.04.12</span>
            <span>Build: #AM-0922</span>
          </div>
          <div className="flex flex-col gap-4 text-right">
            <div className="text-white font-display font-bold text-lg">Artem Mikhailov</div>
            <p>© All rights reserved 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
