
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import BrandGenerator from './components/BrandGenerator';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen transition-colors duration-300 relative overflow-hidden">
      <div className="glow-ring" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_40%)] blur-3xl opacity-70" aria-hidden />
      <div className="grid-overlay" aria-hidden />
      <div className="noise-overlay" aria-hidden />
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-32">
          <Hero />
          <About />
          <Projects />
          <BrandGenerator />
        </div>
      </main>

      <ChatBot />
      <Footer />
    </div>
  );
};

export default App;
