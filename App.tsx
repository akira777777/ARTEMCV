import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n';
import Home2026 from './pages/Home2026';
import DetailingHub from './pages/DetailingHub';
import { ScrollToTop } from './components/ScrollToTop';

// Lazy load heavy components
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
