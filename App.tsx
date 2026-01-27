
import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import ContactSectionSecure from './components/ContactSectionSecure';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import { I18nProvider } from './i18n';

// Lazy load ChatBot with large Gemini dependency
const ChatBot = lazy(() => import('./components/ChatBot'));

// Loading component for ChatBot
const ChatBotLoader = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-pulse">
      <div className="w-12 h-12 bg-indigo-600 rounded-full"></div>
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
              <ContactSectionSecure />
              <Suspense fallback={<ChatBotLoader />}>
                <ChatBot />
              </Suspense>
            </div>
          </main>

          <Footer />
        </div>
      </ErrorBoundary>
    </I18nProvider>
  );
};

export default App;
