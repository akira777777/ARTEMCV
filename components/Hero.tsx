import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code2, Palette, Zap, Users } from 'lucide-react';
import { useI18n } from '../i18n';
import { ParticleText } from './InteractiveElements';
import { ServicesGrid } from './ServicesGrid';

// Floating orbs that follow cursor
const FloatingOrb: React.FC<{ 
  delay: number; 
  size: number; 
  color: string;
  mouseX: number;
  mouseY: number;
}> = ({ delay, size, color, mouseX, mouseY }) => {
  const springConfig = { stiffness: 100 - delay * 10, damping: 20 };
  const x = useSpring(mouseX * (0.3 - delay * 0.05), springConfig);
  const y = useSpring(mouseY * (0.3 - delay * 0.05), springConfig);

  useEffect(() => {
    x.set(mouseX * (0.3 - delay * 0.05));
    y.set(mouseY * (0.3 - delay * 0.05));
  }, [mouseX, mouseY, x, y, delay]);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        x,
        y,
        filter: 'blur(1px)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.6, 1, 0.6],
        scale: [1, 1.2, 1],
      }}
      transition={{
        opacity: { duration: 2, repeat: Infinity, delay: delay * 0.3 },
        scale: { duration: 3, repeat: Infinity, delay: delay * 0.3 },
      }}
    />
  );
};

