import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence, LayoutGroup } from 'framer-motion';
import React, { useRef, useState, useEffect, CSSProperties } from 'react';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Stagger container for list animations
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

/**
 * Fade up animation variant
 */
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};

/**
 * Fade down animation variant
 */
export const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};

/**
 * Fade left animation variant
 */
export const fadeLeft = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};

/**
 * Fade right animation variant
 */
export const fadeRight = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};

/**
 * Scale up animation variant
 */
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};

/**
 * Blur reveal animation variant
 */
export const blurReveal = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5
    }
  }
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook for scroll-triggered animations
 */
export function useScrollAnimation(options: {
  threshold?: number;
  rootMargin?: string;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return { ref, isInView };
}

/**
 * Hook for parallax scroll effect
 */
export function useParallax(value: any, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

/**
 * Hook for magnetic effect on elements
 */
export function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) * strength;
    const y = (e.clientY - centerY) * strength;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return { ref, position, handleMouseMove, handleMouseLeave };
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Animated card with tilt effect
 */
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  tilt = true,
  glow = true,
  onClick
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || !tilt) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
        boxShadow: glow
          ? `0 ${20 + Math.abs(rotate.x)}px ${40 + Math.abs(rotate.y)}px rgba(99, 102, 241, ${0.1 + Math.abs(rotate.x) / 100})`
          : '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Magnetic button that follows cursor
 */
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  strength = 0.3
}) => {
  const { ref, position, handleMouseMove, handleMouseLeave } = useMagnetic(strength);

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  );
};

/**
 * Scroll-triggered reveal animation
 */
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.5
}) => {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.1 });

  const getVariants = () => {
    switch (direction) {
      case 'up': return fadeUp;
      case 'down': return fadeDown;
      case 'left': return fadeLeft;
      case 'right': return fadeRight;
      default: return fadeUp;
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
      variants={{
        ...getVariants(),
        show: {
          ...getVariants().show.transition,
          delay
        }
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Parallax scroll section
 */
interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  speed = 0.5
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <motion.div ref={ref} className={className} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
};

/**
 * Animated list with stagger effect
 */
interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  className = '',
  delay = 0.1
}) => {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={fadeUp}
          custom={{ delay: delay * index }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

/**
 * Glowing button with animation
 */
interface GlowButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  color?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  className = '',
  onClick,
  color = '#6366f1'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`relative px-6 py-3 rounded-xl font-bold overflow-hidden ${className}`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        style={{
          background: `radial-gradient(circle at center, ${color}40 0%, transparent 70%)`
        }}
      />
      <motion.span
        className="absolute inset-0"
        animate={{
          boxShadow: isHovered
            ? `0 0 20px ${color}80, 0 0 40px ${color}40, 0 0 60px ${color}20`
            : 'none'
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

/**
 * Animated underline for links
 */
interface AnimatedUnderlineProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export const AnimatedUnderline: React.FC<AnimatedUnderlineProps> = ({
  children,
  className = '',
  color = '#6366f1'
}) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      whileHover="hover"
    >
      {children}
      <motion.span
        className="absolute left-0 bottom-0 w-full h-[2px]"
        style={{ backgroundColor: color }}
        initial={{ scaleX: 0 }}
        variants={{
          hover: { scaleX: 1 }
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </motion.span>
  );
};

/**
 * Animated gradient background
 */
interface AnimatedGradientProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

export const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  className = '',
  colors = ['#6366f1', '#8b5cf6', '#ec4899', '#6366f1'],
  speed = 5
}) => {
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      style={{
        background: `linear-gradient(-45deg, ${colors.join(', ')})`,
        backgroundSize: '400% 400%'
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '100% 100%', '0% 100%', '0% 50%']
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        repeatType: 'reverse'
      }}
    />
  );
};

/**
 * Floating animation wrapper
 */
interface FloatingProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  speed?: number;
}

export const Floating: React.FC<FloatingProps> = ({
  children,
  className = '',
  amplitude = 10,
  speed = 3
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0]
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Progress indicator with spring animation
 */
interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  color = '#6366f1'
}) => {
  const scaleX = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    scaleX.set(progress / 100);
  }, [progress, scaleX]);

  return (
    <div className={`h-1 bg-white/10 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX,
          backgroundColor: color
        }}
      />
    </div>
  );
};

/**
 * Shake animation component
 */
interface ShakeProps {
  children: React.ReactNode;
  className?: string;
  trigger: boolean;
}

export const Shake: React.FC<ShakeProps> = ({
  children,
  className = '',
  trigger
}) => {
  return (
    <motion.div
      className={className}
      animate={trigger ? {
        x: [-10, 10, -10, 10, -5, 5, -2, 2, 0]
      } : { x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Bounce animation component
 */
interface BounceProps {
  children: React.ReactNode;
  className?: string;
  trigger?: boolean;
}

export const Bounce: React.FC<BounceProps> = ({
  children,
  className = '',
  trigger = true
}) => {
  return (
    <motion.div
      className={className}
      animate={trigger ? {
        scale: [1, 1.1, 0.9, 1.05, 0.95, 1]
      } : {}}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

/**
 * Page transition variants
 */
export const pageTransition = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

/**
 * Blur page transition
 */
export const blurTransition = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.4 }
  },
  exit: {
    opacity: 0,
    filter: 'blur(10px)',
    transition: { duration: 0.2 }
  }
};

/**
 * Slide page transition
 */
export const slideTransition = {
  initial: { opacity: 0, x: -100 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.2 }
  }
};

export default {
  staggerContainer,
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  scaleUp,
  blurReveal,
  useScrollAnimation,
  useParallax,
  useMagnetic,
  AnimatedCard,
  MagneticButton,
  Reveal,
  ParallaxSection,
  StaggeredList,
  GlowButton,
  AnimatedUnderline,
  AnimatedGradient,
  Floating,
  ProgressBar,
  Shake,
  Bounce,
  pageTransition,
  blurTransition,
  slideTransition
};
