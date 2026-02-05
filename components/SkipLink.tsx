import React, { useCallback } from 'react';
import { useI18n } from '../i18n';

const SkipLink: React.FC = React.memo(() => {
  const { t } = useI18n();

  const skipToContent = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <a
      href="#main-content"
      onClick={skipToContent}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          skipToContent(e);
        }
      }}
      className="fixed top-0 left-0 p-3 bg-white text-black font-bold z-[10000] -translate-y-full focus:translate-y-0 transition-transform duration-200 shadow-lg rounded-br-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label={t('accessibility.skip_to_main')}
    >
      {t('accessibility.skip_to_main')}
    </a>
  );
});

SkipLink.displayName = 'SkipLink';
export default SkipLink;
