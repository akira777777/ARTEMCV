import React, { Suspense } from 'react';
import { Navigation } from '../components/Navigation';
import { SkipLink } from '../components/SkipLink';
import ScrollProgress from '../components/ScrollProgress';

// New unified components
import { HeroUnified } from '../components/home/HeroUnified';
import { WorksUnified } from '../components/home/WorksUnified';
import { AboutUnified } from '../components/home/AboutUnified';
import { ContactUnified } from '../components/home/ContactUnified';
import { FooterUnified } from '../components/home/FooterUnified';

// Lazy load non-critical components
const SimpleTelegramChat = React.lazy(() => 
  import('../components/SimpleTelegramChat')
);

/**
 * New Home Page Component
 * 
 * Features:
 * - Unified design system
 * - Clean, minimal design
 * - Optimized performance
 * - View transitions ready
 * - Accessibility focused
 */
const NewHome: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <SkipLink />
      <Navigation />
      <ScrollProgress />
      
      <main id="main-content" tabIndex={-1} className="outline-none">
        {/* Hero Section */}
        <HeroUnified />

        {/* Works/Projects Section */}
        <WorksUnified />

        {/* About Section */}
        <AboutUnified />

        {/* Contact Section */}
        <ContactUnified />
      </main>

      {/* Footer */}
      <FooterUnified />

      {/* Chat Widget - Lazy loaded */}
      <Suspense fallback={null}>
        <SimpleTelegramChat />
      </Suspense>
    </div>
  );
};

export default NewHome;
