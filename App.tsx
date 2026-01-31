import React, { Suspense, lazy } from 'react';
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
const SpotlightGallery = lazy(() => import('./components/SpotlightGallery').then(m => ({ default: m.SpotlightGallery })));
const About = lazy(() => import('./components/About').then(m => ({ default: m.About })));
const CTASection = lazy(() => import('./components/CTASection').then(m => ({ default: m.CTASection })));
const ContactSectionSecure = lazy(() => import('./components/ContactSectionSecure'));
const SimpleTelegramChat = lazy(() => import('./components/SimpleTelegramChat').then(m => ({ default: m.SimpleTelegramChat })));
const GradientShaderCard = lazy(() => import('./components/GradientShaderCard'));
const InteractiveShowcase = lazy(() => import('./components/InteractiveShowcase'));
const SpinningCube = lazy(() => import('./components/SpinningCube'));
const InteractiveSection = lazy(() => import('./components/InteractiveElements').then(m => ({ default: m.InteractiveSection })));

const App: React.FC = () => {
  return (
    <I18nProvider>
      <SkipLink />
      <CursorTrail />
      <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-white/10 selection:text-white">
        <ScrollProgress />
        <Navigation />
        <main id="main-content">
          <Hero />
          <SectionDivider variant="dots" />
          <React.Suspense fallback={<div className="h-96" />}>
            <SpotlightGallery />
          </React.Suspense>
          <SectionDivider variant="lines" />
          <React.Suspense fallback={<div className="h-96" />}>
            <About />
          </React.Suspense>
          <SectionDivider variant="gradient" />
          <React.Suspense fallback={<div className="h-72" />}>
            <CTASection />
          </React.Suspense>
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
