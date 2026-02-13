import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n';

/**
 * CleanHero - Minimalist hero section
 * Based on professional portfolio best practices:
 * - Clean typography, no excessive animations
 * - Single accent color
 * - Content-focused design
 * - Subtle entrance animations only
 */
const CleanHero: React.FC = () => {
  const { t } = useI18n();

  const scrollToWorks = () => {
    document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 py-32">
      <div className="max-w-4xl mx-auto w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            {t('hero.badge', 'AVAILABLE FOR WORK')}
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">Artem </span>
          <span className="text-[#10b981]">CV</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-[#a1a1aa] max-w-2xl mb-10"
        >
          {t('hero.description', 'Senior Full-Stack Developer specializing in modern web technologies, performance optimization, and clean user experiences.')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <button
            onClick={scrollToWorks}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#10b981] text-[#0a0a0a] font-semibold rounded-full hover:bg-[#34d399] transition-colors"
          >
            {t('hero.cta.explore', 'View Work')}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white font-semibold rounded-full hover:border-[#10b981] hover:text-[#10b981] transition-colors"
          >
            {t('hero.cta.contact', 'Contact Me')}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-8 md:gap-16"
        >
          <div>
            <div className="text-3xl font-bold text-white">50+</div>
            <div className="text-sm text-[#71717a]">Projects</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">8+</div>
            <div className="text-sm text-[#71717a]">Years</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">30+</div>
            <div className="text-sm text-[#71717a]">Clients</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CleanHero;
