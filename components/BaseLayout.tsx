import React, { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import SkipLink from './SkipLink';
import { ScrollToTop } from './ScrollToTop';
import ScrollProgress from './ScrollProgress';

interface BaseLayoutProps {
  children: ReactNode;
  variant?: 'default' | 'minimal' | 'landing';
  showNavigation?: boolean;
  showFooter?: boolean;
  showScrollToTop?: boolean;
  showSkipLink?: boolean;
  className?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  variant = 'default',
  showNavigation = true,
  showFooter = true,
  showScrollToTop = true,
  showSkipLink = true,
  className = ''
}) => {
  return (
    <div className={`bg-[#0a0a0a] min-h-screen text-white selection:bg-white/10 selection:text-white ${className}`}>
      {showSkipLink && <SkipLink />}
      {showNavigation && <Navigation />}
      <ScrollProgress />
      <main id="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
      {showScrollToTop && <ScrollToTop />}
    </div>
  );
};

export default BaseLayout;