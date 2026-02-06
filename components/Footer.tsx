import React from 'react';
import { useI18n } from '../i18n';
import { AnimatedUnderline } from './AnimatedUnderline';

export const Footer: React.FC = React.memo(() => {
  const { t } = useI18n();
  return (
    <footer 
      id="footer" 
      className="py-20 bg-black border-t border-white/10 pb-40 relative overflow-hidden"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-indigo-500/10 blur-3xl float-slower" aria-hidden="true" />
      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 
          id="footer-heading"
          className="text-[10vw] font-display font-black tracking-tighter leading-none mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer bg-[length:200%_200%] motion-safe:animate-[subtlePan_12s_ease-in-out_infinite]"
        >
          {t('footer.cta.build')}
        </h2>
        <p className="text-lg text-neutral-400 mb-12 max-w-md mx-auto">
          {t('footer.ready.title.main')} {t('footer.ready.title.sub')}
        </p>
        <nav aria-labelledby="social-links-heading">
          <h3 id="social-links-heading" className="sr-only">Connect with me on social media</h3>
          <ul className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16 text-sm tracking-widest font-bold">
            <li className="mb-4 md:mb-0">
              <AnimatedUnderline 
                href="mailto:fear75412@gmail.com" 
                underlineColor="rgba(255,255,255,0.6)"
                aria-label="Send email to fear75412@gmail.com"
                className="block py-2 touch-target"
              >
                FEAR75412@GMAIL.COM
              </AnimatedUnderline>
            </li>
            <li className="mb-4 md:mb-0">
              <AnimatedUnderline 
                href="https://t.me/younghustle45" 
                target="_blank" 
                rel="noopener noreferrer" 
                underlineColor="rgba(255,255,255,0.6)"
                aria-label="Connect on Telegram (opens in new tab)"
                className="block py-2 touch-target"
              >
                {t('footer.contacts').toUpperCase()} — TELEGRAM
              </AnimatedUnderline>
            </li>
            <li className="mb-4 md:mb-0">
              <AnimatedUnderline 
                href="https://github.com/akira777777" 
                target="_blank" 
                rel="noopener noreferrer" 
                underlineColor="rgba(255,255,255,0.6)"
                aria-label="View GitHub profile (opens in new tab)"
                className="block py-2 touch-target"
              >
                GITHUB
              </AnimatedUnderline>
            </li>
            <li className="mb-4 md:mb-0">
              <AnimatedUnderline 
                href="https://www.linkedin.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                underlineColor="rgba(255,255,255,0.6)"
                aria-label="Connect on LinkedIn (opens in new tab)"
                className="block py-2 touch-target"
              >
                LINKEDIN
              </AnimatedUnderline>
            </li>
          </ul>
        </nav>
        <p className="mt-20 text-neutral-600 text-xs uppercase tracking-widest">
          <span aria-label="Copyright">©</span> {new Date().getFullYear()} ARTEM.DEV // {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
