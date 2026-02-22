import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { I18nProvider } from './i18n';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import AccessibilityProvider from './components/AccessibilityProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { PageTransition } from './components/PageTransition';

// Lazy load main page
const HomePage = lazy(() => import('./pages/HomePage'));

// Loading fallback
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      <span className="text-sm text-zinc-500">Loading...</span>
    </div>
  </div>
);

/**
 * App Routes
 */
const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        {/* Redirect all other routes to home */}
        <Route
          path="*"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

/**
 * Main App Component
 */
const App: React.FC = () => {
  return (
    <I18nProvider>
      <AccessibilityProvider>
        <ErrorBoundary>
          <Router>
            <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
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
