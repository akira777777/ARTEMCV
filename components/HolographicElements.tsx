import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className = "",
  intensity = 1
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      {/* Base card */}
      <div className="glass-card-modern relative z-10">
        {children}
      </div>
      
      {/* Holographic overlay */}
      <div className="holo-shine absolute inset-0 rounded-2xl" />
      
      {/* Prismatic reflection */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(16, 185, 129, 0.1) 0%,
              rgba(6, 182, 212, 0.1) 25%,
              rgba(245, 158, 11, 0.1) 50%,
              rgba(16, 185, 129, 0.1) 75%,
              rgba(6, 182, 212, 0.1) 100%
            )
          `,
          mixBlendMode: 'overlay',
          opacity: 0.3
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
};

interface FloatingOrbsProps {
  count?: number;
  className?: string;
}

export const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
  count = 8,
  className = ""
}) => {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
    color: i % 3 === 0 ? '#10B981' : i % 3 === 1 ? '#06B6D4' : '#F59E0B'
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {orbs.map(orb => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, ${orb.color}80, transparent)`,
            filter: 'blur(2px)'
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(orb.id) * 20, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

interface GradientWaveProps {
  className?: string;
  height?: string;
}

export const GradientWave: React.FC<GradientWaveProps> = ({
  className = "",
  height = "h-32"
}) => {
  return (
    <div className={`relative overflow-hidden ${height} ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              90deg,
              transparent 0%,
              rgba(16, 185, 129, 0.3) 25%,
              rgba(6, 182, 212, 0.3) 50%,
              rgba(245, 158, 11, 0.3) 75%,
              transparent 100%
            )
          `,
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              90deg,
              transparent 0%,
              rgba(245, 158, 11, 0.2) 30%,
              rgba(16, 185, 129, 0.2) 70%,
              transparent 100%
            )
          `,
        }}
        animate={{
          x: ['-150%', '150%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
          delay: 1
        }}
      />
    </div>
  );
};

interface MorphingShapeProps {
  className?: string;
  size?: number;
}

export const MorphingShape: React.FC<MorphingShapeProps> = ({
  className = "",
  size = 200
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
      }}
      animate={{
        borderRadius: [
          '30% 70% 70% 30% / 30% 30% 70% 70%',
          '70% 30% 50% 50% / 60% 40% 60% 40%',
          '50% 50% 30% 70% / 70% 30% 70% 30%',
          '30% 70% 30% 70% / 50% 50% 50% 50%',
          '30% 70% 70% 30% / 30% 30% 70% 70%'
        ],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div 
        className="w-full h-full"
        style={{
          background: `
            linear-gradient(45deg, 
              #10B981 0%, 
              #06B6D4 25%, 
              #F59E0B 50%, 
              #10B981 75%, 
              #06B6D4 100%
            )
          `,
          filter: 'blur(20px)',
          opacity: 0.4
        }}
      />
    </motion.div>
  );
};