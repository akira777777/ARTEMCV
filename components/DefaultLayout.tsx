import React, { ReactNode } from 'react';
import BaseLayout from './BaseLayout';

interface DefaultLayoutProps {
  children: ReactNode;
  className?: string;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = React.memo(({ 
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
});

DefaultLayout.displayName = 'DefaultLayout';
export default DefaultLayout;