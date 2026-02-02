import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

// Memoized style objects for performance
const WAVE_SVG_STYLE = { height: '50%' } as const;
const CLIP_PATH_TOP = { clipPath: 'inset(0 0 50% 0)' } as const;
const CLIP_PATH_BOTTOM = { clipPath: 'inset(50% 0 0 0)' } as const;
const PERSPECTIVE_CONTAINER_STYLE = { perspective: 1000 } as const;

/**
 * WaveBackground - Animated wave background with floating particles
 * Uses SVG for smooth wave animations
 */
export const WaveBackground: React.FC<{ className?: string }> = React.memo(({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Wave layers */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '50%' }}
        style={WAVE_SVG_STYLE}
      >
        <motion.path
          fill="rgba(99, 102, 241, 0.1)"
          d="M0,160L48,170.7C96,181,192,203,288,186.7C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,160L48,170.7C96,181,192,203,288,186.7C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,138.7C672,149,768,203,864,208C960,213,1056,171,1152,154.7C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,160L48,170.7C96,181,192,203,288,186.7C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,144C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          fill="rgba(168, 85, 247, 0.08)"
          d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,197.3C672,192,768,160,864,149.3C960,139,1056,149,1152,165.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,197.3C672,192,768,160,864,149.3C960,139,1056,149,1152,165.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,192L48,197.3C96,203,192,213,288,197.3C384,181,480,139,576,128C672,117,768,139,864,160C960,181,1056,203,1152,213.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,197.3C672,192,768,160,864,149.3C960,139,1056,149,1152,165.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${10 + (i * 7) % 80}%`,
            bottom: `${10 + (i * 11) % 40}%`,
            background: i % 2 === 0 
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
              : 'linear-gradient(135deg, #ec4899, #f472b6)',
            boxShadow: i % 2 === 0 
              ? '0 0 10px rgba(99, 102, 241, 0.6)'
              : '0 0 10px rgba(236, 72, 153, 0.6)',
          }}
          animate={{
            y: [-20, -60, -20],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
});

WaveBackground.displayName = 'WaveBackground';

/**
 * GlowCard - Glassmorphism card with dynamic glow effect on hover
 */
interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlowCard: React.FC<GlowCardProps> = React.memo(({ 
  children, 
  className = '',
  glowColor = 'rgba(99, 102, 241, 0.4)'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Dynamic glow effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: mousePosition.x - 100,
              top: mousePosition.y - 100,
              width: 200,
              height: 200,
              background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: isHovered 
            ? `0 0 30px ${glowColor}, inset 0 0 20px rgba(255, 255, 255, 0.05)`
            : '0 0 0px transparent',
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
});

GlowCard.displayName = 'GlowCard';

/**
 * MorphingBlob - Animated morphing blob background element
 */
interface MorphingBlobProps {
  color1?: string;
  color2?: string;
  size?: number;
  className?: string;
}

export const MorphingBlob: React.FC<MorphingBlobProps> = React.memo(({
  color1 = '#6366f1',
  color2 = '#ec4899',
  size = 400,
  className = '',
}) => {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        filter: 'blur(80px)',
        opacity: 0.3,
      }}
      animate={{
        borderRadius: [
          '60% 40% 30% 70% / 60% 30% 70% 40%',
          '30% 60% 70% 40% / 50% 60% 30% 60%',
          '50% 50% 20% 80% / 25% 80% 40% 50%',
          '60% 40% 30% 70% / 60% 30% 70% 40%',
        ],
        scale: [1, 1.1, 0.95, 1],
        rotate: [0, 90, 180, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
      aria-hidden="true"
    />
  );
});

MorphingBlob.displayName = 'MorphingBlob';

/**
 * AnimatedCounter - Number counting animation
 */
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = React.memo(({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const endValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // Easing function for smooth animation
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeOutExpo * endValue);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return (
    <div ref={ref} className={className}>
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
      >
        {prefix}{count}{suffix}
      </motion.span>
    </div>
  );
});

AnimatedCounter.displayName = 'AnimatedCounter';

/**
 * PulseButton - Button with animated pulse effect
 */
interface PulseButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const PulseButton: React.FC<PulseButtonProps> = React.memo(({
  children,
  onClick,
  className = '',
  variant = 'primary',
}) => {
  const isPrimary = variant === 'primary';
  
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`relative px-6 py-3 rounded-full font-medium text-sm overflow-hidden ${
        isPrimary 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
          : 'bg-white/10 text-white border border-white/20'
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse rings */}
      <motion.span
        className={`absolute inset-0 rounded-full ${
          isPrimary ? 'bg-indigo-400' : 'bg-white/20'
        }`}
        initial={{ scale: 1, opacity: 0 }}
        whileHover={{
          scale: [1, 1.5, 2],
          opacity: [0.5, 0.3, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
      
      {/* Shimmer effect */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
});

PulseButton.displayName = 'PulseButton';

/**
 * HolographicCard - 3D card with holographic/iridescent effect
 */
interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
}

export const HolographicCard: React.FC<HolographicCardProps> = React.memo(({
  children,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), springConfig);
  
  // Holographic gradient position based on mouse
  const gradientX = useTransform(x, [-100, 100], [0, 100]);
  const gradientY = useTransform(y, [-100, 100], [0, 100]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl bg-neutral-900/80 backdrop-blur-xl border border-white/10"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Holographic overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(
              135deg,
              rgba(255, 0, 128, 0.1) 0%,
              rgba(0, 255, 255, 0.1) 25%,
              rgba(255, 255, 0, 0.1) 50%,
              rgba(0, 255, 128, 0.1) 75%,
              rgba(255, 0, 255, 0.1) 100%
            )`,
            backgroundSize: '200% 200%',
            backgroundPosition: `${gradientX.get()}% ${gradientY.get()}%`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Rainbow shimmer */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            transform: 'skewX(-20deg)',
          }}
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 2,
          }}
        />

        {children}
      </motion.div>
    </motion.div>
  );
});

HolographicCard.displayName = 'HolographicCard';

/**
 * TypingText - Typewriter text effect
 */
interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypingText: React.FC<TypingTextProps> = React.memo(({
  text,
  speed = 50,
  className = '',
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsComplete(false);

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className={isComplete ? 'hidden' : 'inline-block'}
      >
        |
      </motion.span>
    </span>
  );
});

TypingText.displayName = 'TypingText';

/**
 * FloatingIcons - Floating animated icons around content
 */
interface FloatingIconsProps {
  icons: React.ReactNode[];
  className?: string;
}

export const FloatingIcons: React.FC<FloatingIconsProps> = React.memo(({
  icons,
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      {icons.map((icon, index) => {
        const angle = (index / icons.length) * Math.PI * 2;
        const radius = 120 + (index % 3) * 40;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={index}
            className="absolute left-1/2 top-1/2 w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/60"
            style={{ x, y }}
            animate={{
              y: [y - 10, y + 10, y - 10],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + index * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.3,
            }}
          >
            {icon}
          </motion.div>
        );
      })}
    </div>
  );
});

FloatingIcons.displayName = 'FloatingIcons';

/**
 * GlitchText - Text with glitch effect on hover
 */
interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = React.memo(({
  text,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10">{text}</span>
      
      {/* Glitch layers */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.span
              className="absolute top-0 left-0 text-cyan-400 opacity-70"
              initial={{ x: 0, opacity: 0 }}
              animate={{
                x: [-2, 2, -2, 0],
                opacity: [0.7, 0.5, 0.7, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, repeat: Infinity }}
              style={{ clipPath: 'inset(0 0 50% 0)' }}
              style={CLIP_PATH_TOP}
              aria-hidden="true"
            >
              {text}
            </motion.span>
            <motion.span
              className="absolute top-0 left-0 text-pink-500 opacity-70"
              initial={{ x: 0, opacity: 0 }}
              animate={{
                x: [2, -2, 2, 0],
                opacity: [0.7, 0.5, 0.7, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, repeat: Infinity }}
              style={{ clipPath: 'inset(50% 0 0 0)' }}
              style={CLIP_PATH_BOTTOM}
              aria-hidden="true"
            >
              {text}
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </motion.span>
  );
});

GlitchText.displayName = 'GlitchText';

/**
 * ParallaxSection - Section with parallax scrolling effect
 */
interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = React.memo(({
  children,
  className = '',
  speed = 0.5,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      setOffset(scrollProgress * speed * 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y: offset }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
});

ParallaxSection.displayName = 'ParallaxSection';

/**
 * OrbitingRings - Animated 3D orbiting rings effect
 */
interface OrbitingRingsProps {
  className?: string;
  size?: number;
}

export const OrbitingRings: React.FC<OrbitingRingsProps> = React.memo(({
  className = '',
  size = 200,
}) => {
  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: size, height: size, perspective: 1000 }}
      style={{ width: size, height: size, ...PERSPECTIVE_CONTAINER_STYLE }}
      aria-hidden="true"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: index === 0 ? 'rgba(99, 102, 241, 0.4)' : 
                        index === 1 ? 'rgba(168, 85, 247, 0.3)' : 
                        'rgba(236, 72, 153, 0.2)',
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateX: [60, 60, 60],
            rotateY: [0, 180, 360],
            rotateZ: index * 30,
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Center glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
});

OrbitingRings.displayName = 'OrbitingRings';

/**
 * NeonBorder - Animated neon border effect
 */
interface NeonBorderProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const NeonBorder: React.FC<NeonBorderProps> = React.memo(({
  children,
  className = '',
  color = '#6366f1',
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Animated border */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl"
        style={{
          background: `linear-gradient(90deg, ${color}, #ec4899, #22d3ee, ${color})`,
          backgroundSize: '300% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-[2px] rounded-2xl blur-md opacity-50"
        style={{
          background: `linear-gradient(90deg, ${color}, #ec4899, #22d3ee, ${color})`,
          backgroundSize: '300% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative bg-[#0a0a0a] rounded-2xl">
      <div className="relative bg-[#050505] rounded-2xl">
        {children}
      </div>
    </div>
  );
});

NeonBorder.displayName = 'NeonBorder';
