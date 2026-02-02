import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HolographicCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverIntensity?: number;
}

/**
 * HolographicCard - A futuristic card with holographic effects and interactive lighting
 * Features:
 * - Dynamic lighting based on mouse position
 * - Holographic shimmer effect
 * - Depth perception with 3D transforms
 * - Responsive glow intensity
 */
export const HolographicCard: React.FC<HolographicCardProps> = React.memo(({
  title,
  description,
  children,
  className = '',
  glowColor = 'from-indigo-500/20 via-purple-500/20 to-pink-500/20',
  hoverIntensity = 1.1
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative group overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Dynamic light spot based on mouse position */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.4), transparent 80%)`
        }}
      />

      {/* Holographic gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${glowColor} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: `linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: isHovered ? ['0% 0%', '200% 0%'] : '0% 0%',
          }}
          transition={{
            duration: isHovered ? 1.5 : 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Glow effect */}
      <motion.div 
        className={`absolute -inset-0.5 bg-gradient-to-r ${glowColor} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500`}
        initial={{ scale: 0.95 }}
        animate={{ scale: isHovered ? hoverIntensity : 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Inner content */}
      <div className="relative z-10 p-8">
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
          {title}
        </h3>
        <p className="text-neutral-300 mb-6 group-hover:text-white transition-colors">
          {description}
        </p>
        
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}

        {/* Corner accents */}
        <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-indigo-400/30 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-purple-400/30 rounded-bl-lg" />
      </div>
    </motion.div>
  );
});

HolographicCard.displayName = 'HolographicCard';