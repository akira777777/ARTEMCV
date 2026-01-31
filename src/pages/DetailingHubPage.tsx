import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Palette, Camera, RotateCcw } from 'lucide-react';

const DetailingHubPage = () => {
  const [selectedPart, setSelectedPart] = useState('exterior');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [rotation, setRotation] = useState(0);

  const carParts = [
    { id: 'exterior', name: 'Exterior', icon: Car },
    { id: 'interior', name: 'Interior', icon: Palette },
    { id: 'wheels', name: 'Wheels', icon: RotateCcw },
  ];

  const colors = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
  ];

  const features = [
    {
      title: "Real-time Reflection Probes",
      description: "Dynamic reflections that update as you customize the car",
      metric: "99.9% accuracy",
      icon: "🪞"
    },
    {
      title: "Custom Shader Implementation",
      description: "Advanced GLSL shaders for realistic paint finishes",
      metric: "10x performance boost",
      icon: "🎨"
    },
    {
      title: "Smooth Camera Transitions",
      description: "GSAP-powered animations between car sections",
      metric: "<50ms transitions",
      icon: "📷"
    },
    {
      title: "Performance Optimization",
      description: "GPU-accelerated rendering with frustum culling",
      metric: "60fps guaranteed",
      icon: "⚡"
    }
  ];

  const impacts = [
    { value: "35%", label: "Reduction in bounce rate" },
    { value: "2.4x", label: "Increase in engagement time" },
    { value: "89%", label: "User satisfaction score" },
    { value: "4.2s", label: "Average session duration" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with 3D Model Placeholder */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        
        {/* Rotating Car Placeholder */}
        <motion.div
          animate={{ rotateY: rotation }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="relative w-80 h-80 md:w-96 md:h-96"
          style={{ perspective: '1000px' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center text-white text-6xl">
            🚗
          </div>
        </motion.div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button 
            onClick={() => setRotation(rotation - 90)}
            className="p-3 bg-card rounded-full border border-border hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Detailing Hub 3D
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Interactive 3D car configurator using React Three Fiber with custom shader implementation 
              for realistic paint finishes and real-time reflection probes.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-xl border border-border text-center"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                <div className="text-primary font-medium">{feature.metric}</div>
              </motion.div>
            ))}
          </div>

          {/* Impact Metrics */}
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {impacts.map((impact) => (
              <div key={impact.label} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {impact.value}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{impact.label}</div>
              </div>
            ))}
          </div>

          {/* Car Parts Selector */}
          <div className="bg-card p-8 rounded-xl border border-border mb-16">
            <h2 className="text-2xl font-bold mb-6">Customize Your Vehicle</h2>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {carParts.map((part) => {
                const IconComponent = part.icon;
                return (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPart(part.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                      selectedPart === part.id
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{part.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Color Palette */}
            <div>
              <h3 className="font-semibold mb-4">Paint Colors</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'border-primary scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Technical Deep Dive */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Technical Architecture</h2>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">React Three Fiber Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Leveraged R3F for declarative 3D scene composition, enabling real-time updates 
                    and smooth interactions with the car model.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Custom GLSL Shaders</h3>
                  <p className="text-sm text-muted-foreground">
                    Implemented advanced fragment shaders for realistic metallic and roughness maps, 
                    creating photorealistic paint finishes.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Performance Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Utilized instanced rendering and level-of-detail techniques to maintain 60fps 
                    even with complex geometries.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Key Achievements</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Interactive Experience</h3>
                    <p className="text-sm text-muted-foreground">
                      Created an engaging configurator that increased user session time by 240%
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Real-time Rendering</h3>
                    <p className="text-sm text-muted-foreground">
                      Achieved smooth 60fps performance with complex lighting and materials
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Conversion Optimization</h3>
                    <p className="text-sm text-muted-foreground">
                      Reduced bounce rate by 35% through immersive 3D experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DetailingHubPage;