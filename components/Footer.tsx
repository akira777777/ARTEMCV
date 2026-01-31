import React from 'react';
import { useI18n } from '../i18n';
import { AnimatedUnderline } from './AnimatedUnderline';

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
              <AnimatedUnderline href="mailto:fear75412@gmail.com" underlineColor="rgba(255,255,255,0.6)">
                FEAR75412@GMAIL.COM
              </AnimatedUnderline>
            </li>
            <li>
              <AnimatedUnderline href="https://t.me/younghustle45" target="_blank" rel="noopener noreferrer" underlineColor="rgba(255,255,255,0.6)">
                {t('footer.contacts').toUpperCase()} — TELEGRAM
              </AnimatedUnderline>
            </li>
            <li>
              <AnimatedUnderline href="https://github.com/akira777777" target="_blank" rel="noopener noreferrer" underlineColor="rgba(255,255,255,0.6)">
                GITHUB
              </AnimatedUnderline>
            </li>
            <li>
              <AnimatedUnderline href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" underlineColor="rgba(255,255,255,0.6)">
                LINKEDIN
              </AnimatedUnderline>
            </li>
          </ul>
        </nav>
        <p className="mt-20 text-neutral-600 text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} JULES.DEV // {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
