
import React from 'react';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  activeTab: 'portfolio' | 'generator';
  setActiveTab: (tab: 'portfolio' | 'generator') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          {/* Brand */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group" 
            onClick={() => setActiveTab('portfolio')}
          >
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/shapes/svg?seed=Astra" alt="logo" className="w-full h-full opacity-80" />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase text-white">AstraDev®</span>
          </div>

          {/* Centered Nav Links */}
          <div className="hidden md:flex items-center space-x-12">
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-all ${activeTab === 'portfolio' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
            >
              Services
            </button>
            <button 
              onClick={() => setActiveTab('generator')}
              className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-all ${activeTab === 'generator' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
            >
              Identity Lab
            </button>
            <a href="#work" className="text-[11px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-all">
              Work
            </a>
          </div>

          {/* Action */}
          <div className="flex items-center space-x-6">
            <button 
              className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
