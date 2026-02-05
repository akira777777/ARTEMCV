import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import CursorTrail from '../components/CursorTrail';
import { SectionDivider } from '../components/SectionDivider';
import Hero from '../components/Hero';
import { SpotlightGallery } from '../components/SpotlightGallery';
import { About } from '../components/About';
import { CTASection } from '../components/CTASection';
import ContactSectionSecure from '../components/ContactSectionSecure';
import LabSection from "../components/home/LabSection";
import { InteractiveGallery } from '../components/InteractiveGallery';
import { SimpleTelegramChat } from '../components/SimpleTelegramChat';
import DefaultLayout from '../components/DefaultLayout';

const HomePage: React.FC = () => {
  return (
    <DefaultLayout>
      <CursorTrail />
<<<<<<< HEAD
      
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
      
=======
      <>
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
        <React.Suspense fallback={<div className="h-96 w-full" aria-label="Loading lab section..." />}>
          <LabSection />
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
      </>
>>>>>>> 84623174eb109040aedf8efc6ce9f3db11e383bc
      <React.Suspense fallback={null}>
        <SimpleTelegramChat />
      </React.Suspense>
    </DefaultLayout>
  );
};

export default HomePage;
