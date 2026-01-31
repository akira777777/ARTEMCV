import { Variants, Transition } from 'framer-motion';

// Spring configs
export const SPRING_SMOOTH: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 15,
  mass: 0.5,
};

export const SPRING_BOUNCY: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 20,
};

export const SPRING_SNAPPY: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
};

// Fade animations
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 24 },
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

// Scale animations
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const popIn: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: SPRING_BOUNCY,
  },
  exit: { opacity: 0, scale: 0.8 },
};

// Stagger containers
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Letter animation for text reveal
export const letterVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200,
    },
  },
};

export const wordVariants: Variants = {
  initial: { opacity: 0, y: 30, rotateX: -90 },
  animate: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
    },
  },
};

// 3D tilt hover
export const tilt3D: Variants = {
  initial: { rotateX: 0, rotateY: 0 },
  hover: { 
    rotateX: -5, 
    rotateY: 10,
    transition: SPRING_SMOOTH,
  },
};

// Glow pulse
export const glowPulse: Variants = {
  initial: { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)' },
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(99, 102, 241, 0.2)',
      '0 0 0 20px rgba(99, 102, 241, 0)',
      '0 0 0 0 rgba(99, 102, 241, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1,
    },
  },
};

// Floating animation
export const floating: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Shimmer effect
export const shimmer: Variants = {
  initial: { backgroundPosition: '-200% 0' },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Viewport settings
export const viewportOnce = { once: true, margin: '-80px' };
export const viewportAlways = { once: false, margin: '-40px' };

// Duration presets
export const duration = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  verySlow: 1,
};

// Easing presets
export const easing = {
  smooth: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  sharp: [0.4, 0, 0.6, 1],
};

// Blur animation
export const blurIn: Variants = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(10px)' },
};

// Rotate animations
export const rotateIn: Variants = {
  initial: { opacity: 0, rotate: -180, scale: 0 },
  animate: { 
    opacity: 1, 
    rotate: 0, 
    scale: 1,
    transition: SPRING_BOUNCY,
  },
  exit: { opacity: 0, rotate: 180, scale: 0 },
};

// Flip animation
export const flipX: Variants = {
  initial: { opacity: 0, rotateX: 90 },
  animate: { 
    opacity: 1, 
    rotateX: 0,
    transition: SPRING_SMOOTH,
  },
  exit: { opacity: 0, rotateX: -90 },
};

export const flipY: Variants = {
  initial: { opacity: 0, rotateY: 90 },
  animate: { 
    opacity: 1, 
    rotateY: 0,
    transition: SPRING_SMOOTH,
  },
  exit: { opacity: 0, rotateY: -90 },
};

// Elastic scale
export const elasticScale: Variants = {
  initial: { scale: 0 },
  animate: { 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 10,
    },
  },
  exit: { scale: 0 },
};

// Slide animations
export const slideInFromBottom: Variants = {
  initial: { y: '100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '100%', opacity: 0 },
};

export const slideInFromTop: Variants = {
  initial: { y: '-100%', opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: '-100%', opacity: 0 },
};

// Morph animation for SVG paths
export const morphPath: Variants = {
  initial: { pathLength: 0 },
  animate: { 
    pathLength: 1,
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
};

// Pulse glow animation
export const pulseGlow: Variants = {
  initial: { 
    boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)',
  },
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(99, 102, 241, 0.4)',
      '0 0 0 15px rgba(99, 102, 241, 0)',
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

// Rainbow border animation
export const rainbowBorder: Variants = {
  initial: { backgroundPosition: '0% 50%' },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Hover lift effect
export const hoverLift: Variants = {
  initial: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  hover: { 
    y: -8, 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    transition: SPRING_SMOOTH,
  },
};

// Card tilt on hover
export const cardTilt: Variants = {
  initial: { 
    rotateX: 0, 
    rotateY: 0,
    transformPerspective: 1000,
  },
  hover: (custom: { x: number; y: number }) => ({
    rotateX: custom?.y || 0,
    rotateY: custom?.x || 0,
    transition: { duration: 0.3 },
  }),
};

// Text reveal character by character
export const charReveal: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};
