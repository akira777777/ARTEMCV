import React, { lazy } from 'react';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n';
import Home2026 from './pages/Home2026';
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

// Lazy load heavy components
const DetailingHub = React.lazy(() => import('./pages/DetailingHub'));
const SimpleTelegramChat = React.lazy(() =>
  import('./components/SimpleTelegramChat').then(m => ({ default: m.SimpleTelegramChat }))
);

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
  </div>
);

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
      <Router>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home2026 />} />
            <Route path="/project/detailing" element={<DetailingHub />} />
            {/* Fallback for old routes or 404 could go here */}
            <Route path="*" element={<Home2026 />} />
          </Routes>
          <SimpleTelegramChat />
        </Suspense>
      </Router>
    </I18nProvider>
  );
};

export default App;
