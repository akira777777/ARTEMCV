/**
 * @deprecated This component is not imported anywhere.
 * TODO: Consider integrating into UI or remove in next cleanup.
 */
import React, { useRef, useState, useCallback, ReactNode } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useReducedMotion } from '../lib/hooks';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: 'button' | 'a';
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const SPRING_CONFIG = { damping: 15, stiffness: 150, mass: 0.1 };

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.4,
  as = 'button',
  href,
  onClick,
  target,
  rel,
  type = 'button',
  disabled = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotion || disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * strength);
    y.set(distanceY * strength);
  }, [prefersReducedMotion, disabled, strength, x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const motionProps = {
    ref: ref as React.RefObject<HTMLButtonElement>,
    className: `magnetic-button ${className}`,
    style: {
      x: springX,
      y: springY,
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    whileTap: { scale: 0.97 },
  };

  if (as === 'a') {
    return (
      <motion.a
        {...motionProps}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
      >
        <motion.span
          className="magnetic-button-content inline-flex items-center gap-2"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {children}
        </motion.span>
        
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-indigo-500/20 blur-xl -z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.2 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.a>
    );
  }

  return (
    <motion.button
      {...motionProps}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      <motion.span
        className="magnetic-button-content inline-flex items-center gap-2"
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.span>
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 via-sky-500/20 to-indigo-500/20 blur-xl -z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.2 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default React.memo(MagneticButton);
