import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Simple car model component
const CarModel = ({ color = "#3b82f6", rotationSpeed = 0 }: { color?: string; rotationSpeed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  // Create a simple car geometry as a placeholder until we load a proper model
  return (
    <group>
      {/* Car body */}
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Car top */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[1.5, 0.6, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[-0.8, 0.3, 0.6]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.8, 0.3, 0.6]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[-0.8, 0.3, -0.6]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.8, 0.3, -0.6]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
};

const CarScene = ({ selectedColor, rotationSpeed }: { selectedColor: string; rotationSpeed: number }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <CarModel color={selectedColor} rotationSpeed={rotationSpeed} />
      <OrbitControls enableZoom={true} enablePan={false} />
    </>
  );
};

const CarConfigurator = ({ selectedColor, rotationSpeed, onColorChange }: { selectedColor: string; rotationSpeed: number; onColorChange?: (color: string) => void }) => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [localRotationSpeed, setLocalRotationSpeed] = useState(rotationSpeed);

  // Update local state when props change
  React.useEffect(() => {
    setLocalRotationSpeed(rotationSpeed);
  }, [rotationSpeed]);

  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#ffffff' },
  ];

  return (
    <div className="w-full h-96 relative">
      <Canvas 
              shadows 
              camera={{ 
                position: [5, 2, 5] as const, // Typed tuple for camera position
                fov: 50 
              }}
              gl={{ 
                // WebGL performance optimizations
                antialias: true,
                alpha: false,
                stencil: false,
                depth: true,
                preserveDrawingBuffer: false // Better performance, no need to preserve buffer
              }}
              frameloop="always" // Continuous rendering for smooth animation
              dpr={globalThis.devicePixelRatio || 1} // Explicit device pixel ratio
            >
        <CarScene selectedColor={selectedColor} rotationSpeed={autoRotate ? localRotationSpeed : 0} />
      </Canvas>
      
      {/* Controls overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => onColorChange && onColorChange(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color.value ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="rotation-speed">Auto-rotate:</label>
              <input
                type="range"
                id="rotation-speed"
                min="0"
                max="2"
                step="0.1"
                value={localRotationSpeed}
                onChange={(e) => setLocalRotationSpeed(parseFloat(e.target.value))}
                className="w-24"
              />
              <span>{localRotationSpeed.toFixed(1)}</span>
            </div>
            
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1 rounded ${
                autoRotate ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              {autoRotate ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarConfigurator;