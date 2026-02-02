import React from 'react';
import { motion } from 'framer-motion';

/**
 * Section Divider - Elegant transition between page sections
 * Adds visual hierarchy and pacing to the design
 */
interface SectionDividerProps {
  variant?: 'gradient' | 'dots' | 'lines' | 'wave' | 'particles' | 'glitch' | 'diamond' | 'pulse';
  className?: string;
}

  variant?: 'gradient' | 'dots' | 'lines' | 'wave' | 'particles' | 'glitch' | 'diamond' | 'pulse';
  className?: string;
}

// Memoized style objects for performance
const CENTER_ELEMENT_STYLE = { transform: 'rotate(45deg)' } as const;
const CENTER_DOT_STYLE = { boxShadow: '0 0 15px rgba(99, 102, 241, 0.6)' } as const;

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

  // Wave variant - animated SVG wave
  if (variant === 'wave') {
    return (
      <div className={`py-8 relative overflow-hidden ${className}`} aria-hidden="true">
        <svg
          className="w-full h-16"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <motion.path
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30"
            animate={{
              d: [
                "M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30",
                "M0,30 C240,0 480,60 720,30 C960,0 1200,60 1440,30",
                "M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="70%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Particles variant - floating particles
  if (variant === 'particles') {
    return (
      <div className={`py-12 relative flex justify-center items-center ${className}`} aria-hidden="true">
        <div className="relative w-full max-w-lg h-8 flex items-center justify-center">
          {/* Center line */}
          <motion.div
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1 }}
          />
          
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: `${12.5 * i + 6}%`,
                background: i % 2 === 0 
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                  : 'linear-gradient(135deg, #ec4899, #f472b6)',
                boxShadow: i % 2 === 0 
                  ? '0 0 8px rgba(99, 102, 241, 0.6)'
                  : '0 0 8px rgba(236, 72, 153, 0.6)',
              }}
              animate={{
                y: [-8, 8, -8],
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Glitch variant - glitchy line effect
  if (variant === 'glitch') {
    return (
      <div className={`py-12 relative ${className}`} aria-hidden="true">
        <div className="relative h-4 flex items-center justify-center overflow-hidden">
          {/* Main line */}
          <motion.div
            className="absolute w-1/2 h-px bg-white/30"
            animate={{
              scaleX: [1, 1.2, 0.8, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 }}
          />
          
          {/* Glitch lines */}
          <motion.div
            className="absolute w-1/3 h-px bg-cyan-400/60"
            animate={{
              x: [-100, 100],
              opacity: [0, 0.6, 0],
            }}
            transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.div
            className="absolute w-1/4 h-px bg-pink-500/60"
            animate={{
              x: [100, -100],
              opacity: [0, 0.6, 0],
            }}
            transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2.5, delay: 0.5 }}
          />
          
          {/* Center element */}
          <motion.div
            className="relative w-3 h-3 bg-white/10 border border-white/20"
            style={{ transform: 'rotate(45deg)' }}
            style={CENTER_ELEMENT_STYLE}
            animate={{
              scale: [1, 1.2, 1],
              borderColor: ['rgba(255,255,255,0.2)', 'rgba(99,102,241,0.5)', 'rgba(255,255,255,0.2)'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

  // Diamond variant - rotating diamond with orbiting dots
  if (variant === 'diamond') {
    return (
      <div className={`py-16 relative flex justify-center items-center ${className}`} aria-hidden="true">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Center diamond */}
          <motion.div
            className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg"
            style={{ 
              transform: 'rotate(45deg)',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
            }}
            animate={{
              rotate: [45, 135, 225, 315, 405],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Orbiting dots */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
              style={{
                boxShadow: '0 0 10px rgba(236, 72, 153, 0.6)',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.5,
              }}
              initial={{
                x: Math.cos((i * Math.PI) / 2) * 40,
                y: Math.sin((i * Math.PI) / 2) * 40,
              }}
            />
          ))}
          
          {/* Connecting lines */}
          <motion.div
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    );
  }

  // Pulse variant - expanding rings
  if (variant === 'pulse') {
    return (
      <div className={`py-12 relative flex justify-center items-center ${className}`} aria-hidden="true">
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Pulse rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-indigo-500/30"
              style={{ width: 20 + i * 20, height: 20 + i * 20 }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}
          
          {/* Center dot */}
          <motion.div
            className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            style={{ boxShadow: '0 0 15px rgba(99, 102, 241, 0.6)' }}
            style={CENTER_DOT_STYLE}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
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
