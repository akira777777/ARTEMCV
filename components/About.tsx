import React from 'react';

export const About: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
      <section id="studio" className="py-24 md:py-40 border-t border-white/5 bg-neutral-950 relative overflow-hidden">
         <div className="absolute -top-32 left-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl float-slow" aria-hidden />
         <div className="absolute -bottom-40 right-0 w-[28rem] h-[28rem] rounded-full bg-emerald-400/10 blur-3xl float-slower" aria-hidden />
         <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              WE CRAFT DIGITAL <br />
              <span className="text-neutral-500">EXPERIENCES THAT</span> <br />
              DEFY EXPECTATIONS.
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-lg">
              Infinite Studio is a multidisciplinary creative agency focused on branding, motion, and digital design. We believe in the power of visual storytelling to elevate brands.
            </p>
            <div className="pt-8">
               <button 
                onClick={scrollToContact}
                className="relative px-8 py-4 bg-white text-black text-xs font-bold tracking-widest rounded-full hover:bg-neutral-200 transition-colors transform hover:scale-105 duration-300 cta-button sheen-sweep glow-pulse-soft"
               >
                  MORE ABOUT US
               </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 h-fit">
            <div className="space-y-4 pt-12">
               <div className="aspect-square bg-neutral-900 rounded-lg overflow-hidden relative group transition-transform duration-500 hover:-translate-y-1">
                  <img src="https://picsum.photos/400/400?random=20" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale hover:grayscale-0" alt="Team" />
               </div>
               <div className="aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden relative group transition-transform duration-500 hover:-translate-y-1">
                  <img src="https://picsum.photos/400/500?random=21" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale hover:grayscale-0" alt="Process" />
               </div>
            </div>
            <div className="space-y-4">
               <div className="aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden relative group transition-transform duration-500 hover:-translate-y-1">
                  <img src="https://picsum.photos/400/500?random=22" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale hover:grayscale-0" alt="Office" />
               </div>
               <div className="aspect-square bg-neutral-900 rounded-lg overflow-hidden relative group transition-transform duration-500 hover:-translate-y-1">
                  <img src="https://picsum.photos/400/400?random=23" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale hover:grayscale-0" alt="Meeting" />
               </div>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div id="services" className="mt-32 scroll-mt-24">
          <h3 className="text-xs font-bold tracking-widest text-neutral-500 mb-8 border-b border-white/10 pb-4">OUR SERVICES</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {['Art Direction', 'Web Development', 'Brand Identity', 'Motion Graphics', '3D Design', 'Photography'].map((service, index) => (
                <div key={service} className="service-card rounded-2xl px-6 py-5 group cursor-pointer transition-transform duration-500 hover:-translate-y-1">
                   <div className="flex items-center justify-between">
                      <h4 className="text-2xl font-display font-medium group-hover:text-neutral-300 transition-colors">
                        {service}
                      </h4>
                      <span className="text-xs text-neutral-500">0{index + 1}</span>
                   </div>
                   <div className="mt-4 h-px bg-white/5 group-hover:bg-white/15 transition-colors" />
                </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};