import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import CursorTrail from '../components/CursorTrail';
import { SectionDivider } from '../components/SectionDivider';
import Hero from '../components/Hero';
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
      
      <React.Suspense fallback={<div className="h-72 w-full" aria-label="Loading CTA section..." />}>
        <CTASection />
      </React.Suspense>
      
      <SectionDivider variant="gradient" />
      
      <ErrorBoundary>
        <ContactSectionSecure id="contact" />
      </ErrorBoundary>
      
      <React.Suspense fallback={null}>
        <SimpleTelegramChat />
      </React.Suspense>
    </DefaultLayout>
  );
};

export default HomePage;
