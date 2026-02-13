import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Enhanced Animation Management Utilities
 * 
 * Advanced animation controls, performance optimization, and accessibility features.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string | number[];
  repeat?: number | boolean;
  repeatDelay?: number;
  yoyo?: boolean;
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
  visibility?: boolean;
  reduceMotion?: boolean;
}

export interface ScrollAnimationConfig extends AnimationConfig {
  trigger?: string | Element;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export interface ParallaxConfig extends AnimationConfig {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  amplitude?: number;
}

export interface StaggerConfig extends AnimationConfig {
  stagger?: number;
  from?: 'first' | 'last' | 'center' | 'edges';
  axis?: 'x' | 'y' | 'both';
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Advanced animation controls hook
 */
export function useAnimationControls(config: AnimationConfig = {}) {
  const {
    duration = 0.5,
    delay = 0,
    easing = 'easeInOut',
    repeat = 0,
    repeatDelay = 0,
    yoyo = false,
    stiffness = 100,
    damping = 10,
    mass = 1,
    velocity = 0,
    visibility = true,
    reduceMotion = false
  } = config;

  const controls = useAnimation();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness,
    damping,
    mass,
    velocity
  });

  const animateTo = useCallback(async (target: number, options: AnimationConfig = {}) => {
    if (reduceMotion) {
      motionValue.set(target);
      return;
    }

    const animationOptions = {
      duration: options.duration || duration,
      delay: options.delay || delay,
      easing: options.easing || easing,
      repeat: options.repeat !== undefined ? options.repeat : repeat,
      repeatDelay: options.repeatDelay || repeatDelay,
      yoyo: options.yoyo !== undefined ? options.yoyo : yoyo
    };

    await controls.start({
      opacity: target,
      transition: animationOptions
    });

    motionValue.set(target);
  }, [controls, motionValue, reduceMotion, duration, delay, easing, repeat, repeatDelay, yoyo]);

  const fadeIn = useCallback(async (options: AnimationConfig = {}) => {
    await animateTo(1, options);
  }, [animateTo]);

  const fadeOut = useCallback(async (options: AnimationConfig = {}) => {
    await animateTo(0, options);
  }, [animateTo]);

  const toggleVisibility = useCallback(async () => {
    const current = motionValue.get();
    await animateTo(current === 1 ? 0 : 1);
  }, [animateTo, motionValue]);

  const reset = useCallback(() => {
    motionValue.set(0);
    controls.stop();
  }, [motionValue, controls]);

  return {
    controls,
    motionValue,
    spring,
    animateTo,
    fadeIn,
    fadeOut,
    toggleVisibility,
    reset,
    isVisible: motionValue.get() === 1
  };
}

/**
 * Scroll-triggered animation hook
 */
