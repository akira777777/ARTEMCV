import React from 'react';
import { I18nProvider } from './i18n';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import ErrorBoundary from './components/ErrorBoundary';
import CursorTrail from './components/CursorTrail';
import SkipLink from './components/SkipLink';
import { SectionDivider } from './components/SectionDivider';

// Lazy load heavy components
const SpotlightGallery = React.lazy(() => import('./components/SpotlightGallery').then(m => ({ default: m.SpotlightGallery })));
const About = React.lazy(() => import('./components/About').then(m => ({ default: m.About })));
const CTASection = React.lazy(() => import('./components/CTASection').then(m => ({ default: m.CTASection })));
const ContactSectionSecure = React.lazy(() => import('./components/ContactSectionSecure'));
const SimpleTelegramChat = React.lazy(() => import('./components/SimpleTelegramChat').then(m => ({ default: m.SimpleTelegramChat })));
const InteractiveShowcase = React.lazy(() => import('./components/InteractiveShowcase'));
const InteractiveGallery = React.lazy(() => import('./components/InteractiveGallery'));

const App: React.FC = () => {
  return (
    <I18nProvider>
      <SkipLink />
      <CursorTrail />
      <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-white/10 selection:text-white flex flex-col items-center">
        <ScrollProgress />
        <Navigation />
        <main id="main-content" className="content-wrapper">
          <Hero />
          <SectionDivider variant="wave" />
          <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading gallery..." />}>
            <SpotlightGallery />
          </React.Suspense>
          <SectionDivider variant="particles" />
          <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading interactive gallery..." />}>
            <InteractiveGallery />
          </React.Suspense>
          <SectionDivider variant="diamond" />
          <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading about section..." />}>
            <About />
          </React.Suspense>
          <SectionDivider variant="pulse" />
          <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading interactive showcase..." />}>
            <InteractiveShowcase />
          </React.Suspense>
          <SectionDivider variant="glitch" />
          <React.Suspense fallback={<div className="h-72 w-full" aria-label="Loading CTA..." />}>
            <CTASection />
          </React.Suspense>
          <SectionDivider variant="lines" />
          <ErrorBoundary>
            <ContactSectionSecure id="contact" />
          </ErrorBoundary>
        </main>
        <Footer />
        <React.Suspense fallback={null}>
          <SimpleTelegramChat />
        </React.Suspense>
        <ScrollToTop />
      </div>
    </I18nProvider>
  );
};

export default App;
