import type { Transition } from 'framer-motion';

/**
 * Custom easing functions for Framer Motion animations
 * These provide more polished and modern motion compared to default easings
 */

/**
 * Smooth easing - standard material design easing
 * Good for most UI transitions
 */
export const smooth = [0.4, 0, 0.2, 1] as const;

/**
 * Smooth out - deceleration curve
 * Good for elements entering the screen
 */
export const smoothOut = [0, 0, 0.2, 1] as const;

/**
 * Smooth in - acceleration curve
 * Good for elements exiting the screen
 */
export const smoothIn = [0.4, 0, 1, 1] as const;

/**
 * Bouncy easing - playful spring-like bounce
 * Good for attention-grabbing animations
 */
export const bounce = [0.68, -0.55, 0.265, 1.55] as const;

/**
 * Snap easing - quick snap to position
 * Good for snappy UI feedback
 */
export const snap = [0.16, 1, 0.3, 1] as const;

/**
 * Elastic easing - elastic overshoot
 * Good for playful interactions
 */
export const elastic = [0.68, -0.6, 0.32, 1.6] as const;

/**
 * Expo easing - exponential curve
 * Good for dramatic entrances
 */
export const expo = [0.16, 1, 0.3, 1] as const;

/**
 * Circ easing - circular curve
 * Good for natural deceleration
 */
export const circ = [0.075, 0.82, 0.165, 1] as const;

/**
 * Back easing - slight overshoot
 * Good for emphasizing elements
 */
export const back = [0.34, 1.56, 0.64, 1] as const;

/**
 * Spring configurations for physics-based animations
 */
export const springs = {
  /** Gentle spring - soft and subtle */
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
    mass: 1,
  } as Transition,

  /** Default spring - balanced feel */
  default: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
    mass: 1,
  } as Transition,

  /** Snappy spring - quick response */
  snappy: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
    mass: 0.8,
  } as Transition,

  /** Bouncy spring - playful bounce */
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
    mass: 0.8,
  } as Transition,

  /** Stiff spring - precise movement */
  stiff: {
    type: 'spring',
    stiffness: 500,
    damping: 30,
    mass: 1,
  } as Transition,

  /** Slow spring - dramatic entrance */
  slow: {
    type: 'spring',
    stiffness: 50,
    damping: 15,
    mass: 1.5,
  } as Transition,
} as const;

/**
 * Duration presets for consistent timing
 */
export const durations = {
  /** Instant - immediate feedback */
  instant: 0.1,
  /** Fast - quick transitions */
  fast: 0.15,
  /** Normal - standard transitions */
  normal: 0.3,
  /** Slow - emphasized transitions */
  slow: 0.5,
  /** Slower - dramatic transitions */
  slower: 0.8,
  /** Slowest - very dramatic transitions */
  slowest: 1.2,
} as const;

/**
 * Stagger presets for child animations
 */
export const staggers = {
  /** Fast stagger - quick cascade */
  fast: 0.05,
  /** Normal stagger - balanced cascade */
  normal: 0.1,
  /** Slow stagger - dramatic cascade */
  slow: 0.15,
  /** Slower stagger - very dramatic cascade */
  slower: 0.2,
} as const;

/**
 * Common transition presets combining easing and duration
 */
export const transitions = {
  /** Fade transition - opacity only */
  fade: {
    duration: durations.normal,
    ease: smooth,
  } as Transition,

  /** Scale transition - size changes */
  scale: {
    duration: durations.fast,
    ease: snap,
  } as Transition,

  /** Slide transition - position changes */
  slide: {
    duration: durations.normal,
    ease: smoothOut,
  } as Transition,

  /** Bounce transition - playful changes */
  bounce: {
    duration: durations.slow,
    ease: bounce,
  } as Transition,

  /** Snappy transition - quick feedback */
  snappy: {
    duration: durations.fast,
    ease: snap,
  } as Transition,
} as const;

// Type exports
export type Easing =
  | typeof smooth
  | typeof bounce
  | typeof snap
  | typeof elastic
  | typeof expo
  | typeof circ
  | typeof back;
export type SpringConfig = typeof springs.gentle;
export type Duration = typeof durations.normal;
export type StaggerDelay = typeof staggers.normal;
