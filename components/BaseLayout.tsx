import React, { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import SkipLink from './SkipLink';
import { ScrollToTop } from './ScrollToTop';
import ScrollProgress from './ScrollProgress';
import { useI18n } from '../i18n';

interface BaseLayoutProps {
  children: ReactNode;
  variant?: 'default' | 'minimal' | 'landing';
  showNavigation?: boolean;
  showFooter?: boolean;
  showScrollToTop?: boolean;
  showSkipLink?: boolean;
  className?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = React.memo(({
  children,
  variant = 'default',
  showNavigation = true,
  showFooter = true,
  showScrollToTop = true,
  showSkipLink = true,
  className = ''
}) => {
  const { t } = useI18n();
  
  return (
    <div 
      className={`bg-[#0a0a0a] min-h-screen text-white selection:bg-white/10 selection:text-white ${className}`}
      lang={document.documentElement.lang}
    >
      {showSkipLink && <SkipLink />}
      {showNavigation && <Navigation />}
      <ScrollProgress />
      <main 
        id="main-content" 
        className="focus:outline-none"
        tabIndex={-1}
        aria-label={t('skip.content')}
      >
        {children}
      </main>
      {showFooter && <Footer />}
      {showScrollToTop && <ScrollToTop />}
    </div>
  );
});

BaseLayout.displayName = 'BaseLayout';

export default BaseLayout;