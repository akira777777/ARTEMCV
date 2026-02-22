import React, { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Code2, Zap, Users, Award } from 'lucide-react';
import { useI18n } from '../../i18n';
import { Button } from '../ui/Button';
import { Heading, Text, GradientText } from '../ui/Typography';

/**
 * Unified Hero Component
 * Clean, minimal design with focused content
 */
export const HeroUnified: React.FC = () => {
  const { t } = useI18n();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);

  // Track mouse for subtle parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const stats = [
    { value: '50+', label: t('hero.stats.projects'), icon: Code2 },
    { value: '8+', label: t('hero.stats.experience'), icon: Zap },
    { value: '30+', label: t('hero.stats.clients'), icon: Users },
    { value: '12', label: t('hero.stats.awards'), icon: Award },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const scrollToWorks = () => {
    document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-32"
      aria-label="Hero section"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
            left: '10%',
            top: '20%',
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)',
            right: '15%',
            bottom: '10%',
            x: mousePosition.x * -0.3,
            y: mousePosition.y * -0.3,
          }}
        />

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-6"
        style={{ opacity, y }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="mb-6">
            <Heading
              as="h1"
              size="display"
              className="max-w-4xl mx-auto"
            >
              {t('hero.title.line1')}{' '}
              <GradientText animate>
                {t('hero.title.line2')}
              </GradientText>
            </Heading>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="mb-10">
            <Text
              size="lg"
              color="secondary"
              className="max-w-2xl mx-auto leading-relaxed"
            >
              {t('hero.description')}
            </Text>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={scrollToWorks}
            >
              {t('hero.cta.explore')}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={scrollToContact}
            >
              {t('hero.cta.contact')}
            </Button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  transition: { duration: 0.2 }
                }}
              >
                <stat.icon className="w-5 h-5 mx-auto mb-3 text-emerald-400/80" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-zinc-500"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-xs uppercase tracking-widest">{t('hero.cta.scroll')}</span>
          <div className="w-6 h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-emerald-500 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroUnified;
