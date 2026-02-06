import React from 'react';
import { useI18n } from '../i18n';

/**
 * SkipLink Component
 * 
 * Accessibility feature that allows keyboard users to skip navigation
 * and jump directly to the main content.
 * 
 * This component is visually hidden by default but becomes visible
 * when focused via keyboard navigation.
 */
export const SkipLink: React.FC = React.memo(() => {
  const { t } = useI18n();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] 
                 px-6 py-3 bg-white text-black rounded-xl font-semibold 
                 shadow-lg hover:bg-neutral-200 transition-all
                 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
      aria-label={t('accessibility.skip_to_main')}
    >
      {t('skip.content')}
    </a>
  );
});

SkipLink.displayName = 'SkipLink';

export default SkipLink;
