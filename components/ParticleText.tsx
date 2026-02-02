import React from 'react';
import { motion } from 'framer-motion';

interface ParticleTextProps {
  text: string;
}

export const ParticleText: React.FC<ParticleTextProps> = ({ text }) => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/60"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      <motion.h2 
        className="text-4xl md:text-6xl font-display font-black text-center relative z-10 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {text}
      </motion.h2>
    </div>
  );
};

export default ParticleText;