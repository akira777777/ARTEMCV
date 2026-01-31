import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { AdvancedThreeDScene } from './ThreeDRenderer';

interface ModelItem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  modelType: 'geometric' | 'organic' | 'abstract' | 'architectural';
}

const modelItems: ModelItem[] = [
  {
    id: 1,
    title: "Quantum Geometry",
    description: "Interactive icosahedron with dynamic lighting and particle effects",
    tags: ["Geometry", "Lighting", "Particles"],
    modelType: "geometric"
  },
  {
    id: 2,
    title: "Neural Network",
    description: "Organic torus knot structure with flowing particle connections",
    tags: ["Organic", "Flow", "Connections"],
    modelType: "organic"
  },
  {
    id: 3,
    title: "Digital Crystal",
    description: "Abstract octahedron with refractive properties and chromatic aberration",
    tags: ["Abstract", "Refraction", "Chromatic"],
    modelType: "abstract"
  },
  {
    id: 4,
    title: "Parametric Structure",
    description: "Architectural form with procedural generation and adaptive geometry",
    tags: ["Architecture", "Procedural", "Parametric"],
    modelType: "architectural"
  }
];

export const Interactive3DGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % modelItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + modelItems.length) % modelItems.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const currentItem = modelItems[currentIndex];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/15 via-transparent to-cyan-900/15" />
        <div className="blob-bg" style={{
          width: '600px',
          height: '600px',
          background: 'conic-gradient(from 0deg, #10B981, #06B6D4, #F59E0B)',
          top: '10%',
          left: '5%',
        }} />
        <div className="blob-bg" style={{
          width: '500px',
          height: '500px',
          background: 'conic-gradient(from 180deg, #F59E0B, #10B981, #06B6D4)',
          bottom: '10%',
          right: '5%',
        }} />
      </div>

      <div className="container-wrapper relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-display font-black mb-6 gradient-text">
            3D Experience Lab
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Interactive 3D models with real-time physics and advanced rendering
          </p>
        </motion.div>

        <div 
          ref={containerRef}
          className={`relative mx-auto transition-all duration-500 ${
            isFullscreen 
              ? 'fixed inset-4 z-50 bg-black/90 backdrop-blur-xl rounded-2xl p-6' 
              : 'max-w-6xl'
          }`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
        >
          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          {/* Main 3D Viewer */}
          <motion.div
            className="card-3d relative h-[500px] mb-8"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d"
            }}
          >
            <div className="card-3d-inner glass-card-modern rounded-2xl h-full overflow-hidden">
              <AdvancedThreeDScene 
                className="w-full h-full"
                autoRotate={!isFullscreen}
                enableControls={isFullscreen}
              />
            </div>
          </motion.div>

          {/* Model Info Panel */}
          <motion.div
            key={currentItem.id}
            className="glass-card-modern rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {currentItem.tags.map(tag => (
                <span 
                  key={tag}
                  className="text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h3 className="text-2xl font-display font-black mb-3 text-white">
              {currentItem.title}
            </h3>
            
            <p className="text-neutral-300 mb-4">
              {currentItem.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-500">
                  Model Type: 
                </span>
                <span className="text-sm font-bold text-emerald-400 capitalize">
                  {currentItem.modelType}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  aria-label="Previous model"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  aria-label="Next model"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2">
            {modelItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-primary-500 w-8' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                aria-label={`Go to model ${index + 1}`}
              />
            ))}
          </div>

          {/* Technical Specs */}
          {!isFullscreen && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {[
                {
                  title: "Real-time Rendering",
                  description: "WebGL-powered 3D graphics with 60fps performance",
                  icon: "⚡"
                },
                {
                  title: "Advanced Lighting",
                  description: "Physically-based rendering with dynamic shadows",
                  icon: "💡"
                },
                {
                  title: "Interactive Physics",
                  description: "Real-time particle systems and collision detection",
                  icon: "⚛️"
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="glass-card-modern rounded-xl p-6 text-center hover:border-secondary/50 transition-all"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// Performance-optimized version for mobile
export const Mobile3DViewer: React.FC = () => {
  return (
    <div className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-display font-black mb-6 text-center gradient-text">
          3D Preview
        </h3>
        <div className="glass-card-modern rounded-2xl overflow-hidden h-64">
          <AdvancedThreeDScene 
            className="w-full h-full"
            autoRotate={true}
            enableControls={false}
          />
        </div>
        <p className="text-center text-neutral-400 mt-4 text-sm">
          Full 3D experience available on desktop
        </p>
      </div>
    </div>
  );
};