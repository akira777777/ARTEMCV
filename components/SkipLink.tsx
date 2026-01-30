import React from 'react';
import { useI18n } from '../i18n';

const SkipLink: React.FC = () => {
  const { t } = useI18n();
  return (
    <a
      href="#main-content"
      className="absolute top-0 left-0 p-3 bg-white text-black font-bold z-[100] -translate-y-full focus:translate-y-0 transition-transform duration-200 shadow-lg rounded-br-lg ring-offset-2 focus:outline-none"
    >
      {t('skip.content')}
    </a>
  );
};

export default SkipLink;
