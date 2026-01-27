import React from 'react';
import { motion } from 'framer-motion';

const Cone3D: React.FC = () => {
  return (
    <motion.div
      className="absolute w-full h-full overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      style={{
        perspective: '1200px',
      }}
    >
      {/* Cone container */}
      <div
        className="absolute inset-0"
        style={{
          width: '2500px',
          left: 'calc(50% - 2500px/2)',
          top: '7.45%',
          bottom: '39.36%',
        }}
      >
        {/* Cone mesh with gradient */}
        <motion.div
          className="absolute inset-0"
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Main cone surface */}
          <div
            className="absolute inset-0"
            style={{
              left: '-1.05%',
              right: '0.56%',
              top: '-0.22%',
              bottom: '-0.28%',
              background: `
                radial-gradient(circle at 30% 20%, rgba(32, 155, 88, 0.8), transparent 40%),
                radial-gradient(circle at 70% 70%, rgba(16, 185, 129, 0.5), transparent 50%),
                linear-gradient(135deg, rgba(32, 155, 88, 0.6) 0%, rgba(16, 185, 129, 0.3) 100%)
              `,
              boxShadow: `
                0 0 60px rgba(32, 155, 88, 0.4),
                inset 0 0 40px rgba(255, 255, 255, 0.2)
              `,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            }}
          />

          {/* Highlight layer */}
          <div
            className="absolute inset-0"
            style={{
              left: '-1.05%',
              right: '0.56%',
              top: '-0.22%',
              bottom: '-0.28%',
              background: 'radial-gradient(circle at 20% 15%, rgba(255, 255, 255, 0.4), transparent 35%)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Shadow base */}
          <div
            className="absolute"
            style={{
              width: '2500px',
              left: 'calc(50% - 2500px/2 - 20.12px)',
              top: '-0.22%',
              bottom: '-0.28%',
              background: '#209B58',
              mixBlendMode: 'hard-light',
              opacity: 0.3,
            }}
          />
        </motion.div>
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(32, 155, 88, 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </motion.div>
  );
};

export default React.memo(Cone3D);
