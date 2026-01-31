import React from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { WorkGallery } from './components/WorkGallery';
import { About } from './components/About';
import ContactSectionSecure from './components/ContactSectionSecure';
import { Footer } from './components/Footer';
import { AIChatOverlay } from './components/AIChatOverlay';
import { ScrollToTop } from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-white selection:text-black">
      <Navigation />
      <main>
        <Hero />
        <WorkGallery />
        <About />
        <ErrorBoundary>
          <ContactSectionSecure id="contact" />
        </ErrorBoundary>
        <Footer />
      </main>
      <AIChatOverlay />
      <ScrollToTop />
    </div>
  );
};

export default App;