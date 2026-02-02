import React from 'react';
import FramerIntegration from '../components/FramerIntegration';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

const FramerDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>
        <FramerIntegration />
      </main>
      <Footer />
    </div>
  );
};

export default FramerDemo;