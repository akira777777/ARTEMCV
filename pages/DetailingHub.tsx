import React from 'react';
import ProjectNavigation from '../components/detailing/ProjectNavigation';
import CarConfigurator from '../components/detailing/CarConfigurator';

const DetailingHub: React.FC = () => {
  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-blue-500 selection:text-white font-sans">
      <ProjectNavigation />

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505] z-10 pointer-events-none"></div>
            <CarConfigurator />
          </div>

          <div className="relative z-30 text-center max-w-4xl px-6 pointer-events-none mt-40">
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-4 italic text-white drop-shadow-2xl">DETAILING HUB</h1>
            <p className="text-xl md:text-2xl text-white/60 font-light max-w-2xl mx-auto mb-12">
              A high-performance interactive 3D platform for automotive enthusiasts to customize and book premium services.
            </p>
            <div className="flex items-center justify-center gap-4 pointer-events-auto">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <span className="material-symbols-outlined text-blue-500 text-sm">rotate_left</span>
                <span className="text-xs font-bold uppercase text-white">Click & Drag to Rotate</span>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Sophistication */}
        <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto" id="technical">
          <div className="mb-16">
            <span className="text-blue-500 font-bold uppercase tracking-[0.3em] text-sm block mb-4">Architecture</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">Technical Sophistication</h2>
          </div>
          <div className="grid grid-cols-12 gap-6 h-auto md:h-[700px]">
            <div className="col-span-12 md:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-10 flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <div className="size-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-8 border border-blue-500/30">
                  <span className="material-symbols-outlined text-blue-500">bolt</span>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">Real-time Rendering <br/>Optimization</h3>
                <p className="text-white/60 text-lg leading-relaxed max-w-md">
                  Custom GLSL shaders and geometry instancing to achieve 144FPS on desktop and 60FPS on mobile devices, ensuring fluid transitions during paint customization.
                </p>
              </div>
              <div className="absolute right-[-10%] bottom-[-10%] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none">
                <span className="material-symbols-outlined text-[300px] text-blue-500">deployed_code</span>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 bg-blue-500 p-10 flex flex-col justify-between text-black rounded-xl">
              <div>
                <div className="size-12 bg-black/10 rounded-xl flex items-center justify-center mb-8 border border-black/10">
                  <span className="material-symbols-outlined">api</span>
                </div>
                <h3 className="text-3xl font-bold mb-4 leading-tight">Serverless <br/>Booking Engine</h3>
                <p className="text-black/70 text-lg font-medium">
                  A headless commerce architecture utilizing serverless functions for instant calendar sync and automated service dispatch.
                </p>
              </div>
              <div className="bg-black/10 p-4 rounded-lg border border-black/5 backdrop-blur-sm">
                <div className="flex items-center justify-between text-xs font-bold uppercase mb-2">
                  <span>Latency</span>
                  <span>12ms</span>
                </div>
                <div className="h-1 bg-black/20 rounded-full">
                  <div className="w-[85%] h-full bg-black rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
              <h4 className="text-xl font-bold mb-3 text-white">Dynamic Lighting</h4>
              <p className="text-sm text-white/50">HDR-mapped environments for photorealistic reflections on car bodies.</p>
            </div>
            <div className="col-span-12 md:col-span-4 bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
              <h4 className="text-xl font-bold mb-3 text-white">Post-Processing</h4>
              <p className="text-sm text-white/50">Bloom, SSAO, and TAA layers for a premium cinematic aesthetic.</p>
            </div>
            <div className="col-span-12 md:col-span-4 bg-white/5 border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-colors">
              <h4 className="text-xl font-bold mb-3 text-white">Responsive 3D</h4>
              <p className="text-sm text-white/50">Unified UI controls across desktop, tablet, and mobile browsers.</p>
            </div>
          </div>
        </section>

        {/* Footer for Case Study */}
        <footer className="py-20 px-6 md:px-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-white/40 text-sm">© 2026 Senior Frontend Engineer & 3D Specialist.</p>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-2">Project Type</span>
              <span className="text-white font-medium flex items-center gap-2">
                <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                Interactive WebGL
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default DetailingHub;
