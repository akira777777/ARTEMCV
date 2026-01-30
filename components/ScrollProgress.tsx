import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useReducedMotion } from '../lib/hooks';

const ScrollProgress: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #ec4899)',
        backgroundSize: '200% 100%',
      }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 blur-sm"
        style={{
          background: 'inherit',
          opacity: 0.6,
        }}
      />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          backgroundSize: '50% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '200% 0%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
};

export default React.memo(ScrollProgress);
