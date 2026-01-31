import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Game Marketplace",
    description: "Full-stack marketplace platform for indie games with real-time trading",
    image: "/placeholder-game.jpg",
    tags: ["React", "Next.js", "WebGL", "Socket.io"],
    link: "https://game-marketplace-seven.vercel.app"
  },
  {
    id: 2,
    title: "Detailing Service",
    description: "Premium car detailing booking system with 3D visualization",
    image: "/placeholder-detailing.jpg",
    tags: ["Vue.js", "Three.js", "GSAP", "Stripe"],
    link: "https://detailing-mu.vercel.app"
  },
  {
    id: 3,
    title: "AI Art Generator",
    description: "Neural network powered art creation platform",
    image: "/placeholder-ai.jpg",
    tags: ["Python", "TensorFlow", "React", "WebGPU"],
    link: "#"
  }
];

export const ThreeDGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 100,
    damping: 20
  });
  
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 100,
    damping: 20
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const currentItem = galleryItems[currentIndex];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="blob-bg" style={{
          width: '500px',
          height: '500px',
          background: 'linear-gradient(45deg, #10B981, #06B6D4)',
          top: '10%',
          right: '5%',
        }} />
        <div className="blob-bg" style={{
          width: '400px',
          height: '400px',
          background: 'linear-gradient(45deg, #F59E0B, #10B981)',
          bottom: '10%',
          left: '8%',
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
            Featured Projects
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Explore my latest work with cutting-edge technologies and innovative designs
          </p>
        </motion.div>

        <div 
          ref={containerRef}
          className="relative max-w-6xl mx-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
        >
          {/* Main Card */}
          <motion.div
            className="card-3d relative h-[500px]"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d"
            }}
          >
            <div className="card-3d-inner glass-card-modern rounded-3xl h-full overflow-hidden">
              <div className="flex h-full">
                {/* Image Side */}
                <div className="w-1/2 relative overflow-hidden">
                  <img
                    src={currentItem.image || "/placeholder-project.jpg"}
                    alt={currentItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                    aria-label="Previous project"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                    aria-label="Next project"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Content Side */}
                <div className="w-1/2 p-8 flex flex-col justify-center">
                  <motion.div
                    key={currentItem.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
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
                    
                    <h3 className="text-3xl font-display font-black mb-4 text-white">
                      {currentItem.title}
                    </h3>
                    
                    <p className="text-neutral-300 mb-6 leading-relaxed">
                      {currentItem.description}
                    </p>
                    
                    {currentItem.link && (
                      <motion.a
                        href={currentItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neon-button inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Project
                        <ChevronRight className="w-4 h-4" />
                      </motion.a>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-emerald-500 w-8' 
                    : 'bg-neutral-700 hover:bg-neutral-600'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Floating Tech Icons */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {['React', 'Three.js', 'GSAP', 'WebGL'].map((tech, index) => (
            <motion.div
              key={tech}
              className="absolute text-2xl font-bold text-emerald-500/20"
              style={{
                left: `${20 + index * 20}%`,
                top: `${30 + (index % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                delay: index * 0.5,
              }}
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};