export function useScrollAnimation(config: ScrollAnimationConfig = {}) {
  const {
    trigger,
    rootMargin = '0px',
    threshold = 0.1,
    once = true,
    ...animationConfig
  } = config;

  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const controls = useAnimation();
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const animateIn = useCallback(async () => {
    if (hasAnimated && once) return;

    await controls.start({
      opacity: 1,
      transform: 'translateY(0)',
      transition: {
        duration: animationConfig.duration || 0.6,
        ease: animationConfig.easing || 'easeOut'
      }
    });

    setHasAnimated(true);
  }, [controls, hasAnimated, once, animationConfig]);

  const animateOut = useCallback(async () => {
    await controls.start({
      opacity: 0,
      transform: 'translateY(20px)',
      transition: {
        duration: animationConfig.duration || 0.3,
        ease: animationConfig.easing || 'easeIn'
      }
    });
  }, [controls, animationConfig]);

  useEffect(() => {
    const element = elementRef.current || (typeof trigger === 'string' ? document.querySelector(trigger) : trigger);
    if (!element) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
          animateIn();
        } else if (!once) {
          setIsInView(false);
          animateOut();
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [trigger, rootMargin, threshold, once, animateIn, animateOut]);

  return {
    ref: elementRef,
    controls,
    isInView,
    hasAnimated,
    animateIn,
    animateOut
  };
}

/**
 * Parallax animation hook
 */
export function useParallax(config: ParallaxConfig = {}) {
  const {
    speed = 0.5,
    direction = 'up',
    amplitude = 100,
    ...animationConfig
  } = config;

  const motionValue = useMotionValue(0);
  const transform = useTransform(motionValue, [0, 1], [0, amplitude * speed]);

  const applyParallax = useCallback((scrollY: number) => {
    const parallaxValue = scrollY * speed;
    motionValue.set(parallaxValue);
  }, [motionValue, speed]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      applyParallax(scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [applyParallax]);

  const getStyle = useCallback(() => {
    switch (direction) {
      case 'up':
        return { transform: `translateY(${transform.get()}px)` };
      case 'down':
        return { transform: `translateY(-${transform.get()}px)` };
      case 'left':
        return { transform: `translateX(${transform.get()}px)` };
      case 'right':
        return { transform: `translateX(-${transform.get()}px)` };
      default:
        return { transform: `translateY(${transform.get()}px)` };
    }
  }, [direction, transform]);

  return {
    motionValue,
    transform,
    applyParallax,
    getStyle
  };
}

/**
 * Staggered animation hook for lists and grids
 */
export function useStaggerAnimation(config: StaggerConfig = {}) {
  const {
    stagger = 0.1,
    from = 'first',
    axis = 'y',
    ...animationConfig
  } = config;

  const controls = useAnimation();
  const itemsRef = useRef<HTMLElement[]>([]);

  const animateStagger = useCallback(async (direction: 'in' | 'out' = 'in') => {
    const items = itemsRef.current.filter(Boolean);
    if (items.length === 0) return;

    const targets = direction === 'in' 
      ? { opacity: 1, transform: 'translateY(0)' }
      : { opacity: 0, transform: 'translateY(20px)' };

    const baseDelay = animationConfig.delay || 0;
    const baseDuration = animationConfig.duration || 0.3;

    // Calculate stagger order based on 'from' option
    let orderedItems = items;
    switch (from) {
      case 'last':
        orderedItems = [...items].reverse();
        break;
      case 'center':
        const centerIndex = Math.floor(items.length / 2);
        orderedItems = [];
        orderedItems.push(items[centerIndex]);
        for (let i = 1; i <= centerIndex; i++) {
          if (centerIndex + i < items.length) orderedItems.push(items[centerIndex + i]);
          if (centerIndex - i >= 0) orderedItems.push(items[centerIndex - i]);
        }
        break;
      case 'edges':
        orderedItems = [];
        for (let i = 0; i < Math.ceil(items.length / 2); i++) {
          if (i < items.length) orderedItems.push(items[i]);
          if (items.length - 1 - i > i) orderedItems.push(items[items.length - 1 - i]);
        }
        break;
    }

    // Animate with stagger
    for (let i = 0; i < orderedItems.length; i++) {
      const item = orderedItems[i];
      await controls.start({
        ...targets,
        transition: {
          duration: baseDuration,
          delay: baseDelay + (i * stagger),
          ease: animationConfig.easing || 'easeOut'
        }
      }, { root: item });
    }
  }, [controls, animationConfig, stagger]);

  const addRef = useCallback((element: HTMLElement | null, index: number) => {
    if (element) {
      itemsRef.current[index] = element;
    }
  }, []);

  return {
    controls,
    addRef,
    animateStagger
  };
}

/**
 * Hover animation hook with spring physics
 */
export function useHoverAnimation(config: AnimationConfig = {}) {
  const {
    stiffness = 300,
    damping = 30,
    mass = 1
  } = config;

  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  const springScale = useSpring(scale, { stiffness, damping, mass });
  const springRotate = useSpring(rotate, { stiffness, damping, mass });

  const handleMouseEnter = useCallback(() => {
    scale.set(1.05);
    rotate.set(2);
  }, [scale, rotate]);

  const handleMouseLeave = useCallback(() => {
    scale.set(1);
    rotate.set(0);
  }, [scale, rotate]);

  const getStyle = useCallback(() => ({
    scale: springScale,
    rotate: springRotate
  }), [springScale, springRotate]);

  return {
    handleMouseEnter,
    handleMouseLeave,
    getStyle
  };
}

/**
 * Loading animation hook with customizable patterns
 */
export function useLoadingAnimation(pattern: 'spinner' | 'pulse' | 'wave' | 'dots' = 'spinner') {
  const controls = useAnimation();

  const startLoading = useCallback(async () => {
    switch (pattern) {
      case 'spinner':
        await controls.start({
          rotate: 360,
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }
        });
        break;
      case 'pulse':
        await controls.start({
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        });
        break;
      case 'wave':
        await controls.start({
          y: [-10, 10, -10],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        });
        break;
      case 'dots':
        await controls.start({
          y: [0, -5, 0, 5, 0],
          transition: {
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        });
        break;
    }
  }, [controls, pattern]);

  const stopLoading = useCallback(() => {
    controls.stop();
  }, [controls]);

  return {
    controls,
    startLoading,
    stopLoading
  };
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Animation utilities for common patterns
 */
export const animationUtils = {
  /**
   * Create fade animation variants
   */
  createFadeVariants: (direction: 'up' | 'down' | 'left' | 'right' = 'up', distance: number = 20) => {
    const translateMap = {
      up: { y: [distance, 0] },
      down: { y: [-distance, 0] },
      left: { x: [distance, 0] },
      right: { x: [-distance, 0] }
    };

    return {
      hidden: {
        opacity: 0,
        ...translateMap[direction]
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.6,
          ease: 'easeOut'
        }
      }
    };
  },

  /**
   * Create slide animation variants
   */
  createSlideVariants: (direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
    const translateMap = {
      up: { top: '-100%' },
      down: { top: '100%' },
      left: { left: '-100%' },
      right: { left: '100%' }
    };

    return {
      hidden: {
        ...translateMap[direction],
        opacity: 0
      },
      visible: {
        top: 0,
        left: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: 'easeOut'
        }
      }
    };
  },

  /**
   * Create scale animation variants
   */
  createScaleVariants: (from: number = 0.8, to: number = 1) => ({
    hidden: {
      scale: from,
      opacity: 0
    },
    visible: {
      scale: to,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  }),

  /**
   * Create stagger container variants
   */
  createStaggerContainer: (stagger: number = 0.1, delayChildren: number = 0.1) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren
      }
    }
  }),

  /**
   * Create stagger item variants
   */
  createStaggerItem: (delay: number = 0) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: 'easeOut'
      }
    }
  }),

  /**
   * Check if animations should be reduced
   */
  shouldReduceMotion: () => {
    if (typeof window === 'undefined') return false;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  },

  /**
   * Create motion-safe animation props
   */
  motionSafe: (props: any) => {
    if (animationUtils.shouldReduceMotion()) {
      return {
        initial: false,
        animate: false,
        transition: { duration: 0 }
      };
    }
    return props;
  },

  /**
   * Create accessible animation wrapper
   */
  createAccessibleAnimation: (Component: React.ComponentType<any>, description: string) => {
    return function AccessibleAnimation(props: any) {
      const shouldReduce = animationUtils.shouldReduceMotion();

      if (shouldReduce) {
        return React.createElement(Component, {
          ...props,
          'aria-label': description,
          style: { animation: 'none' }
        });
      }

      return React.createElement(motion.div, {
        ...props,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 },
        'aria-label': description
      });
    };
  }
};

/**
 * Performance-optimized animation components
 */
export const OptimizedAnimations = {
  /**
   * Lazy-loaded motion component
   */
  LazyMotion: motion.div,

  /**
   * Performance-optimized animated div
   */
  AnimatedDiv: motion.div,

  /**
   * Performance-optimized animated section
   */
  AnimatedSection: motion.section,

  /**
   * Performance-optimized animated button
   */
  AnimatedButton: motion.button,

  /**
   * Performance-optimized animated link
   */
  AnimatedLink: motion.a
};

export default {
  useAnimationControls,
  useScrollAnimation,
  useParallax,
  useStaggerAnimation,
  useHoverAnimation,
  useLoadingAnimation,
  animationUtils,
  OptimizedAnimations
};