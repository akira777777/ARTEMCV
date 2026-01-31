import React, { useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useI18n } from '../i18n';

const SPRING_CONFIG = { stiffness: 120, damping: 12, mass: 0.4 };
const ROTATION_RANGE = 50;

const InteractiveShowcase: React.FC = () => {
  const { t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  const rotateX = useTransform(springY, [-ROTATION_RANGE, ROTATION_RANGE], [10, -10]);
  const rotateY = useTransform(springX, [-ROTATION_RANGE, ROTATION_RANGE], [-12, 12]);

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect();
    }
  }, []);

  const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    
    const { left, top, width, height } = rectRef.current;
    const posX = event.clientX - left - width / 2;
    const posY = event.clientY - top - height / 2;
    
    x.set(Math.max(Math.min(posX, ROTATION_RANGE), -ROTATION_RANGE));
    y.set(Math.max(Math.min(posY, ROTATION_RANGE), -ROTATION_RANGE));
  }, [x, y]);

  const handleLeave = useCallback(() => {
    rectRef.current = null;
    x.set(0);
    y.set(0);
  }, [x, y]);

  const tags = useMemo(() => ["GSAP-free", "Perf-safe", "CSS 3D"], []);

  return (
    <section className="py-24" id="lab" aria-labelledby="lab-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">
          <motion.div
            ref={cardRef}
            role="region"
            aria-label={t('lab.tilt.title')}
            tabIndex={0}
            className="relative w-full lg:w-1/2 aspect-[5/4] rounded-[32px] overflow-hidden glass-card border border-white/10 cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
            style={{ perspective: 1200, willChange: 'transform' }}
            onMouseEnter={handleMouseEnter}
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
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.25),transparent_40%)]" aria-hidden="true" />
              <div className="absolute inset-0 holo-grid" aria-hidden="true" />
              <div className="absolute inset-6 rounded-[24px] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.0),rgba(255,255,255,0.08))]" />
              
              <motion.div
                className="absolute left-10 top-10 px-4 py-2 rounded-full floating-badge text-xs text-white/80"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                {t('lab.tilt.title')}
              </motion.div>
              
              <motion.div
                className="absolute right-10 bottom-10 px-4 py-2 rounded-full floating-badge text-xs text-emerald-200"
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              >
                {t('lab.tilt.hint')}
              </motion.div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-48 h-48 rounded-[22px] neon-prism"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
                  style={{ willChange: 'transform' }}
                />
              </div>
            </motion.div>
          </motion.div>

          <div className="w-full lg:w-1/2 space-y-8 relative">
            <div className="absolute -top-10 -left-6 w-28 h-28 blur-3xl bg-emerald-400/20" aria-hidden="true" />
            <div className="absolute -bottom-14 right-0 w-32 h-32 blur-3xl bg-sky-500/15" aria-hidden="true" />
            
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full floating-badge accent-pill text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
              <span>{t('lab.badge')}</span>
            </div>
            
            <h3 id="lab-heading" className="text-3xl md:text-4xl font-serif leading-tight">
              {t('lab.title')}
            </h3>
            
            <p className="text-zinc-400 text-lg">
              {t('lab.desc')}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-3xl glass-card p-6 border border-white/10 space-y-4">
                <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t('lab.orb')}</h4>
                <div className="relative flex items-center justify-center h-48">
                  <div className="holo-orb" aria-hidden="true" />
                  <span className="sr-only">Decorative holographic orb</span>
                  <div className="absolute text-[11px] uppercase tracking-[0.3em] text-emerald-100">touchless motion</div>
                </div>
              </div>
              
              <div className="rounded-3xl glass-card p-6 border border-white/10 space-y-4">
                <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t('lab.tokens')}</h4>
                <div className="flex flex-wrap gap-3">
                  {tags.map(tag => (
                    <span key={tag} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white/70" />
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-zinc-500 text-sm">{t('lab.tokens.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(InteractiveShowcase);
