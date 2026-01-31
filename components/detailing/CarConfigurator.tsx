import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, TorusKnot, Environment, ContactShadows, OrbitControls } from '@react-three/drei';

function Model() {
  const meshRef = useRef<any>();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t / 2) / 2;
      meshRef.current.position.y = Math.sin(t) / 4;
    }
  });

  return (
    <group>
      <TorusKnot ref={meshRef} args={[1, 0.3, 128, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.8} />
      </TorusKnot>
      <ContactShadows opacity={0.5} scale={10} blur={1} far={10} resolution={256} color="#000000" />
    </group>
  );
}

const CarConfigurator: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Environment preset="city" />
        <Model />
        <OrbitControls enableZoom={false} />
      </Canvas>

      {/* Overlay UI from design */}
      <div className="absolute inset-0 z-20 pointer-events-none container mx-auto px-6">
        <div className="absolute top-[35%] left-[25%] animate-pulse flex items-center gap-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_0_4px_rgba(59,130,246,0.3)]"></div>
          <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-lg border border-blue-500/30">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-500">Paint Protection</p>
            <p className="text-sm text-white/80">Ceramic coating visualization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarConfigurator;
