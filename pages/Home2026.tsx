import React from 'react';
import Hero2026 from '../components/home/Hero2026';
import BentoGrid from '../components/home/BentoGrid';
import LabSection from '../components/home/LabSection';
import { Footer2026 } from '../components/Footer2026';
import { Navigation } from '../components/Navigation';

const Home2026: React.FC = () => {
  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-indigo-500/30 font-sans">
      <Navigation />
      <main>
        <Hero2026 />
        <BentoGrid />
        <LabSection />
      </main>
      <Footer2026 />
    </div>
  );
};

export default Home2026;
