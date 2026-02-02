import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n';
import { scrollToSection } from '../lib/utils';

/**
 * CTA Section - Strong call-to-action for project inquiries
 */
export const CTASection: React.FC = React.memo(() => {
  const { t } = useI18n();

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute -top-32 left-1/3 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" aria-hidden />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-6 tracking-tighter leading-tight">
            {t('cta.title') || 'Ready to Start Your Next Project?'}
          </h2>
          <p className="text-lg md:text-xl text-neutral-300 mb-12 max-w-2xl mx-auto">
            {t('cta.subtitle') || 'Let\'s collaborate and bring your vision to life. I\'m ready to start immediately.'}
            {t('cta.title')}
          </h2>
          <p className="text-lg md:text-xl text-neutral-300 mb-12 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={() => scrollToSection('contact')}
              onClick={scrollToContact}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-4 bg-white text-black rounded-full font-bold text-base hover:bg-neutral-100 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2"
            >
              {t('cta.button') || 'Start Collaboration'}
              {t('cta.button')}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <a
              href="https://github.com/akira777777"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-white/10 text-white rounded-full font-bold text-base border border-white/20 hover:border-white/50 hover:bg-white/20 transition-all"
            >
              {t('cta.secondary') || 'View GitHub'}
              {t('cta.secondary')}
            </a>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-3 gap-8 pt-16 border-t border-white/10"
        >
          {[
            { number: '50+', label: 'Projects Completed' },
            { number: '30+', label: 'Happy Clients' },
            { number: '3+', label: 'Years Experience' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2"
              >
                {stat.number}
              </motion.div>
              <p className="text-sm md:text-base text-neutral-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

CTASection.displayName = 'CTASection';
