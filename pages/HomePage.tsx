import React, { lazy, Suspense, useEffect } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import CursorTrail from '../components/CursorTrail';
import { SectionDivider } from '../components/SectionDivider';
import { SkipLink } from '../components/SkipLink';
import Hero from '../components/Hero';
import { SpotlightGallery } from '../components/SpotlightGallery';
import { About } from '../components/About';
import { CTASection } from '../components/CTASection';
import ContactSectionSecure from '../components/ContactSectionSecure';
import { InteractiveGallery } from '../components/InteractiveGallery';
import { SimpleTelegramChat } from '../components/SimpleTelegramChat';
import DefaultLayout from '../components/DefaultLayout';

// Lazy load sections that are below the fold
const LabSection = lazy(() => import('../components/home/LabSection'));

// Loading fallback component
const SectionLoader: React.FC<{ label?: string }> = ({ label }) => (
  <div 
    className="w-full flex items-center justify-center py-16 min-h-[300px]"
    role="status"
    aria-live="polite"
    aria-label={label || 'Loading section'}
  >
    <div className="flex flex-col items-center gap-4">
      <div 
        className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"
        aria-hidden="true"
      />
      <span className="text-sm text-neutral-500">Loading...</span>
    </div>
  </div>
);

/**
 * HomePage Component
 * 
 * Performance optimizations:
 * - Lazy loaded below-fold sections
 * - Suspense boundaries for code splitting
 * - Error boundaries for graceful failure
 * - Reduced initial bundle size
 * - Progressive loading strategy
 */
const HomePage: React.FC = () => {
  // Preload LabSection on idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const idleCallbackId = window.requestIdleCallback(() => {
        import('../components/home/LabSection');
      }, { timeout: 2000 });
      
      return () => window.cancelIdleCallback(idleCallbackId);
    }
  }, []);

  return (
    <DefaultLayout>
      <SkipLink />
      <CursorTrail />
      
      <main id="main-content" tabIndex={-1} className="outline-none">
        {/* Hero - Always loaded immediately */}
        <Hero />
        
        <SectionDivider variant="wave" />
        
        {/* Spotlight Gallery - Critical, load immediately */}
        <SpotlightGallery />
        
        <SectionDivider variant="particles" />
        
        {/* Interactive Gallery - Critical, load immediately */}
        <InteractiveGallery />
        
        <SectionDivider variant="diamond" />
        
        {/* About Section - Critical, load immediately */}
        <About />
        
        <SectionDivider variant="pulse" />
        
        {/* Lab Section - Lazy loaded (below fold) */}
        <Suspense fallback={<SectionLoader label="Loading lab section" />}>
          <LabSection />
        </Suspense>
        
        <SectionDivider variant="glitch" />
        
        {/* CTA Section - Critical, load immediately */}
        <CTASection />
        
        <SectionDivider variant="gradient" />
        
        {/* Contact Section - Critical with error boundary */}
        <ErrorBoundary>
          <ContactSectionSecure id="contact" />
        </ErrorBoundary>
      </main>
      
      {/* Chat Widget - Lazy loaded, non-critical */}
      <Suspense fallback={null}>
        <SimpleTelegramChat />
      </Suspense>
    </DefaultLayout>
  );
};

export default HomePage;
