import type { Variants, Transition, TargetAndTransition } from 'framer-motion';
import { smooth, smoothOut, snap, bounce, springs, durations, staggers } from './easings';

/**
 * Animation variants for Framer Motion
 * All variants respect prefers-reduced-motion when used with useReducedMotion hook
 */

// ============================================================================
// Fade Animations
// ============================================================================

/** Fade in from bottom */
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: durations.normal,
      ease: smoothOut,
    },
  },
};

/** Fade in from top */
export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: durations.normal,
      ease: smoothOut,
    },
  },
};

/** Fade in from left */
export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -30 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: durations.normal,
      ease: smoothOut,
    },
  },
};

/** Fade in from right */
export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 30 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: durations.normal,
      ease: smoothOut,
    },
  },
};

/** Simple fade in */
export const fadeIn: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: durations.normal,
      ease: smooth,
    },
  },
};

/** Fade out */
export const fadeOut: Variants = {
  visible: { 
    opacity: 1 
  },
  hidden: { 
    opacity: 0,
    transition: {
      duration: durations.fast,
      ease: smooth,
    },
  },
};

// ============================================================================
// Scale Animations
// ============================================================================

/** Scale in from small */
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: snap,
    },
  },
};

/** Scale in with bounce */
export const scaleInBounce: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.5 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: bounce,
    },
  },
};

/** Scale out */
export const scaleOut: Variants = {
  visible: { 
    opacity: 1, 
    scale: 1 
  },
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    transition: {
      duration: durations.fast,
      ease: smooth,
    },
  },
};

/** Pop animation - scale with bounce */
export const pop: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springs.bouncy,
  },
};

// ============================================================================
// Slide Animations
// ============================================================================

/** Slide in from bottom */
export const slideIn: Variants = {
  hidden: { 
    y: '100%' 
  },
  visible: { 
    y: 0,
    transition: {
      duration: durations.slow,
      ease: smoothOut,
    },
  },
};

/** Slide in from left */
export const slideInLeft: Variants = {
  hidden: { 
    x: '-100%' 
  },
  visible: { 
    x: 0,
    transition: {
      duration: durations.slow,
      ease: smoothOut,
    },
  },
};

/** Slide in from right */
export const slideInRight: Variants = {
  hidden: { 
    x: '100%' 
  },
  visible: { 
    x: 0,
    transition: {
      duration: durations.slow,
      ease: smoothOut,
    },
  },
};

/** Slide out to bottom */
export const slideOut: Variants = {
  visible: { 
    y: 0 
  },
  hidden: { 
    y: '100%',
    transition: {
      duration: durations.normal,
      ease: smooth,
    },
  },
};

// ============================================================================
// Rotate Animations
// ============================================================================

/** Rotate in */
export const rotateIn: Variants = {
  hidden: { 
    opacity: 0, 
    rotate: -180, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    rotate: 0, 
    scale: 1,
    transition: springs.default,
  },
};

/** Flip in from X axis */
export const flipInX: Variants = {
  hidden: { 
    opacity: 0, 
    rotateX: -90 
  },
  visible: { 
    opacity: 1, 
    rotateX: 0,
    transition: {
      duration: durations.slow,
      ease: smoothOut,
    },
  },
};

/** Flip in from Y axis */
export const flipInY: Variants = {
  hidden: { 
    opacity: 0, 
    rotateY: -90 
  },
  visible: { 
    opacity: 1, 
    rotateY: 0,
    transition: {
      duration: durations.slow,
      ease: smoothOut,
    },
  },
};

// ============================================================================
// Special Animations
// ============================================================================

/** Pulse animation */
export const pulse: Variants = {
  initial: { 
    scale: 1 
  },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

/** Float animation - gentle up/down movement */
export const float: Variants = {
  initial: { 
    y: 0 
  },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

/** Shake animation - error feedback */
export const shake: Variants = {
  initial: { 
    x: 0 
  },
  animate: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

/** Glow animation - for emphasis */
export const glow: Variants = {
  initial: { 
    boxShadow: '0 0 0 rgba(255, 255, 255, 0)' 
  },
  animate: {
    boxShadow: [
      '0 0 0 rgba(255, 255, 255, 0)',
      '0 0 30px rgba(255, 255, 255, 0.3)',
      '0 0 0 rgba(255, 255, 255, 0)',
    ],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

// ============================================================================
// Container Variants (for staggering children)
// ============================================================================

interface StaggerContainerOptions {
  /** Delay between children animations */
  staggerChildren?: number;
  /** Delay before starting animation */
  delayChildren?: number;
  /** Stagger direction */
  staggerDirection?: 1 | -1;
}

/** Create a stagger container variant */
export function staggerContainer(
  options: StaggerContainerOptions = {}
): Variants {
  const {
    staggerChildren = staggers.normal,
    delayChildren = 0,
    staggerDirection = 1,
  } = options;

  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
        staggerDirection,
      },
    },
  };
}

/** Container that fades in with staggered children */
export const staggerFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggers.normal,
      delayChildren: 0.1,
    },
  },
};

/** Container with fast stagger */
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggers.fast,
    },
  },
};

/** Container with slow stagger */
export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggers.slow,
      delayChildren: 0.2,
    },
  },
};

// ============================================================================
// Reduced Motion Support
// ============================================================================

/** Creates reduced-motion safe variants
 * When reduced motion is preferred, animations will be instant
 */
export function createAccessibleVariants(
  variants: Variants,
  reducedMotion: boolean
): Variants {
  if (!reducedMotion) return variants;

  const accessibleVariants: Variants = {};
  
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value === 'object' && value !== null) {
      // Keep the final state, remove animations
      const { transition, ...rest } = value as TargetAndTransition;
      accessibleVariants[key] = {
        ...rest,
        transition: { duration: 0 },
      };
    } else {
      accessibleVariants[key] = value;
    }
  }

  return accessibleVariants;
}

/** Empty animation for reduced motion preference */
export const reducedMotionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { duration: 0 },
  },
};

// ============================================================================
// Page Transitions
// ============================================================================

/** Page transition - fade and slide up */
export const pageTransition: Variants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: durations.normal,
      ease: smoothOut,
    },
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: durations.fast,
      ease: smooth,
    },
  },
};

/** Page transition - scale and fade */
export const pageTransitionScale: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: snap,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 1.05,
    transition: {
      duration: durations.normal,
      ease: smooth,
    },
  },
};

// ============================================================================
// Hover Animations
// ============================================================================

/** Hover scale effect */
export const hoverScale: TargetAndTransition = {
  scale: 1.05,
  transition: springs.snappy,
};

/** Hover lift effect */
export const hoverLift: TargetAndTransition = {
  y: -5,
  transition: springs.snappy,
};

/** Hover glow effect */
export const hoverGlow: TargetAndTransition = {
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
  transition: { duration: durations.fast },
};

/** Tap scale effect */
export const tapScale: TargetAndTransition = {
  scale: 0.95,
};

// ============================================================================
// Export all easings for convenience
// ============================================================================

export { smooth, smoothOut, snap, bounce, springs, durations, staggers };
