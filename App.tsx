import React from 'react';
import { I18nProvider } from './i18n';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { WorkGallery } from './components/WorkGallery';
import { About } from './components/About';
import ContactSectionSecure from './components/ContactSectionSecure';
import { Footer } from './components/Footer';
import { SimpleTelegramChat } from './components/SimpleTelegramChat';
import { ScrollToTop } from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import ErrorBoundary from './components/ErrorBoundary';
import SkipLink from './components/SkipLink';

const App: React.FC = () => {
  return (
    <I18nProvider>
      <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
        <SkipLink />
        <ScrollProgress />
        <Navigation />
        <main id="main-content">
          <Hero />
          <WorkGallery />
          <About />
          <ErrorBoundary>
            <ContactSectionSecure id="contact" />
          </ErrorBoundary>
          <Footer />
        </main>
        <SimpleTelegramChat />
        <ScrollToTop />
      </div>
    </I18nProvider>
  );
};

export default App;
