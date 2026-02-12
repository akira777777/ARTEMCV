import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { I18nProvider } from './i18n';
import Home2026 from './pages/Home2026';
import HomePage from './pages/HomePage';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import AccessibilityProvider from './components/AccessibilityProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { PageTransition } from './components/PageTransition';

// Lazy load heavy components
const DetailingHub = lazy(() => import('./pages/DetailingHub'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <HomePage />
          </PageTransition>
        } />
        <Route path="/home2026" element={
          <PageTransition>
            <Home2026 />
          </PageTransition>
        } />
        <Route path="/project/detailing" element={
          <PageTransition>
            <DetailingHub />
          </PageTransition>
        } />
        <Route path="/detailing" element={
          <PageTransition>
            <DetailingHub />
          </PageTransition>
        } />
        {/* Fallback for old routes or 404 could go here */}
        <Route path="*" element={
          <PageTransition>
            <Home2026 />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <I18nProvider>
      <AccessibilityProvider>
        <ErrorBoundary>
          <Router>
            <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
              <AccessibilityPanel />
              <Suspense fallback={<PageLoader />}>
                <AppRoutes />
              </Suspense>
            </div>
          </Router>
        </ErrorBoundary>
      </AccessibilityProvider>
    </I18nProvider>
  );
};

export default App;

