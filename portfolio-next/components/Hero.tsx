'use client';

import { useI18n } from '@/lib/i18n';
import Typewriter from 'typewriter-effect';
import { ParticleBackground } from './ParticleBackground';
import { ScrollLottie } from './ScrollLottie';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function Hero() {
  const { t } = useI18n();
  const ref = useRef(null);
  const { scrollY } = useScroll();

  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const yBg = useTransform(scrollY, [0, 500], [0, 50]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y: yBg }} className="absolute inset-0">
         <ParticleBackground />
      </motion.div>

      <motion.div style={{ y: yText }} className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium"
        >
          {t('hero.badge')}
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="block mb-2">{t('hero.title.line1')}</span>
          <span className="text-gradient">
            <Typewriter
              options={{
                strings: [t('hero.title.line2'), 'React & Next.js', 'Motion & UX'],
                autoStart: true,
                loop: true,
                delay: 75,
              }}
            />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed"
        >
          {t('hero.desc')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#projects"
            className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
          >
            {t('hero.cta.portfolio')}
          </a>
          <a
            href="#contact"
            className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all font-semibold backdrop-blur-sm"
          >
            {t('hero.cta.contact')}
          </a>
        </motion.div>
      </motion.div>

      {/* Gradient Orbs - Parallaxed */}
      <motion.div style={{ y: useTransform(scrollY, [0, 500], [0, -100]) }} className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-[float_8s_ease-in-out_infinite]" />
      <motion.div style={{ y: useTransform(scrollY, [0, 500], [0, -50]) }} className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-[float_10s_ease-in-out_infinite]" />

      <ScrollLottie />
    </section>
  );
}
