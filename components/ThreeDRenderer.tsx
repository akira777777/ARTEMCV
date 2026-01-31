import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

interface ThreeDSceneProps {
  className?: string;
  autoRotate?: boolean;
  enableControls?: boolean;
}

export const AdvancedThreeDScene: React.FC<ThreeDSceneProps> = ({
  className = '',
  autoRotate = true,
  enableControls = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.Fog(0x020617, 10, 50);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    // renderer.outputEncoding = THREE.sRGBEncoding; // Deprecated in newer Three.js
    
    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Main directional light (Green accent)
    const mainLight = new THREE.DirectionalLight(0x10b981, 1.5);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);

    // Secondary light (Cyan accent)
    const secondaryLight = new THREE.DirectionalLight(0x06b6d4, 0.8);
    secondaryLight.position.set(-5, 8, -5);
    scene.add(secondaryLight);

    // Rim light (Orange accent)
    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.6);
    rimLight.position.set(0, -5, -10);
    scene.add(rimLight);

    // Point lights for volumetric effect
    const pointLight1 = new THREE.PointLight(0x10b981, 0.5, 20);
    pointLight1.position.set(8, 5, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 0.4, 20);
    pointLight2.position.set(-8, -3, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xf59e0b, 0.3, 15);
    pointLight3.position.set(0, 0, 10);
    scene.add(pointLight3);

    // Controls
    let controls: OrbitControls | null = null;
    if (enableControls) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.screenSpacePanning = false;
      controls.minDistance = 5;
      controls.maxDistance = 30;
      controls.maxPolarAngle = Math.PI / 2;
    }

    // Create 3D objects
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // Main geometric shapes with advanced materials
    const createGeometricObjects = () => {
      // Icosahedron (main centerpiece)
      const icoGeometry = new THREE.IcosahedronGeometry(3, 0);
      const icoMaterial = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x10b981,
        emissiveIntensity: 0.2,
        wireframe: false
      });
      const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
      icosahedron.position.set(0, 0, 0);
      icosahedron.castShadow = true;
      icosahedron.receiveShadow = true;
      objectsGroup.add(icosahedron);

      // Torus knot (cyan accent)
      const torusGeometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32);
      const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: false
      });
      const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
      torusKnot.position.set(-4, 2, 0);
      torusKnot.castShadow = true;
      objectsGroup.add(torusKnot);

      // Octahedron (orange accent)
      const octaGeometry = new THREE.OctahedronGeometry(2, 0);
      const octaMaterial = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.7,
        roughness: 0.3,
        wireframe: false
      });
      const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
      octahedron.position.set(4, -1, 2);
      octahedron.castShadow = true;
      objectsGroup.add(octahedron);

      // Wireframe spheres for depth effect
      const createWireframeSphere = (position: [number, number, number], size: number, color: number) => {
        const sphereGeo = new THREE.SphereGeometry(size, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: color,
          wireframe: true,
          transparent: true,
          opacity: 0.3
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.position.set(...position);
        objectsGroup.add(sphere);
        return sphere;
      };

      createWireframeSphere([0, 0, 0], 5, 0x10b981);
      createWireframeSphere([0, 0, 0], 7, 0x06b6d4);
      createWireframeSphere([0, 0, 0], 9, 0xf59e0b);

      return { icosahedron, torusKnot, octahedron };
    };

    const { icosahedron, torusKnot, octahedron } = createGeometricObjects();

    // Particle system for atmospheric effect
    const createParticleSystem = () => {
      const particleCount = 1000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      
      const color1 = new THREE.Color(0x10b981);
      const color2 = new THREE.Color(0x06b6d4);
      const color3 = new THREE.Color(0xf59e0b);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position in spherical distribution
        const radius = 15 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Color interpolation
        const t = Math.random();
        let color;
        if (t < 0.33) {
          color = color1.clone().lerp(color2, t * 3);
        } else if (t < 0.66) {
          color = color2.clone().lerp(color3, (t - 0.33) * 3);
        } else {
          color = color3.clone().lerp(color1, (t - 0.66) * 3);
        }
        
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      
      return particles;
    };

    const particles = createParticleSystem();

    // Ground plane for shadows
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Rotate main objects
      if (icosahedron) {
        icosahedron.rotation.x += delta * 0.3;
        icosahedron.rotation.y += delta * 0.5;
        icosahedron.position.y = Math.sin(elapsedTime * 0.5) * 0.5;
      }

      if (torusKnot) {
        torusKnot.rotation.x += delta * 0.7;
        torusKnot.rotation.y += delta * 0.4;
        torusKnot.position.y = 2 + Math.sin(elapsedTime * 0.7) * 0.3;
      }

      if (octahedron) {
        octahedron.rotation.x += delta * 0.2;
        octahedron.rotation.z += delta * 0.6;
        octahedron.position.y = -1 + Math.cos(elapsedTime * 0.4) * 0.4;
      }

      // Auto-rotate if enabled
      if (autoRotate && objectsGroup) {
        objectsGroup.rotation.y += delta * 0.1;
      }

      // Animate particles
      if (particles) {
        particles.rotation.y += delta * 0.05;
      }

      // Update controls
      if (controls) {
        controls.update();
      }

      // Render
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();
    setIsLoading(false);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Dispose of Three.js objects
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      if (controls) {
        controls.dispose();
      }
      
      renderer.dispose();
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate, enableControls]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-emerald-300 font-medium">Loading 3D Scene...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 z-10">
          <div className="text-center text-red-300">
            <p className="mb-2">❌ 3D Rendering Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mountRef} 
        className="w-full h-full rounded-2xl overflow-hidden"
        style={{ minHeight: '500px' }}
      />
      
      {/* Overlay controls hint */}
      {enableControls && (
        <div className="absolute bottom-4 left-4 text-xs text-neutral-400 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg">
          Drag to rotate • Scroll to zoom
        </div>
      )}
    </div>
  );
};

// Simplified version for performance-critical areas
export const LightweightThreeDScene: React.FC<ThreeDSceneProps> = (props) => {
  return (
    <AdvancedThreeDScene 
      {...props}
      autoRotate={false}
      enableControls={false}
    />
  );
};