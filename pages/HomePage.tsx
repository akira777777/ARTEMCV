import React from 'react';
import { ScrollToTop } from '../components/ScrollToTop';
import ScrollProgress from '../components/ScrollProgress';
import ErrorBoundary from '../components/ErrorBoundary';
import CursorTrail from '../components/CursorTrail';
import SkipLink from '../components/SkipLink';
import { SectionDivider } from '../components/SectionDivider';
import { Navigation } from '../components/Navigation';
import Hero from '../components/Hero';
import { Footer } from '../components/Footer';
import { SpotlightGallery } from '../components/SpotlightGallery';
import { About } from '../components/About';
import { CTASection } from '../components/CTASection';
import ContactSectionSecure from '../components/ContactSectionSecure';
import InteractiveShowcase from '../components/InteractiveShowcase';
import { InteractiveGallery } from '../components/InteractiveGallery';
import { SimpleTelegramChat } from '../components/SimpleTelegramChat';
import DefaultLayout from '../components/DefaultLayout';

const HomePage: React.FC = () => {
  return (
    <DefaultLayout>
      <CursorTrail />
      <main id="main-content">
        <Hero />
        <SectionDivider variant="wave" />
        <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading gallery..." />}>
          <SpotlightGallery />
        </React.Suspense>
        <SectionDivider variant="particles" />
        <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading interactive gallery..." />}>
          <InteractiveGallery />
        </React.Suspense>
        <SectionDivider variant="diamond" />
        <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading about section..." />}>
          <About />
        </React.Suspense>
        <SectionDivider variant="pulse" />
        <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading interactive showcase..." />}>
          <InteractiveShowcase />
        </React.Suspense>
        <SectionDivider variant="glitch" />
        <React.Suspense fallback={<div className="h-72 w-full" aria-label="Loading gallery..." />}>
          <SpotlightGallery />
        </React.Suspense>
        <SectionDivider variant="dots" />
        <React.Suspense fallback={<div className="h-96" />}>
          <About />
        </React.Suspense>
        <SectionDivider variant="lines" />
        <React.Suspense fallback={<div className="h-72" />}>
          <CTASection />
        </React.Suspense>
        <SectionDivider variant="gradient" />
        <React.Suspense fallback={<div className="h-72" />}>
          <CTASection />
        </React.Suspense>
        <SectionDivider variant="lines" />
        <ErrorBoundary>
          <ContactSectionSecure id="contact" />
        </ErrorBoundary>
      </main>
      <React.Suspense fallback={null}>
        <SimpleTelegramChat />
      </React.Suspense>
    </DefaultLayout>
  );
};

export default HomePage;