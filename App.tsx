
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import SpinningCube from './components/SpinningCube';
import BrandGenerator from './components/BrandGenerator';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import { Theme } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.DARK);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'generator'>('portfolio');

  useEffect(() => {
    if (theme === Theme.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'portfolio' ? (
          <div className="space-y-32">
            <Hero />
            <SpinningCube />
            <About />
            <Projects />
          </div>
        ) : (
          <BrandGenerator />
        )}
      </main>

      <ChatBot />
      <Footer />
    </div>
  );
};

export default App;
