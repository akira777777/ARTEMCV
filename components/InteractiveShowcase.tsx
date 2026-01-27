import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const InteractiveShowcase: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 12, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 120, damping: 12, mass: 0.4 });
  const rotateX = useTransform(springY, [ -50, 50 ], [ 10, -10 ]);
  const rotateY = useTransform(springX, [ -50, 50 ], [ -12, 12 ]);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const posX = event.clientX - rect.left - rect.width / 2;
    const posY = event.clientY - rect.top - rect.height / 2;
    x.set(Math.max(Math.min(posX, 50), -50));
    y.set(Math.max(Math.min(posY, 50), -50));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="py-24" id="lab">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">
          <motion.div
            ref={cardRef}
            className="relative w-full lg:w-1/2 aspect-[5/4] rounded-[32px] overflow-hidden glass-card border border-white/10 cursor-pointer"
            style={{ perspective: 1200 }}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.25),transparent_40%)]" aria-hidden />
              <div className="absolute inset-0 holo-grid" aria-hidden />
              <div className="absolute inset-6 rounded-[24px] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.0),rgba(255,255,255,0.08))]" />
              <motion.div
                className="absolute left-10 top-10 px-4 py-2 rounded-full floating-badge text-xs text-white/80"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                3D Tilt Card
              </motion.div>
              <motion.div
                className="absolute right-10 bottom-10 px-4 py-2 rounded-full floating-badge text-xs text-emerald-200"
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              >
                Hover to explore
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-48 h-48 rounded-[22px] neon-prism"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
                />
              </div>
            </motion.div>
          </motion.div>

          <div className="w-full lg:w-1/2 space-y-8 relative">
            <div className="absolute -top-10 -left-6 w-28 h-28 blur-3xl bg-emerald-400/20" aria-hidden />
            <div className="absolute -bottom-14 right-0 w-32 h-32 blur-3xl bg-sky-500/15" aria-hidden />
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full floating-badge accent-pill text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
              Interactive Lab
            </div>
            <h3 className="text-3xl md:text-4xl font-serif leading-tight">Живые 3D-акценты для вау-эффекта.</h3>
            <p className="text-zinc-400 text-lg">Добавил интерактивную tilt-карту и голографический шар — оба работают без тяжёлых библиотек, только CSS 3D и Framer Motion. Поведение похоже на веб-темплейты из Figma-комьюнити: мягкие параллаксы, стеклянные поверхности, живые подсказки.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-3xl glass-card p-6 border border-white/10 space-y-4">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Holo Orb</div>
                <div className="relative flex items-center justify-center h-48">
                  <div className="holo-orb" />
                  <div className="absolute text-[11px] uppercase tracking-[0.3em] text-emerald-100">touchless motion</div>
                </div>
              </div>
              <div className="rounded-3xl glass-card p-6 border border-white/10 space-y-4">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Depth Tokens</div>
                <div className="space-y-3">
                  {["GSAP-free", "Perf-safe", "CSS 3D"].map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white/70" />
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-zinc-500 text-sm">Адаптируй под любые секции: карточки, CTA, превью кейсов или аватары.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveShowcase;
