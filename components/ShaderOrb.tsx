import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ShaderOrbProps {
  scale?: number;
}

const OrbMesh: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = 0;
    }
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0003;
      meshRef.current.rotation.y += 0.0005;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vTime;
    uniform float uTime;

    void main() {
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vTime = uTime;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vTime;

    float noise(vec3 p) {
      return sin(p.x * 10.0 + vTime) * sin(p.y * 10.0 + vTime) * sin(p.z * 10.0 + vTime);
    }

    void main() {
      vec3 normal = normalize(vNormal);
      
      // Create gradient based on position and time
      vec3 color1 = vec3(0.3, 0.1, 0.8);  // Purple
      vec3 color2 = vec3(0.1, 0.8, 0.8);  // Cyan
      vec3 color3 = vec3(0.8, 0.2, 0.6);  // Pink
      
      // Mix colors based on normal direction and time
      float t = sin(vTime * 0.3) * 0.5 + 0.5;
      vec3 grad = mix(color1, color2, t);
      grad = mix(grad, color3, sin(vTime * 0.2) * 0.5 + 0.5);
      
      // Add some sheen
      float fresnel = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 3.0);
      grad += fresnel * vec3(1.0, 1.0, 1.0) * 0.5;
      
      // Add noise for depth
      float n = noise(vPosition * 5.0) * 0.1;
      grad += n;
      
      gl_FragColor = vec4(grad, 0.9);
    }
  `;

  const uniforms = {
    uTime: { value: 0.0 },
  };

  return (
    <mesh ref={meshRef} scale={1.5}>
      <icosahedronGeometry args={[1, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};

const ShaderOrb: React.FC<ShaderOrbProps> = ({ scale = 1 }) => {
  return (
    <div className="w-full h-96 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-black to-slate-900 relative group shadow-2xl">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, 5]} intensity={0.8} color="#ff00ff" />
        <pointLight position={[0, 5, -10]} intensity={0.6} color="#00ffff" />

        <OrbMesh />

        <OrbitControls
          autoRotate
          autoRotateSpeed={2}
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
        />
      </Canvas>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Label */}
      <div className="absolute top-6 left-6 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
        <span className="text-xs font-bold uppercase tracking-widest text-white/80">
          3D Shader
        </span>
      </div>

      {/* Interactive hint */}
      <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-xs font-bold uppercase tracking-widest text-white/60">
          Drag to rotate
        </span>
      </div>
    </div>
  );
};

export default React.memo(ShaderOrb);
