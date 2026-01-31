import React from 'react';
import { motion } from 'framer-motion';

/**
 * Section Divider - Elegant transition between page sections
 * Adds visual hierarchy and pacing to the design
 */
interface SectionDividerProps {
  variant?: 'gradient' | 'dots' | 'lines';
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ 
  variant = 'gradient',
  className = ''
}) => {
  if (variant === 'dots') {
    return (
      <div className={`py-12 flex justify-center gap-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'lines') {
    return (
      <div className={`py-12 flex items-center justify-center gap-4 ${className}`}>
        <motion.div
          className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="w-2 h-2 rounded-full bg-indigo-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>
    );
  }

  // Default gradient variant
  return (
    <div className={`py-16 relative ${className}`}>
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      <motion.div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />
    </div>
  );
};

SectionDivider.displayName = 'SectionDivider';
