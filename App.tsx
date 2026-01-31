import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { I18nProvider } from './i18n';
import { Navigation } from './components/Navigation';
import Hero from './components/Hero';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import ErrorBoundary from './components/ErrorBoundary';
import CursorTrail from './components/CursorTrail';
import SkipLink from './components/SkipLink';
import { SectionDivider } from './components/SectionDivider';
import { CardStack } from './components/CardStack';
import { IconGallery } from './components/Icons';
import FramerIntegration from './components/FramerIntegration';
import FramerLayout from './components/FramerLayout';

// Lazy load heavy components
const SpotlightGallery = React.lazy(() => import('./components/SpotlightGallery').then(m => ({ default: m.SpotlightGallery })));
const About = React.lazy(() => import('./components/About').then(m => ({ default: m.About })));
const CTASection = React.lazy(() => import('./components/CTASection').then(m => ({ default: m.CTASection })));
const ContactSectionSecure = React.lazy(() => import('./components/ContactSectionSecure'));
const SimpleTelegramChat = React.lazy(() => import('./components/SimpleTelegramChat').then(m => ({ default: m.SimpleTelegramChat })));
const InteractiveShowcase = React.lazy(() => import('./components/InteractiveShowcase'));
const InteractiveGallery = React.lazy(() => import('./components/InteractiveGallery'));
const GradientShaderCard = React.lazy(() => import('./components/GradientShaderCard'));

const App: React.FC = () => {
  return (
    <I18nProvider>
      <SkipLink />
      <CursorTrail />
      <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-white/10 selection:text-white flex flex-col items-center">
        <ScrollProgress />
        <React.Suspense fallback={
          <div className="nav-skeleton fixed top-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-md z-50" aria-label="Loading navigation..." />
        }>
          <header>
            <Navigation />
          </header>
        </React.Suspense>
        <main id="main-content" className="content-wrapper" role="main">
          <React.Suspense fallback={
            <div className="hero-skeleton min-h-screen flex items-center justify-center text-center">
              <div className="text-white">
                <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6" />
                <p className="text-xl">Loading portfolio...</p>
              </div>
            </div>
          }>
            <Hero />
          </React.Suspense>
          
          {/* Framer Layout Section - Integrated design from temp.html */}
          <SectionDivider variant="gradient" />
          <section aria-labelledby="framer-layout-heading">
            <FramerLayout />
          </section>
          
          {/* Framer Integration Section - Showcases adapted Framer styles with user's preferred color scheme */}
          <SectionDivider variant="gradient" />
          <section aria-labelledby="framer-integration-heading">
            <FramerIntegration />
          </section>
          
          {/* Icon Gallery Section */}
          <SectionDivider variant="dots" />
          <section className="py-20 px-6" aria-labelledby="icons-heading">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 id="icons-heading" className="text-4xl md:text-5xl font-display font-black mb-6 gradient-text">
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
          <section aria-labelledby="card-stack-heading">
            <CardStack />
          </section>
          
          <SectionDivider variant="gradient" />
          <React.Suspense fallback={<div className="h-96 w-full bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-3xl" aria-label="Loading interactive card..." />}>
            <GradientShaderCard />
          </React.Suspense>
          
          <SectionDivider variant="wave" />
          <section aria-label="Spotlight Gallery">
            <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading gallery..." />}>
            <SpotlightGallery />
          </React.Suspense>
          </section>
          
          <SectionDivider variant="particles" />
          <section aria-label="Interactive Gallery">
            <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading interactive gallery..." />}>
            <InteractiveGallery />
          </React.Suspense>
          </section>
          
          <SectionDivider variant="diamond" />
          <section aria-label="About Section">
            <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading about section..." />}>
            <About />
          </React.Suspense>
          </section>
          
          <SectionDivider variant="pulse" />
          <section aria-label="Interactive Showcase">
            <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading interactive showcase..." />}>
            <InteractiveShowcase />
          </React.Suspense>
          </section>
          
          <SectionDivider variant="glitch" />
          <section aria-label="Call to Action">
            <React.Suspense fallback={<div className="h-72 w-full" aria-label="Loading CTA..." />}>
            <CTASection />
          </React.Suspense>
          </section>
          
          <SectionDivider variant="lines" />
          <section aria-labelledby="contact-heading">
            <ErrorBoundary>
              <ContactSectionSecure id="contact" />
            </ErrorBoundary>
          </section>
        </main>
        <React.Suspense fallback={
          <div className="h-40 bg-black border-t border-white/10" aria-label="Loading footer..." />
        }>
          <footer>
            <Footer />
          </footer>
        </React.Suspense>
        <React.Suspense fallback={null}>
          <SimpleTelegramChat />
        </React.Suspense>
        <ScrollToTop />
      </div>
    </I18nProvider>
  );
};

export default App;