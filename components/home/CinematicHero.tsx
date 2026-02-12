import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Environment, Sparkles, useTexture, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
// Removed framer-motion-3d as it is not installed. Using native R3F refs for animation.
import { useMotionValue, useSpring } from 'framer-motion';

// --- Sub-components for cleaner structure ---

const HeroText = ({ text, position, size, color }: { text: string; position: [number, number, number]; size: number; color: string }) => {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame(({ clock, mouse }) => {
        if (mesh.current) {
            // Subtle parallax based on mouse
            // We can access the internal mesh of the Text component via ref if properly forwarded, 
            // but older versions might need a group wrapper. Text from drei usually forwards ref to the mesh.
            mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, position[0] + (mouse.x * 0.5), 0.1);
            mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, position[1] + (mouse.y * 0.5), 0.1);
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
                ref={mesh}
                position={position}
                fontSize={size}
                color={color}
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff" // Using Inter from Google Fonts
                anchorX="center"
                anchorY="middle"
                characters="abcdefghijklmnopqrstuvwxyz0123456789!"
            >
                {text}
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </Text>
        </Float>
    );
};

const OrganicSphere = ({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) => {
    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={1}>
            <mesh position={position}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    color={color}
                    envMapIntensity={1}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    metalness={0.1}
                    distort={0.4}
                    speed={speed}
                />
            </mesh>
        </Float>
    );
};

const Scene = () => {
    // Basic lighting setup
    return (
        <>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={1} color="purple" />

            <HeroText text="ARTEM" position={[0, 0.5, 0]} size={2.5} color="#ffffff" />
            <HeroText text="DEVELOPER & DESIGNER" position={[0, -1, 0]} size={0.5} color="#a855f7" />

            <OrganicSphere position={[-4, 0, -5]} color="#4f46e5" speed={2} />
            <OrganicSphere position={[4, -2, -6]} color="#ec4899" speed={3} />

            <Sparkles count={100} scale={10} size={4} speed={0.4} opacity={0.5} color="#ffffff" />
            <Environment preset="city" />
        </>
    );
};

const CinematicHero: React.FC = () => {
    return (
        <div className="relative w-full h-screen bg-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
                    <Scene />
                </Canvas>
            </div>

            {/* Overlay for accessibility or fallback content if needed */}
            <div className="absolute bottom-10 left-10 z-10 text-white opacity-50 text-sm">
                <p>Scroll to explore</p>
            </div>
        </div>
    );
};

export default CinematicHero;
