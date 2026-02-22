import React, { Suspense } from 'react';
import { Navigation } from '../components/Navigation';
import { SkipLink } from '../components/SkipLink';
import ScrollProgress from '../components/ScrollProgress';

// Unified components (only new version)
import { HeroUnified } from '../components/home/HeroUnified';
import { WorksUnified } from '../components/home/WorksUnified';
import { AboutUnified } from '../components/home/AboutUnified';
import { ContactUnified } from '../components/home/ContactUnified';
import { FooterUnified } from '../components/home/FooterUnified';

// Lazy load chat
const SimpleTelegramChat = React.lazy(() => import('../components/SimpleTelegramChat'));

/**
 * Home Page - New Unified Version
 */
const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <SkipLink />
      <Navigation />
      <ScrollProgress />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <HeroUnified />
        <WorksUnified />
        <AboutUnified />
        <ContactUnified />
      </main>

      <FooterUnified />

      <Suspense fallback={null}>
        <SimpleTelegramChat />
      </Suspense>
    </div>
  );
};

export default HomePage;
