import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n';

/**
 * CTA Section - Enhanced call-to-action with improved visual design
 */
export const CTASection: React.FC = React.memo(() => {
  const { t } = useI18n();

  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const stats = React.useMemo(() => [
    { number: '50+', label: t('cta.stat.projects') || 'Projects Completed' },
    { number: '30+', label: t('cta.stat.clients') || 'Happy Clients' },
    { number: '8+', label: t('cta.stat.experience') || 'Years Experience' },
  ], [t]);

  return (
    <section 
      className="py-32 px-6 relative overflow-hidden" 
      aria-labelledby="cta-heading"
    >
      {/* Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Decorative Icon */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="absolute top-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
      </motion.div>

      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Gradient Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto relative z-10 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-white/60 font-medium">{t('footer.available') || 'Available Q4 2026'}</span>
          </motion.div>

          <h2 
            id="cta-heading"
            className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight leading-[1.1]"
          >
            <span className="block">{t('cta.title')}</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              onClick={scrollToContact}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-4 bg-white text-black rounded-full font-bold text-base hover:bg-white/95 transition-all shadow-2xl flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-white/50 overflow-hidden"
              aria-label={t('cta.button')}
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="relative">{t('cta.button')}</span>
              <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </motion.button>

            <motion.a
              href="https://github.com/akira777777"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-4 bg-white/5 text-white rounded-full font-bold text-base border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 flex items-center gap-2"
              aria-label={t('cta.secondary')}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              {t('cta.secondary')}
            </motion.a>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-24 grid grid-cols-3 gap-8"
          role="list"
          aria-label="Statistics"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center relative" role="listitem">
              {/* Divider between stats */}
              {i > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden sm:block" />
              )}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-display font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
                aria-label={`${stat.number} ${stat.label}`}
              >
                {stat.number}
              </motion.div>
              <p className="text-sm md:text-base text-white/40 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
});

CTASection.displayName = 'CTASection';
