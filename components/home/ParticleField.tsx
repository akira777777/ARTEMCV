import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Constants for performance
const PARTICLE_COUNT = 1500; // Reduced from 5000 to improve performance
const ROTATION_SPEED_FACTOR = 0.001; // Slow rotation for performance
const POINT_SIZE = 0.004; // Slightly smaller points for performance

// Generate particle positions once and reuse
const generateParticlePositions = (): Float32Array => {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    
    // Generate spherical distribution
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 1.5 + Math.random() * 0.5; // Radius
    
    positions[i3] = r * Math.sin(phi) * Math.cos(theta);     // x
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
    positions[i3 + 2] = r * Math.cos(phi);                   // z
  }
  
  return positions;
};

// Memoized particle positions to prevent regeneration on each render
const PARTICLE_POSITIONS = generateParticlePositions();

// ParticleField component with performance optimizations
const ParticleField: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Use rotation values stored in a ref to avoid closure issues
  const rotationRef = useRef({ x: 0, y: 0 });
  
  // Use useFrame for efficient animation loop
  useFrame((_, delta) => {
    if (pointsRef.current) {
      // Update rotation values
      rotationRef.current.x -= delta * 0.5 * ROTATION_SPEED_FACTOR;
      rotationRef.current.y -= delta * 0.7 * ROTATION_SPEED_FACTOR;
      
      // Apply rotations
      pointsRef.current.rotation.x = rotationRef.current.x;
      pointsRef.current.rotation.y = rotationRef.current.y;
    }
  });

  // Memoize the material to prevent unnecessary re-renders
  const material = useMemo(() => (
    <PointMaterial
      transparent
      color="#6366f1"
      size={POINT_SIZE}
      sizeAttenuation={true}
      depthWrite={false}
      // Optimize rendering by reducing blending complexity
      blending={THREE.AdditiveBlending}
    />
  ), []);

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points 
        ref={pointsRef} 
        positions={PARTICLE_POSITIONS} 
        stride={3} 
        frustumCulled={false} // Disable frustum culling for consistent rendering
      >
        {material}
      </Points>
    </group>
  );
};

export default React.memo(ParticleField);