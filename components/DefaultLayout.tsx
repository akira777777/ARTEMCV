import React, { ReactNode } from 'react';
import BaseLayout from './BaseLayout';

interface DefaultLayoutProps {
  children: ReactNode;
  className?: string;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <BaseLayout 
      variant="default"
      showNavigation={true}
      showFooter={true}
      showScrollToTop={true}
      showSkipLink={true}
      className={className}
    >
      {children}
    </BaseLayout>
  );
};

export default DefaultLayout;