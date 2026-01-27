
import React, { Suspense } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import ErrorBoundary from './components/ErrorBoundary';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import { I18nProvider } from './i18n';

// Lazy load AI features to reduce initial bundle
const BrandGenerator = React.lazy(() => import('./components/BrandGenerator'));

// Loading fallback component
const FeatureLoader: React.FC<{ feature: string }> = ({ feature }) => (
  <div className="py-32 px-6 lg:px-12 flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
        Loading {feature}...
      </p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <I18nProvider>
      <ErrorBoundary>
        <div className="min-h-screen transition-colors duration-300 relative overflow-hidden">
          <div className="glow-ring" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_40%)] blur-3xl opacity-70" aria-hidden />
          <div className="grid-overlay" aria-hidden />
          <div className="noise-overlay" aria-hidden />
          <Header />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-32">
              <Hero />
              <About />
              <Projects />
              <ErrorBoundary>
                <Suspense fallback={<FeatureLoader feature="Brand Generator" />}>
                  <BrandGenerator />
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>

          <ErrorBoundary>
            <ChatBot />
          </ErrorBoundary>
          <Footer />
        </div>
      </ErrorBoundary>
    </I18nProvider>
  );
};

export default App;
