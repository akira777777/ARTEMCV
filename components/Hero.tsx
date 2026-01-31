import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code2, Palette, Zap, Users } from 'lucide-react';
import { useI18n } from '../i18n';
import { ServicesGrid } from './ServicesGrid';

interface MousePosition {
  x: number;
  y: number;
}

const Hero: React.FC = () => {
  const { t } = useI18n();
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Spring physics for smooth cursor tracking
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  
  // Transform cursor position for parallax effect
  const parallaxX = useTransform(cursorX, [-100, 100], [-20, 20]);
  const parallaxY = useTransform(cursorY, [-100, 100], [-20, 20]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Normalize mouse position to -100 to 100 range
    const x = ((clientX / innerWidth) * 200) - 100;
    const y = ((clientY / innerHeight) * 200) - 100;
    
    cursorX.set(x);
    cursorY.set(y);
  }, [cursorX, cursorY]);

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-6"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-radial from-green-500/20 to-transparent blur-3xl"
          style={{
            x: parallaxX,
            y: parallaxY,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-radial from-teal-500/20 to-transparent blur-3xl"
          style={{
            x: parallaxX,
            y: parallaxY,
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-radial from-orange-500/15 to-transparent blur-2xl"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 bg-gradient-to-r from-green-400 via-teal-400 to-orange-400 bg-clip-text text-transparent"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            JULES ENGINEER
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Full Stack Developer & Designer
          </motion.p>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Engineering high-performance web applications where motion meets scalability. 
            Focused on React 19 and resilient architecture.
          </motion.p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <motion.button
            onClick={scrollToServices}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 neon-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('hero.cta.primary')}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          
          <motion.a
            href="https://github.com/akira777777"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 border-teal-400 text-teal-400 font-semibold rounded-full hover:bg-teal-400 hover:text-gray-900 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Code2 className="w-5 h-5" />
            View GitHub
          </motion.a>
        </motion.div>

        {/* Stats section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {[
            { value: '3+', label: 'Years Experience', icon: <Zap className="w-6 h-6" /> },
            { value: '50+', label: 'Projects Completed', icon: <Palette className="w-6 h-6" /> },
            { value: '20+', label: 'Happy Clients', icon: <Users className="w-6 h-6" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="glass-card-modern p-6 text-center border border-green-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div className="text-3xl font-bold mb-2 text-green-400 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <motion.div
          className="w-8 h-12 border-2 border-gray-400 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Letter animation component for name
const AnimatedLetter: React.FC<{ 
  letter: string; 
  index: number;
}> = ({ letter, index }) => {
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
        color: '#8b5cf6',
        textShadow: '0 0 40px rgba(139, 92, 246, 0.8)',
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
            background: letter === 'R' ? '#f59e0b' : '#0ea5e9',
            boxShadow: `0 0 15px ${letter === 'R' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(14, 165, 233, 0.8)'}`,
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
          border: '2px solid rgba(139, 92, 246, 0.8)',
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
  const [scrollY, setScrollY] = useState(0);

  // Track scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    });
  }, []);

  const scrollToWorks = useCallback(() => {
    document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Generate floating particles
  const particles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 15,
      size: Math.random() * 8 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
    })),
    []
  );

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden pt-28 pb-40"
      aria-label="Hero section"
    >
      {/* Scroll Progress Bar */}
      <div 
        className="scroll-progress" 
        style={{ width: `${Math.min(scrollY / (document.body.scrollHeight - window.innerHeight) * 100, 100)}%` }}
      />

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden="true">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.12)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_70%,rgba(139,92,246,0.1)_0%,transparent_50%)]" />
        
        {/* Interactive Grid */}
        <div className="interactive-grid" />
        
        {/* Floating Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, 
                ${particle.id % 4 === 0 ? '#0EA5E9' : particle.id % 4 === 1 ? '#10B981' : particle.id % 4 === 2 ? '#F59E0B' : '#8B5CF6'}, 
                transparent)`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: [-20, -window.innerHeight - 20]
            }}
            transition={{
              duration: 15,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
        
        {/* Blob Background Elements */}
        <motion.div
          className="blob-bg"
          style={{
            width: '400px',
            height: '400px',
            background: 'linear-gradient(45deg, #0EA5E9, #10B981)',
            top: '10%',
            left: '5%',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="blob-bg"
          style={{
            width: '300px',
            height: '300px',
            background: 'linear-gradient(45deg, #F59E0B, #8B5CF6)',
            bottom: '15%',
            right: '8%',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Holographic Abstract Sphere with Parallax */}
      <motion.div
        className="holo-abstract-sphere top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        aria-hidden="true"
        style={{
          y: scrollY * 0.3
        }}
      />

      {/* Main Typography with 3D Tilt Effect */}
      <div className="z-10 relative w-full max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div 
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-xs tracking-widest font-bold text-primary-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span 
                className="text-primary-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                ✦
              </motion.span>
              {t('hero.badge')}
            </motion.div>
              
            <motion.div 
              className="flex items-center justify-center lg:justify-start mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-4xl md:text-6xl font-display font-bold mr-4 gradient-text" aria-hidden="true">∞</span>
            </motion.div>
              
            <motion.h1 
              className="text-[11vw] sm:text-[9vw] lg:text-[6.5rem] leading-[0.9] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-primary-300 select-none uppercase"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              JULES
            </motion.h1>
              
            <motion.p 
              className="mt-4 text-lg md:text-xl text-white font-medium tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {t('hero.title.line1')} & {t('hero.stat.uiux')}
            </motion.p>
              
            <motion.p 
              className="mt-3 text-sm md:text-base text-gray-400 max-w-2xl mx-auto lg:mx-0 font-light tracking-wide leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {t('hero.desc')}
            </motion.p>

            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.button
                type="button"
                onClick={scrollToWorks}
                className="neon-button px-7 py-3 rounded-full text-xs font-bold tracking-widest interactive-element"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={t('hero.cta.portfolio')}
              >
                {t('hero.cta.portfolio')}
              </motion.button>
              <motion.button
                type="button"
                onClick={scrollToContact}
                className="px-7 py-3 rounded-full border border-primary/30 text-primary-300 text-xs font-bold tracking-widest hover:bg-primary/10 ease-smooth interactive-element"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={t('hero.cta.contact')}
              >
                {t('hero.cta.contact')}
              </motion.button>
            </motion.div>

            <motion.div 
              className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              {[t('hero.label.brand'), t('hero.label.web'), t('hero.label.motion'), t('hero.label.design')].map((label, index) => (
                <motion.span 
                  key={label} 
                  className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Stats Card with 3D Effect */}
          <motion.div 
            className="card-3d relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 }}
          >
            <div className="card-3d-inner glass-card-modern rounded-3xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="text-xs uppercase tracking-widest text-primary-400">{t('hero.stat.backend')}</div>
                <div className="text-xs text-primary-500">{t('hero.stat.ai')}</div>
              </div>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center justify-between rounded-2xl border border-primary/20 bg-black/40 px-4 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-xs text-primary-300">{t('hero.stat.projects')}</span>
                  <motion.span 
                    className="text-lg font-black text-primary-400"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    50+
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between rounded-2xl border border-secondary/20 bg-black/40 px-4 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-xs text-secondary-300">{t('hero.stat.clients')}</span>
                  <motion.span 
                    className="text-lg font-black text-secondary-400"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    30+
                  </motion.span>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between rounded-2xl border border-accent/20 bg-black/40 px-4 py-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-xs text-accent-300">{t('hero.stat.experience')}</span>
                  <motion.span 
                    className="text-lg font-black text-accent-400"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    3+
                  </motion.span>
                </motion.div>
              </div>
              <motion.div 
                className="mt-6 text-xs text-primary-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                {t('hero.stat.nps')}: <span className="text-primary-400 font-bold">98</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <aside className="w-full max-w-4xl px-6 mb-16 mt-16" aria-label="Statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { icon: Code2, value: '50+', label: t('hero.stat.projects'), color: 'text-primary-400', delay: 0 },
            { icon: Users, value: '30+', label: t('hero.stat.clients'), color: 'text-secondary-400', delay: 0.1 },
            { icon: Zap, value: '3+', label: t('hero.stat.experience'), color: 'text-accent-400', delay: 0.2 },
            { icon: Palette, value: '100%', label: t('hero.stat.satisfaction'), color: 'text-supporting-400', delay: 0.3 },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-4 rounded-xl glass-card-modern border border-primary/20 hover:border-secondary/50 transition-all group cursor-pointer"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.5 + stat.delay, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 30px rgba(14, 165, 233, 0.3)',
                borderColor: 'rgba(16, 185, 129, 0.5)',
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
              <div className="text-xs text-gray-500 tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </aside>

      {/* Interactive Elements Section */}
      <motion.div
        className="relative w-full max-w-6xl py-12 space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <Suspense fallback={<div className="h-24 w-full" aria-label="Loading interactive text..." />}>
          <ParticleText text="INTERACTIVE EXPERIENCE" />
        </Suspense>
        <ServicesGrid />
      </motion.div>

      <motion.button
        type="button"
        onClick={scrollToWorks}
        aria-label="Scroll down to explore projects"
        className="fixed bottom-8 right-10 hidden md:flex items-center gap-4 text-xs font-bold tracking-widest text-gray-500 hover:text-white transition-colors group z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('hero.cta.scroll')} <ArrowRight className="w-4 h-4 animate-bounce group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </motion.button>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;