import React, { ReactNode } from 'react';
import BaseLayout from './BaseLayout';

interface MinimalLayoutProps {
  children: ReactNode;
  className?: string;
}

const MinimalLayout: React.FC<MinimalLayoutProps> = ({ 
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
};

export default MinimalLayout;