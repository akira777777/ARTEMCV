import React, { Suspense, lazy } from 'react';
import { I18nProvider } from './i18n';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
const WorkGallery = React.lazy(() => import('./components/WorkGallery').then(m => ({ default: m.WorkGallery })));
const About = React.lazy(() => import('./components/About').then(m => ({ default: m.About })));
const ContactSectionSecure = React.lazy(() => import('./components/ContactSectionSecure'));
const SimpleTelegramChat = React.lazy(() => import('./components/SimpleTelegramChat').then(m => ({ default: m.SimpleTelegramChat })));
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
          <React.Suspense fallback={<div className="h-96" />}>
            <WorkGallery />
            <About />
            <ErrorBoundary>
              <ContactSectionSecure id="contact" />
            </ErrorBoundary>
          </React.Suspense>
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
