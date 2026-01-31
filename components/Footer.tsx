import React from 'react';
import { useI18n } from '../i18n';

import { useI18n } from '../i18n';

export const Footer: React.FC = React.memo(() => {
  const { t } = useI18n();
  return (
    <footer id="footer" className="py-20 bg-black border-t border-white/10 pb-40 relative overflow-hidden">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-indigo-500/10 blur-3xl float-slower" aria-hidden="true" />
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-[10vw] font-display font-black tracking-tighter leading-none mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer bg-[length:200%_200%] motion-safe:animate-[subtlePan_12s_ease-in-out_infinite]">
          {t('footer.cta.build')}
        </h2>
        <p className="text-lg text-neutral-400 mb-12 max-w-md mx-auto">
          {t('footer.ready.title.main')} {t('footer.ready.title.sub')}
        </p>
        <nav aria-label="Social media links">
          <ul className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-sm tracking-widest font-bold">
            <li>
              <a href="mailto:fear75412@gmail.com" aria-label="Send email to fear75412@gmail.com" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">FEAR75412@GMAIL.COM</a>
            </li>
            <li>
              <a href="https://t.me/younghustle45" target="_blank" rel="noopener noreferrer" aria-label="Contact via Telegram (opens in new tab)" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">{t('footer.contacts').toUpperCase()} — TELEGRAM</a>
            </li>
            <li>
              <a href="https://github.com/akira777777" target="_blank" rel="noopener noreferrer" aria-label="Visit GitHub profile (opens in new tab)" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">GITHUB</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn profile (opens in new tab)" className="relative hover:text-neutral-400 transition-colors after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full">LINKEDIN</a>
            </li>
          </ul>
        </nav>
        <p className="mt-20 text-neutral-600 text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} ARTEM.DEV // {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
});
