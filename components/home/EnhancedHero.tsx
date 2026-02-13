import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Environment, Sparkles, MeshDistortMaterial, Float as DreiFloat } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../i18n';

// Animated 3D Text Component
const AnimatedText = ({ text, position, size, color, delay = 0 }: { 
  text: string; 
  position: [number, number, number]; 
  size: number; 
  color: string;
  delay?: number;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock, mouse }) => {
    if (mesh.current) {
      // Parallax effect based on mouse
      mesh.current.position.x = THREE.MathUtils.lerp(
        mesh.current.position.x, 
        position[0] + (mouse.x * 0.3), 
        0.05
      );
      mesh.current.position.y = THREE.MathUtils.lerp(
        mesh.current.position.y, 
        position[1] + (mouse.y * 0.2), 
        0.05
      );
      
      // Gentle rotation
      mesh.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5 + delay) * 0.1;
    }
  });

  return (
    <DreiFloat speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Text
        ref={mesh}
        position={position}
        fontSize={size}
        color={hovered ? '#a855f7' : color}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        anchorX="center"
        anchorY="middle"
        characters="abcdefghijklmnopqrstuvwxyz0123456789!"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {text}
        <meshStandardMaterial
          color={hovered ? '#a855f7' : color}
          emissive={hovered ? '#a855f7' : color}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          toneMapped={false}
        />
      </Text>
    </DreiFloat>
  );
};

// Organic animated sphere
const OrganicSphere = ({ 
  position, 
  color, 
  speed,
  scale = 1 
}: { 
  position: [number, number, number]; 
  color: string; 
  speed: number;
  scale?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <DreiFloat speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.1}
          roughness={0.2}
          distort={0.4}
          speed={speed}
        />
      </mesh>
    </DreiFloat>
  );
};

// Particle field background
const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Random colors between purple and pink
      colors[i * 3] = 0.4 + Math.random() * 0.4;
      colors[i * 3 + 1] = 0.2 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
    }
    
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

// Main 3D Scene
const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#a855f7" />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ec4899" />

      <AnimatedText text="ARTEM" position={[0, 0.5, 0]} size={3} color="#ffffff" delay={0} />
      <AnimatedText text="DEVELOPER" position={[0, -1.2, 0]} size={0.8} color="#a855f7" delay={0.5} />
      <AnimatedText text="& DESIGNER" position={[0, -2, 0]} size={0.6} color="#ec4899" delay={1} />

      <OrganicSphere position={[-4, 1, -5]} color="#4f46e5" speed={2} scale={0.8} />
      <OrganicSphere position={[4, -1, -6]} color="#ec4899" speed={3} scale={0.6} />
      <OrganicSphere position={[0, 2, -8]} color="#a855f7" speed={1.5} scale={1} />

      <ParticleField />
      <Sparkles count={150} scale={15} size={3} speed={0.4} opacity={0.6} color="#ffffff" />
      <Environment preset="city" />
    </>
  );
};

// Scroll-based content
const ScrollContent = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, 50]);

  return (
    <motion.div 
      className="absolute bottom-20 left-0 right-0 flex flex-col items-center justify-center z-10"
      style={{ opacity, y }}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p className="text-white/60 text-sm tracking-[0.3em] uppercase">
          Scroll to explore
        </p>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Main Component
const EnhancedHero: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 50 }} 
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      {/* Scroll indicator */}
      <ScrollContent />

      {/* Noise overlay for texture */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default EnhancedHero;
</content>
<task_progress>
- [x] Улучшить BentoGrid анимации (stagger, hover эффекты)
- [x] Добавить интерактивные 3D-tilt карточки
- [x] Улучшить переходы страниц
- [x] Добавить scroll-triggered анимации
- [x] Добавить параллакс эффекты
- [x] Улучшить CinematicHero
- [x] Анимировать навигацию
- [x] Создать новые Framer Motion компоненты
