import React, { useRef, useEffect, useMemo } from 'react';
import { ArrowRight, Code2, Palette, Zap, Users } from 'lucide-react';

export const Hero: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);

  const cards = useMemo(
    () => [
      { src: 'https://picsum.photos/400/600?random=1', rotate: -15, z: 10, label: 'BRAND' },
      { src: 'https://picsum.photos/400/600?random=2', rotate: -5, z: 20, label: 'WEB' },
      { src: 'https://picsum.photos/400/600?random=3', rotate: 5, z: 30, label: 'MOTION' },
      { src: 'https://picsum.photos/400/600?random=4', rotate: 15, z: 10, label: 'DESIGN' },
    ],
    []
  );

  const zClassByValue = useMemo(
    () => ({
      10: 'z-10',
      20: 'z-20',
      30: 'z-30',
    }),
    []
  );

  useEffect(() => {
    const applyTransforms = (x: number, y: number) => {
      cardRefs.current.forEach((el, index) => {
        const card = cards[index];
        if (!el || !card) return;
        const translateX = index * 10 - 15;
        const rotate = card.rotate + x * (index + 1) * 0.1;
        const translateY = y * (index + 1) * 0.2;
        el.style.transform = `translateX(${translateX}px) rotate(${rotate}deg) translateY(${translateY}px)`;
      });
    };

    let latestX = 0;
    let latestY = 0;

    const run = () => {
      applyTransforms(latestX, latestY);
      rafRef.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { innerWidth, innerHeight } = globalThis;
      latestX = (e.clientX / innerWidth - 0.5) * 20; // -10 to 10
      latestY = (e.clientY / innerHeight - 0.5) * 20; // -10 to 10
      rafRef.current ??= globalThis.requestAnimationFrame(run);
    };

    applyTransforms(0, 0);
    globalThis.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      globalThis.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        globalThis.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [cards]);

  const scrollToWorks = () => {
    document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

      {/* Main Typography */}
      <div className="z-10 text-center mb-12 relative px-4">
        <div className="flex items-center justify-center mb-6">
          <span className="text-5xl md:text-7xl font-display font-bold animate-pulse bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">∞</span>
        </div>
        <h1 className="text-[12vw] leading-[0.85] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-indigo-300 select-none">
          ARTEM
        </h1>
        <div className="mt-6 mb-4 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"></div>
          <p className="text-lg md:text-2xl text-white font-semibold tracking-wide bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
            Full-Stack Developer & UI/UX Designer
          </p>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"></div>
        </div>
        <p className="mt-6 text-neutral-400 max-w-2xl mx-auto text-base md:text-lg font-light tracking-wide leading-relaxed">
          Crafting high-performance web applications with modern technologies. Specialized in React, TypeScript, and creating exceptional user experiences.
        </p>
      </div>

      {/* 3D Card Effect */}
      <div className="relative w-full max-w-4xl h-[400px] md:h-[500px] flex items-center justify-center perspective-1000">
        <div className="relative w-64 h-96 md:w-80 md:h-[450px]">
          {cards.map((card, index) => (
            <div
              key={card.label}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className={`absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden border border-white/5 transition-transform duration-700 ease-out group shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] ${zClassByValue[card.z] ?? 'z-10'}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src={card.src}
                alt="Studio Work"
                className="w-full h-full object-cover filter saturate-50 group-hover:saturate-100 transition-all duration-700 scale-105 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-bold tracking-widest uppercase border border-white/20">
                  Drag
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent backdrop-blur-sm border border-indigo-400/20 hover:border-indigo-400/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all duration-300 group">
            <Code2 className="w-8 h-8 mx-auto mb-3 text-indigo-400 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
            <div className="text-3xl md:text-4xl font-black text-white bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-transparent">50+</div>
            <div className="text-xs text-indigo-300/80 tracking-widest mt-1">PROJECTS</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent backdrop-blur-sm border border-emerald-400/20 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 group">
            <Users className="w-8 h-8 mx-auto mb-3 text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
            <div className="text-3xl md:text-4xl font-black text-white bg-gradient-to-br from-white to-emerald-200 bg-clip-text text-transparent">30+</div>
            <div className="text-xs text-emerald-300/80 tracking-widest mt-1">CLIENTS</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-transparent backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] transition-all duration-300 group">
            <Zap className="w-8 h-8 mx-auto mb-3 text-yellow-400 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
            <div className="text-3xl md:text-4xl font-black text-white bg-gradient-to-br from-white to-yellow-200 bg-clip-text text-transparent">3+</div>
            <div className="text-xs text-yellow-300/80 tracking-widest mt-1">YEARS EXP</div>
          </div>
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent backdrop-blur-sm border border-pink-400/20 hover:border-pink-400/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300 group">
            <Palette className="w-8 h-8 mx-auto mb-3 text-pink-400 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
            <div className="text-3xl md:text-4xl font-black text-white bg-gradient-to-br from-white to-pink-200 bg-clip-text text-transparent">100%</div>
            <div className="text-xs text-pink-300/80 tracking-widest mt-1">SATISFACTION</div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToWorks}
        className="absolute bottom-4 right-10 hidden md:flex items-center gap-4 text-xs font-bold tracking-widest text-neutral-500 cursor-pointer hover:text-white transition-colors group"
      >
        SCROLL TO EXPLORE <ArrowRight className="w-4 h-4 animate-bounce group-hover:translate-x-1 transition-transform" />
      </button>
    </section>
  );
});
