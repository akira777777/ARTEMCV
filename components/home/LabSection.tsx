import React from 'react';
import { useI18n } from '../../i18n';

const LabSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="py-32 bg-[#080808] relative overflow-hidden" id="lab">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <span className="text-indigo-500 font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Experimental R&D</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white">The Digital Lab</h2>
          </div>
          <p className="max-w-md opacity-50 text-right text-white">Exploring the boundaries of fluid dynamics, spatial UI, and AI-driven frontend architectures.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group cursor-pointer">
            <div className="aspect-video glass rounded-3xl mb-6 overflow-hidden relative border border-white/10">
              <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/20 transition-colors"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-6xl opacity-20 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500 text-white">blur_on</span>
              </div>
            </div>
            <h5 className="font-bold text-xl mb-2 text-white">Fluid Cursor Physics</h5>
            <p className="text-sm opacity-40 text-white">Interactive particle system reacting to high-frequency motion data.</p>
          </div>
          <div className="group cursor-pointer">
            <div className="aspect-video glass rounded-3xl mb-6 overflow-hidden relative border border-white/10">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/20 transition-colors"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-6xl opacity-20 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500 text-white">spatial_tracking</span>
              </div>
            </div>
            <h5 className="font-bold text-xl mb-2 text-white">Spatial Navigation</h5>
            <p className="text-sm opacity-40 text-white">Z-axis focused navigation paradigms for future spatial browsers.</p>
          </div>
          <div className="group cursor-pointer">
            <div className="aspect-video glass rounded-3xl mb-6 overflow-hidden relative border border-white/10">
              <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/20 transition-colors"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="material-symbols-outlined text-6xl opacity-20 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500 text-white">psychology</span>
              </div>
            </div>
            <h5 className="font-bold text-xl mb-2 text-white">Predictive UI</h5>
            <p className="text-sm opacity-40 text-white">LLM-integrated components that adapt layout based on user intent.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LabSection;
