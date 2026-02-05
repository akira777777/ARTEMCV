import React, { useMemo } from 'react';
import { useI18n } from '../../i18n';
import { motion } from 'framer-motion';
import OptimizedParticleCanvas from '../../components/OptimizedParticleCanvas'; // Import the optimized component

// Extracted style objects to constants to reduce object allocations
const DECORATIVE_BLOB_BASE_STYLE = "absolute rounded-full blur-[120px] animate-pulse";
const TOP_BLOB_STYLE = `${DECORATIVE_BLOB_BASE_STYLE} top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20`;
const BOTTOM_BLOB_STYLE = `${DECORATIVE_BLOB_BASE_STYLE} bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10`;

// Memoized style objects for performance
const BOTTOM_BLOB_DELAY_STYLE = { animationDelay: '-2s' } as const;

const Hero2026: React.FC = () => {
  const { t } = useI18n();

  // Memoize the animation variants to prevent recreation on each render
  const badgeAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  }), []);

  const titleLine1Animation = useMemo(() => ({
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.2 }
  }), []);

  const titleLine2Animation = useMemo(() => ({
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.4 }
  }), []);

  const descriptionAnimation = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, delay: 0.6 }
  }), []);

  const ctaAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.8 }
  }), []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Canvas - Using performance optimization */}
      <div className="absolute inset-0 z-0 opacity-60">
        <OptimizedParticleCanvas />
      </div>

      {/* Decorative Blobs from CSS - Using memoized classes */}
      <div className={TOP_BLOB_STYLE}></div>
      <div className={BOTTOM_BLOB_STYLE} style={BOTTOM_BLOB_DELAY_STYLE}></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.div
          {...badgeAnimation}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-pulse border border-white/10 bg-white/5 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></span>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-70 text-white">{t('hero.badge')}</span>
        </motion.div>

        <h1 className="text-6xl md:text-[9rem] font-display font-extrabold tracking-tighter leading-[0.85] mb-8 text-white">
          <motion.div {...titleLine1Animation}>
            {t('hero.title.line1')}
          </motion.div>
          <motion.span {...titleLine2Animation} className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-400 block">
            {t('hero.title.line2')}
          </motion.span>
        </h1>

        <motion.p
          {...descriptionAnimation}
          className="max-w-xl mx-auto text-lg md:text-xl opacity-50 font-light mb-12 text-white"
        >
          {t('hero.description')}
        </motion.p>

        <motion.div
          {...ctaAnimation}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <a 
            href="#works"
            className="bg-indigo-600 px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 text-white"
          >
            {t('hero.cta.portfolio')} <span className="material-symbols-outlined text-sm">arrow_downward</span>
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <span className="text-[10px] tracking-[0.4em] uppercase text-white">{t('hero.cta.scroll')}</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section>
  );
};

export default React.memo(Hero2026);