// Letter animation component for ARTEM
const AnimatedLetter: React.FC<{ 
  letter: string; 
  index: number;
  mouseX: number;
  mouseY: number;
}> = ({ letter, index, mouseX, mouseY }) => {
  const baseDelay = index * 0.1;
  
  return (
    <motion.span
      className="inline-block relative"
      initial={{ opacity: 0, y: 100, rotateX: -90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.8,
        delay: baseDelay,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.1,
        color: '#a855f7',
        textShadow: '0 0 40px rgba(168, 85, 247, 0.8)',
        transition: { duration: 0.2 },
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {letter}
      {/* Dot decoration for specific letters */}
      {(letter === 'R' || letter === 'E') && (
        <motion.span
          className="absolute -top-2 -right-1 w-3 h-3 rounded-full"
          style={{
            background: letter === 'R' ? '#ec4899' : '#22d3ee',
            boxShadow: `0 0 15px ${letter === 'R' ? 'rgba(236, 72, 153, 0.8)' : 'rgba(34, 211, 238, 0.8)'}`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
        />
      )}
    </motion.span>
  );
};

// Custom cursor component
const CustomCursor: React.FC<{ mouseX: number; mouseY: number }> = ({ mouseX, mouseY }) => {
  const springConfig = { stiffness: 500, damping: 28 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '2px solid rgba(168, 85, 247, 0.8)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)',
        }}
      />
    </>
  );
};

export const Hero: React.FC = React.memo(() => {
  const { t } = useI18n();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  }, []);

  const scrollToWorks = () => {
    document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
  };

<<<<<<< Updated upstream
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
=======
  const name = 'ARTEM';
  const orbColors = [
    'linear-gradient(135deg, #ec4899, #f472b6)', // pink
    'linear-gradient(135deg, #22d3ee, #67e8f9)', // cyan
    'linear-gradient(135deg, #a855f7, #c084fc)', // purple
    'linear-gradient(135deg, #3b82f6, #60a5fa)', // blue
    'linear-gradient(135deg, #10b981, #34d399)', // green
  ];
>>>>>>> Stashed changes

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden pt-28 pb-40 cursor-none"
      aria-label="Hero section"
    >
      {/* Custom Cursor */}
      <AnimatePresence>
        {isHovering && (
          <CustomCursor mouseX={mousePosition.x + (containerRef.current?.getBoundingClientRect().left ?? 0) + (containerRef.current?.getBoundingClientRect().width ?? 0) / 2} mouseY={mousePosition.y + (containerRef.current?.getBoundingClientRect().top ?? 0) + (containerRef.current?.getBoundingClientRect().height ?? 0) / 2} />
        )}
      </AnimatePresence>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" aria-hidden="true" />
      
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      {/* Decorative Purple Star */}
      <div className="hero-purple-star" aria-hidden="true" />
=======
      {/* Holographic Abstract Sphere */}
      <div className="holo-abstract-sphere top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" aria-hidden="true" />
>>>>>>> Stashed changes
=======
      {/* Holographic Abstract Sphere */}
      <div className="holo-abstract-sphere top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" aria-hidden="true" />
>>>>>>> Stashed changes

      {/* Main Typography */}
      <div className="z-10 relative w-full max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest font-bold text-neutral-300 mb-6">
              <span className="text-indigo-300">✦</span>
              {t('hero.badge')}
            </div>
            <div className="flex items-center justify-center lg:justify-start mb-4">
              <span className="text-4xl md:text-6xl font-display font-bold mr-4 animate-pulse" aria-hidden="true">∞</span>
            </div>
            <h1 className="text-[11vw] sm:text-[9vw] lg:text-[6.5rem] leading-[0.9] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 select-none uppercase">
              JULES
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white font-medium tracking-wide">
              {t('hero.title.line1')} & {t('hero.stat.uiux')}
            </p>
            <p className="mt-3 text-sm md:text-base text-neutral-400 max-w-2xl mx-auto lg:mx-0 font-light tracking-wide leading-relaxed">
              {t('hero.desc')}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                type="button"
                onClick={scrollToWorks}
                className="px-7 py-3 rounded-full bg-white text-black text-xs font-bold tracking-widest hover:bg-neutral-200 transition-colors"
                aria-label={t('hero.cta.portfolio')}
              >
                {t('hero.cta.portfolio')}
              </button>
              <button
                type="button"
                onClick={scrollToContact}
                className="px-7 py-3 rounded-full border border-white/20 text-white text-xs font-bold tracking-widest hover:bg-white/10 transition-colors"
                aria-label={t('hero.cta.contact')}
              >
                {t('hero.cta.contact')}
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start">
              {[t('hero.label.brand'), t('hero.label.web'), t('hero.label.motion'), t('hero.label.design')].map((label) => (
                <span key={label} className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-neutral-300">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-transparent blur-2xl" aria-hidden="true" />
            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="text-xs uppercase tracking-widest text-neutral-400">{t('hero.stat.backend')}</div>
                <div className="text-xs text-neutral-500">{t('hero.stat.ai')}</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <span className="text-xs text-neutral-400">{t('hero.stat.projects')}</span>
                  <span className="text-lg font-black text-white">50+</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <span className="text-xs text-neutral-400">{t('hero.stat.clients')}</span>
                  <span className="text-lg font-black text-white">30+</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <span className="text-xs text-neutral-400">{t('hero.stat.experience')}</span>
                  <span className="text-lg font-black text-white">3+</span>
                </div>
              </div>
              <div className="mt-6 text-xs text-neutral-500">
                {t('hero.stat.nps')}: <span className="text-white font-bold">98</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <aside className="w-full max-w-4xl px-6 mb-16" aria-label="Statistics">
=======
      {/* Animated gradient mesh background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
        }}
        animate={{
          background: [
            'radial-gradient(circle at 30% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Decorative Purple Star */}
      <motion.div 
        className="absolute pointer-events-none"
        style={{
          width: '1275px',
          height: '1275px',
          aspectRatio: '1 / 1',
          backgroundImage: 'url(/purple-star1.svg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          top: '-400px',
          right: '-400px',
        }}
        initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
        animate={{ 
          opacity: 0.4, 
          rotate: 360,
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          opacity: { duration: 2 },
          rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
        aria-hidden="true"
      />

      {/* Floating Orbs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {orbColors.map((color, i) => (
          <FloatingOrb
            key={i}
            delay={i}
            size={12 + i * 4}
            color={color}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
          />
        ))}
      </div>

      {/* Main Typography */}
      <motion.div 
        className="z-10 text-center mb-12 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Infinity symbol with glow */}
        <motion.div 
          className="flex items-center justify-center mb-4"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <motion.span 
            className="text-4xl md:text-6xl font-display font-bold mr-4"
            animate={{
              textShadow: [
                '0 0 20px rgba(168, 85, 247, 0.5)',
                '0 0 40px rgba(168, 85, 247, 0.8)',
                '0 0 20px rgba(168, 85, 247, 0.5)',
              ],
              color: ['#a855f7', '#ec4899', '#a855f7'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            aria-hidden="true"
          >
            ∞
          </motion.span>
        </motion.div>

        {/* Animated ARTEM text */}
        <h1 
          className="text-[12vw] leading-[0.85] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 select-none uppercase"
          style={{ perspective: '1000px' }}
        >
          {name.split('').map((letter, index) => (
            <AnimatedLetter 
              key={index} 
              letter={letter} 
              index={index}
              mouseX={mousePosition.x}
              mouseY={mousePosition.y}
            />
          ))}
          {/* Mikhailov subtitle that reveals */}
          <motion.span
            className="block text-[4vw] tracking-widest text-neutral-500 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            MIKHAILOV
          </motion.span>
        </h1>

        <motion.p 
          className="mt-6 text-lg md:text-xl text-white font-medium tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {t('hero.title.line1')} & {t('hero.stat.uiux')}
        </motion.p>
        <motion.p 
          className="mt-4 text-neutral-400 max-w-lg mx-auto text-sm md:text-base font-light tracking-wide leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {t('hero.desc')}
        </motion.p>
      </motion.div>

      {/* Stats Section with staggered animation */}
      <motion.div 
        className="w-full max-w-4xl px-6 mb-16" 
        role="complementary" 
        aria-label="Statistics"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
>>>>>>> Stashed changes
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { icon: Code2, value: '50+', label: t('hero.stat.projects'), color: 'text-indigo-400', delay: 0 },
            { icon: Users, value: '30+', label: t('hero.stat.clients'), color: 'text-emerald-400', delay: 0.1 },
            { icon: Zap, value: '3+', label: t('hero.stat.experience'), color: 'text-yellow-400', delay: 0.2 },
            { icon: Palette, value: '100%', label: t('hero.stat.satisfaction'), color: 'text-pink-400', delay: 0.3 },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all group cursor-pointer"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.5 + stat.delay, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
                borderColor: 'rgba(168, 85, 247, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color} group-hover:scale-110 transition-transform`} aria-hidden="true" />
              <motion.div 
                className="text-2xl md:text-3xl font-black text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 + stat.delay }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs text-neutral-500 tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
<<<<<<< Updated upstream
      </aside>
=======
      </motion.div>
>>>>>>> Stashed changes

      {/* Interactive Elements Section */}
      <motion.div 
        className="relative w-full max-w-6xl py-12 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <ParticleText text="INTERACTIVE EXPERIENCE" />
        <ServicesGrid />
      </motion.div>

      <motion.button
        type="button"
        onClick={scrollToWorks}
        aria-label="Scroll down to explore projects"
        className="fixed bottom-8 right-10 hidden md:flex items-center gap-4 text-xs font-bold tracking-widest text-neutral-500 hover:text-white transition-colors group z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ cursor: 'none' }}
      >
        {t('hero.cta.scroll')} <ArrowRight className="w-4 h-4 animate-bounce group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </motion.button>
    </section>
  );
});

Hero.displayName = 'Hero';
