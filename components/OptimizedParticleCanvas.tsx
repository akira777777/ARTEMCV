import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleField from './home/ParticleField';

// Memoized canvas wrapper to prevent unnecessary re-renders
const OptimizedParticleCanvas: React.FC = () => {
  // Memoize canvas props to prevent re-creation
  const canvasProps = useMemo(() => ({
    camera: { position: [0, 0, 3] },
    gl: { 
      alpha: true,
      antialias: false, // Disable antialiasing for better performance
      powerPreference: "high-performance" // Prioritize performance over quality
    },
    dpr: [1, 1.5], // Limit device pixel ratio to improve performance
    linear: true, // Disable color management for performance
    flat: true,   // Use flat shading for performance
  }), []);

  return (
    <Canvas {...canvasProps}>
      <ParticleField />
    </Canvas>
  );
};

export default OptimizedParticleCanvas;