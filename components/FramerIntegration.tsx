import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useTranslation } from '../i18n';

interface FramerIntegrationProps {
  className?: string;
}

const FramerIntegration: React.FC<FramerIntegrationProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const controls = useAnimation();
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.section
      ref={setRef}
      className={`relative min-h-screen py-20 px-6 overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {/* Background with user's preferred color scheme */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-teal-900/15 to-orange-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(16,185,129,0.15),transparent_50%),radial-gradient(ellipse_at_70%_70%,rgba(245,158,11,0.12),transparent_50%)]" />
      </div>

      {/* Aurora effect layer */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(16,185,129,0.1)_25%,rgba(6,182,212,0.12)_50%,rgba(245,158,11,0.08)_75%,transparent_100%)] animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Hero Section - Adapted Framer Structure */}
        <motion.div 
          className="text-center mb-20"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-teal-400 to-orange-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('hero.title')}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 neon-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('hero.cta.primary')}
            </motion.button>
            
            <motion.button
              className="px-8 py-4 border-2 border-teal-400 text-teal-400 font-semibold rounded-full hover:bg-teal-400 hover:text-gray-900 transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('hero.cta.secondary')}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Section - Framer Success Stories Style */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={itemVariants}
        >
          {[
            { value: '39%', label: t('stats.improvement'), description: t('stats.improvement_desc') },
            { value: '49%', label: t('stats.efficiency'), description: t('stats.efficiency_desc') },
            { value: '2.3x', label: t('stats.scalability'), description: t('stats.scalability_desc') }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="glass-card-modern p-8 text-center border border-green-500/30"
              variants={itemVariants}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <motion.div 
                className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">{stat.label}</h3>
              <p className="text-gray-400">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Process Section - Framer Seamless Integrations Style */}
        <motion.div 
          className="mb-20"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {t('process.title')}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                step: 'STEP 1', 
                title: t('process.step1.title'), 
                description: t('process.step1.desc'),
                icon: '🚀'
              },
              { 
                step: 'STEP 2', 
                title: t('process.step2.title'), 
                description: t('process.step2.desc'),
                icon: '⚙️'
              },
              { 
                step: 'STEP 3', 
                title: t('process.step3.title'), 
                description: t('process.step3.desc'),
                icon: '📈'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="glass-card-modern p-6 border-l-4 border-orange-500"
                variants={itemVariants}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.7 + index * 0.2 }}
                whileHover={{ x: 0, y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{step.icon}</span>
                  <span className="text-sm font-semibold text-orange-400 tracking-wider">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid - Adapted Framer Card Layout */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          variants={itemVariants}
        >
          {[
            {
              title: t('features.workflow.title'),
              description: t('features.workflow.desc'),
              icon: '🔄',
              color: 'from-green-500 to-teal-500'
            },
            {
              title: t('features.ai.title'),
              description: t('features.ai.desc'),
              icon: '🤖',
              color: 'from-teal-500 to-cyan-500'
            },
            {
              title: t('features.integration.title'),
              description: t('features.integration.desc'),
              icon: '🔗',
              color: 'from-orange-500 to-amber-500'
            },
            {
              title: t('features.performance.title'),
              description: t('features.performance.desc'),
              icon: '⚡',
              color: 'from-purple-500 to-pink-500'
            },
            {
              title: t('features.security.title'),
              description: t('features.security.desc'),
              icon: '🛡️',
              color: 'from-blue-500 to-indigo-500'
            },
            {
              title: t('features.scalability.title'),
              description: t('features.scalability.desc'),
              icon: '📊',
              color: 'from-emerald-500 to-green-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card-modern p-6 group hover:border-green-400/50 transition-all duration-300"
              variants={itemVariants}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.0 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section - Enhanced with user's visual preferences */}
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <motion.div
            className="glass-card-modern p-12 max-w-4xl mx-auto border border-gradient-to-r from-green-500/30 via-teal-500/30 to-orange-500/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 via-teal-400 to-orange-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.0 }}
            >
              {t('cta.title')}
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.2 }}
            >
              {t('cta.description')}
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.4 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-green-500 via-teal-500 to-orange-500 text-white font-bold rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 text-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                {t('cta.button')}
              </motion.button>
              
              <motion.button
                className="px-8 py-4 border-2 border-teal-400 text-teal-400 font-semibold rounded-full hover:bg-teal-400 hover:text-gray-900 transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('cta.learn_more')}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 blob-bg bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full animate-blob-morph" />
      <div className="absolute bottom-20 right-10 w-48 h-48 blob-bg bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full animate-blob-morph animation-delay-2000" />
      
      {/* Interactive grid dots */}
      <div className="absolute inset-0 interactive-grid opacity-20" />
    </motion.section>
  );
};

export default FramerIntegration;