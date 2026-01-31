import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { I18nProvider } from './i18n';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import ErrorBoundary from './components/ErrorBoundary';
import CursorTrail from './components/CursorTrail';
import SkipLink from './components/SkipLink';
import { SectionDivider } from './components/SectionDivider';
import { CardStack } from './components/CardStack';
import { IconGallery } from './components/Icons';

// Lazy load heavy components
const SpotlightGallery = React.lazy(() => import('./components/SpotlightGallery').then(m => ({ default: m.SpotlightGallery })));
const About = React.lazy(() => import('./components/About').then(m => ({ default: m.About })));
const CTASection = React.lazy(() => import('./components/CTASection').then(m => ({ default: m.CTASection })));
const ContactSectionSecure = React.lazy(() => import('./components/ContactSectionSecure'));
const SimpleTelegramChat = React.lazy(() => import('./components/SimpleTelegramChat').then(m => ({ default: m.SimpleTelegramChat })));
const InteractiveShowcase = React.lazy(() => import('./components/InteractiveShowcase'));

const App: React.FC = () => {
  return (
    <I18nProvider>
      <SkipLink />
      <CursorTrail />
      <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-white/10 selection:text-white flex flex-col items-center">
        <ScrollProgress />
        <Navigation />
        <main id="main-content" className="content-wrapper">
          <Hero />
          
          {/* Icon Gallery Section */}
          <SectionDivider variant="dots" />
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-display font-black mb-6 gradient-text">
                  Design System Icons
                </h2>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                  Custom icon set designed for modern interfaces
                </p>
              </motion.div>
              <IconGallery />
            </div>
          </section>
          
          <SectionDivider variant="lines" />
          <CardStack />
          
          <SectionDivider variant="gradient" />
          <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading showcase..." />}>
            <InteractiveShowcase />
          </React.Suspense>
          <ErrorBoundary>
            <ContactSectionSecure id="contact" />
          </ErrorBoundary>
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
