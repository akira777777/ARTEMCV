import React, { useCallback, useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Award, Code2, Users, Clock } from 'lucide-react';
import { useI18n } from '../i18n';
import { MagneticButton } from './MagneticButton';

// 3D Trophy Component
const Trophy3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 30 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * -15;
      const rotateYValue = ((e.clientX - centerX) / (rect.width / 2)) * 15;

      rotateX.set(rotateXValue);
      rotateY.set(rotateYValue);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [rotateX, rotateY]);

  return (
    <div
      ref={containerRef}
      className="relative w-64 h-80 mx-auto perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Trophy Base */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-b from-amber-600 to-amber-800 rounded-lg"
          style={{ transform: 'translateX(-50%) translateZ(20px)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg" />
        </div>

        {/* Trophy Stem */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-24 bg-gradient-to-b from-amber-500 to-amber-700"
          style={{
            transform: 'translateX(-50%) translateZ(20px)',
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
          }}
        />

        {/* Trophy Cup - Front */}
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 w-40 h-32"
          style={{ transform: 'translateX(-50%) translateZ(40px)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-t-full rounded-b-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-t-full rounded-b-3xl" />
            {/* Shine effect */}
            <div className="absolute top-4 left-4 w-8 h-16 bg-white/40 rounded-full blur-sm transform -rotate-12" />
          </div>

          {/* Handles */}
          <div
            className="absolute top-4 -left-6 w-8 h-16 border-4 border-amber-500 rounded-full"
            style={{ transform: 'translateZ(10px)' }}
          />
          <div
            className="absolute top-4 -right-6 w-8 h-16 border-4 border-amber-500 rounded-full"
            style={{ transform: 'translateZ(10px)' }}
          />
        </div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400 rounded-full"
            style={{
              left: `${20 + i * 12}%`,
              top: `${10 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}

        {/* Glow Effect */}
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl"
          style={{ transform: 'translateX(-50%) translateZ(-20px)' }}
        />
      </motion.div>

      {/* Shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-black/40 rounded-full blur-xl" />
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
  gradient: string;
}> = ({ icon, value, label, delay, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
    className={`relative group p-6 rounded-2xl bg-gradient-to-br ${gradient} border border-white/10 overflow-hidden`}
  >
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '16px 16px'
      }}
    />

    {/* Glow on hover */}
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Content */}
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      <motion.div
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2, type: "spring", stiffness: 200 }}
        className="text-3xl md:text-4xl font-display font-black text-white mb-1"
      >
        {value}
      </motion.div>

      <p className="text-sm text-white/50 font-medium">{label}</p>
    </div>

    {/* Corner Accents */}
    <div className="absolute top-0 right-0 w-16 h-px bg-gradient-to-l from-white/30 to-transparent" />
    <div className="absolute top-0 right-0 w-px h-16 bg-gradient-to-b from-white/30 to-transparent" />
  </motion.div>
);

export const CTASection: React.FC = React.memo(() => {
  const { t } = useI18n();

  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const stats = [
    {
      icon: <Code2 className="w-6 h-6 text-indigo-400" />,
      value: '50+',
      label: t('cta.stat.projects') || 'Projects Completed',
      gradient: 'from-indigo-500/10 to-blue-500/10'
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      value: '30+',
      label: t('cta.stat.clients') || 'Happy Clients',
      gradient: 'from-emerald-500/10 to-teal-500/10'
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      value: '8+',
      label: t('cta.stat.experience') || 'Years Experience',
      gradient: 'from-amber-500/10 to-orange-500/10'
    },
    {
      icon: <Award className="w-6 h-6 text-purple-400" />,
      value: '12',
      label: t('cta.stat.awards') || 'Awards',
      gradient: 'from-purple-500/10 to-pink-500/10'
    },
  ];

  return (
    <section
      className="py-32 px-6 relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Top Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 right-1/4 w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[150px]"
        />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-white/60 font-medium">{t('footer.available') || 'Available Q4 2026'}</span>
            </motion.div>

            <h2
              id="cta-heading"
              className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 tracking-tight leading-[1.1]"
            >
              {t('cta.title')}
            </h2>

            <p className="text-lg text-white/50 mb-10 max-w-lg leading-relaxed">
              {t('cta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <MagneticButton
                onClick={scrollToContact}
                strength={40}
                className="px-8 py-4 bg-gradient-to-r from-green-500 via-teal-500 to-orange-500 text-white font-bold rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 text-lg"
              >
                {t('cta.button')}
              </MagneticButton>

              <MagneticButton
                strength={20}
                className="px-8 py-4 border-2 border-teal-400 text-teal-400 font-semibold rounded-full hover:bg-teal-400 hover:text-gray-900 transition-all duration-300 hover:scale-105"
              >
                {t('cta.secondary')}
              </MagneticButton>
            </div>
          </motion.div>

          {/* Right Content - 3D Trophy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Trophy3D />

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
              viewport={{ once: true }}
              className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white font-bold text-sm shadow-lg"
            >
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                12 Awards
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              delay={0.5 + i * 0.1}
              gradient={stat.gradient}
            />
          ))}
        </motion.div>
      </div>

      {/* Bottom Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
});

CTASection.displayName = 'CTASection';
