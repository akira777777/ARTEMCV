import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedUnderlineProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  underlineColor?: string;
}

/**
 * AnimatedUnderline Component - Link with smooth animated underline effect
 * Uses SVG path for smooth wave-like underline animation
 */
export const AnimatedUnderline: React.FC<AnimatedUnderlineProps> = React.memo(
  ({
    href,
    children,
    className = '',
    target,
    rel,
    underlineColor = 'currentColor',
  }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const underlineRef = React.useRef<SVGPathElement>(null);

    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative inline-block group ${className}`}
      >
        <span className="relative z-10">{children}</span>

        {/* Animated underline */}
        <svg
          className="absolute left-0 bottom-[-2px] w-full h-1 pointer-events-none overflow-visible"
          viewBox="0 0 100 8"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <motion.path
            ref={underlineRef}
            d="M0,4 Q25,0 50,4 T100,4"
            stroke={underlineColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: isHovered ? 1 : 0,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{
              pathLength: { duration: 0.5, ease: 'easeInOut' },
              opacity: { duration: 0.3 },
            }}
          />
        </svg>

        {/* Solid fallback underline */}
        <motion.div
          className="absolute left-0 bottom-[-2px] h-0.5 bg-current opacity-30"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? '100%' : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </motion.a>
    );
  }
);

AnimatedUnderline.displayName = 'AnimatedUnderline';

/**
 * AnimatedButton Component - Button with animated underline on hover
 */
export const AnimatedButton: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}> = React.memo(({ href, children, className = '', target, rel }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex items-center gap-2 ${className}`}
    >
      <span className="relative z-10">{children}</span>

      {/* Animated underline */}
      <motion.div
        className="absolute left-0 bottom-0 h-px bg-gradient-to-r from-indigo-400 to-purple-500"
        initial={{ width: 0, x: 0 }}
        animate={{
          width: isHovered ? '100%' : 0,
          x: isHovered ? 0 : 0,
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />
    </motion.a>
  );
});

AnimatedButton.displayName = 'AnimatedButton';
