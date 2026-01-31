import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleField from './home/ParticleField';

// Memoized canvas wrapper to prevent unnecessary re-renders
const OptimizedParticleCanvas: React.FC = () => {
  // Memoize canvas props to prevent re-creation
  const canvasProps = useMemo(() => ({
    camera: { position: [0, 0, 3] as [number, number, number] },
    gl: { 
      alpha: true,
      antialias: false // Disable antialiasing for better performance
    },
    dpr: [1, 1.5] as [number, number], // Limit device pixel ratio to improve performance
  }), []);

  return (
    <Canvas {...canvasProps}>
      <ParticleField />
    </Canvas>
  );
};

export default OptimizedParticleCanvas;