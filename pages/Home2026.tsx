import React, { lazy, Suspense } from 'react';
import CinematicHero from '../components/home/CinematicHero';
import DefaultLayout from '../components/DefaultLayout';
// Lazy load heavy components to reduce initial bundle size
const BentoGrid = lazy(() => import('../components/home/BentoGrid'));
const LabSection = lazy(() => import('../components/home/LabSection'));

// Loading fallback component
const SectionLoader = () => (
  <div className="py-32 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
  </div>
);

const Home2026: React.FC = () => {
  return (
    <DefaultLayout>
      <CinematicHero />
      <Suspense fallback={<SectionLoader />}>
        <BentoGrid />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <LabSection />
      </Suspense>
    </DefaultLayout>
  );
};

export default Home2026;
