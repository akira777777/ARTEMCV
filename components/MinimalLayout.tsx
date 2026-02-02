import React, { ReactNode } from 'react';
import BaseLayout from './BaseLayout';

interface MinimalLayoutProps {
  children: ReactNode;
  className?: string;
}

const MinimalLayout: React.FC<MinimalLayoutProps> = React.memo(({ 
  children, 
  className = '' 
}) => {
  return (
    <BaseLayout 
      variant="minimal"
      showNavigation={false}
      showFooter={false}
      showScrollToTop={false}
      showSkipLink={false}
      className={className}
    >
      {children}
    </BaseLayout>
  );
});

MinimalLayout.displayName = 'MinimalLayout';
export default MinimalLayout;