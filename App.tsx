import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n';
import Home2026 from './pages/Home2026';
import HomePage from './pages/HomePage';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import AccessibilityProvider from './components/AccessibilityProvider';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load heavy components
const DetailingHub = lazy(() => import('./pages/DetailingHub'));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  return (
    <I18nProvider>
      <AccessibilityProvider>
        <ErrorBoundary>
          <Router>
            <div className="relative">
              <AccessibilityPanel />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home2026" element={<Home2026 />} />
                  <Route path="/project/detailing" element={<DetailingHub />} />
                  <Route path="/detailing" element={<DetailingHub />} />
                  {/* Fallback for old routes or 404 could go here */}
                  <Route path="*" element={<Home2026 />} />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </ErrorBoundary>
      </AccessibilityProvider>
    </I18nProvider>
  );
};

export default App;
