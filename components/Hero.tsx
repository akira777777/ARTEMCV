
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
      <div className="flex flex-col items-center">
        {/* Animated Marquee */}
        <div className="marquee-container w-full py-4 opacity-10">
          <div className="marquee-content">
            <h1 className="text-[12vw] font-serif uppercase leading-none tracking-tighter whitespace-nowrap">AstraDev® AstraDev® AstraDev® AstraDev®</h1>
          </div>
          <div className="marquee-content">
             <h1 className="text-[12vw] font-serif uppercase leading-none tracking-tighter whitespace-nowrap">AstraDev® AstraDev® AstraDev® AstraDev®</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full mt-[-4vw]">
          <div className="flex flex-col items-center text-center space-y-12">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center p-3 animate-bounce">
               <svg className="w-full h-full text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-serif leading-tight">
                Full Stack разработчик <br /> <span className="italic">Web & Software</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Создаю масштабируемые приложения с React, Node.js, PostgreSQL. AI-интеграции, оптимизация БД, production-ready code.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
