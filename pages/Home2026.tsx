import React, { lazy, Suspense } from 'react';
import Hero2026 from '../components/home/Hero2026';
import { Footer2026 } from '../components/Footer2026';
import { Navigation } from '../components/Navigation';
import ErrorBoundary from '../components/ErrorBoundary';
import SkipLink from '../components/SkipLink';

// Lazy load heavy components to reduce initial bundle size
const BentoGrid = lazy(() => import('../components/home/BentoGrid'));
const LabSection = lazy(() => import('../components/home/LabSection'));
const About = lazy(() => import('../components/About').then(m => ({ default: m.About })));
const ContactSectionSecure = lazy(() => import('../components/ContactSectionSecure'));

// Loading fallback component
const SectionLoader = () => (
  <div className="py-32 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
  </div>
);

const Home2026: React.FC = () => {
  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-indigo-500/30 font-sans">
      <SkipLink />
      <Navigation />
      <main id="main-content">
        <ErrorBoundary>
          <Hero2026 />
        </ErrorBoundary>

        <Suspense fallback={<SectionLoader />}>  
          <ErrorBoundary>
            <BentoGrid />
          </ErrorBoundary>
        </Suspense>

        <Suspense fallback={<SectionLoader />}>  
          <ErrorBoundary>
            <LabSection />
          </ErrorBoundary>
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ErrorBoundary>
            <About />
          </ErrorBoundary>
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ErrorBoundary>
            <ContactSectionSecure />
          </ErrorBoundary>
        </Suspense>
      </main>
      <Footer2026 />
    </div>
  );
};

export default Home2026;
