import React, { Suspense, lazy } from 'react';
import { I18nProvider } from './i18n';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import ContactSectionSecure from './components/ContactSectionSecure';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import ErrorBoundary from './components/ErrorBoundary';
import CursorTrail from './components/CursorTrail';
import SkipLink from './components/SkipLink';

// Lazy load heavy components
const WorkGallery = lazy(() => import('./components/WorkGallery').then(m => ({ default: m.WorkGallery })));
const SimpleTelegramChat = lazy(() => import('./components/SimpleTelegramChat').then(m => ({ default: m.SimpleTelegramChat })));
const GradientShaderCard = lazy(() => import('./components/GradientShaderCard'));
const InteractiveShowcase = lazy(() => import('./components/InteractiveShowcase'));
const SpinningCube = lazy(() => import('./components/SpinningCube'));

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

          <ErrorBoundary>
            <Suspense fallback={<div className="w-full h-[600px] bg-neutral-950 animate-pulse" />}>
              <WorkGallery />
            </Suspense>
          </ErrorBoundary>

          <div className="container mx-auto px-6 py-20">
            <ErrorBoundary>
              <Suspense fallback={<div className="w-full h-[400px] bg-white/5 animate-pulse rounded-[2.7rem]" />}>
                <GradientShaderCard />
              </Suspense>
            </ErrorBoundary>
          </div>

          <ErrorBoundary>
            <Suspense fallback={null}>
              <InteractiveShowcase />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary>
            <Suspense fallback={null}>
              <SpinningCube />
            </Suspense>
          </ErrorBoundary>

          <About />
          <ErrorBoundary>
            <ContactSectionSecure id="contact" />
          </ErrorBoundary>
        </main>
        <Footer />
        <Suspense fallback={null}>
          <SimpleTelegramChat />
        </Suspense>
        <ScrollToTop />
      </div>
    </I18nProvider>
  );
};

export default App;
