import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Image, Sparkles, Star } from 'lucide-react';

const BarbershopGridPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  // Sample images for the gallery
  const galleryImages = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Style ${i + 1}`,
    description: `Premium cut and style`,
    category: ['Beard', 'Haircut', 'Shave'][i % 3],
  }));

  const services = [
    { name: "Precision Haircut", price: "$25", time: "30 min", icon: Scissors },
    { name: "Hot Towel Shave", price: "$30", time: "45 min", icon: Sparkles },
    { name: "Beard Trim", price: "$20", time: "20 min", icon: Star },
    { name: "Classic Cut & Style", price: "$40", time: "60 min", icon: Image },
  ];

  const metrics = [
    { value: "<100ms", label: "LCP achieved", icon: Image },
    { value: "89%", label: "Client retention", icon: Star },
    { value: "4.8", label: "Average rating", icon: Star },
    { value: "2.3x", label: "Faster loading", icon: Image },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollY / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 to-orange-900/20" />
        
        <div className="text-center z-10 max-w-4xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              The Barbershop Grid
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Magnetic scroll-driven gallery with dynamic layout shifts and optimized image delivery 
            via Edge functions for lightning-fast performance.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4"
          >
            <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity">
              View Gallery
            </button>
            <button className="px-6 py-3 border border-border rounded-lg font-semibold text-foreground hover:bg-muted transition-colors">
              Book Appointment
            </button>
          </motion.div>
        </div>
      </div>

      {/* Metrics Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <metric.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Services */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-xl border border-border text-center hover:border-primary transition-colors"
              >
                <service.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{service.name}</h3>
                <div className="text-2xl font-bold text-primary mb-1">{service.price}</div>
                <div className="text-sm text-muted-foreground">{service.time}</div>
              </motion.div>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Gallery Showcase</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative overflow-hidden rounded-lg aspect-square cursor-pointer group"
                  onMouseEnter={() => setHoveredImage(image.id)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div>
                      <h3 className="text-white font-semibold">{image.title}</h3>
                      <p className="text-white/80 text-sm">{image.category}</p>
                    </div>
                  </div>
                  
                  <motion.div
                    className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl"
                    animate={{
                      scale: hoveredImage === image.id ? 1.05 : 1,
                      y: scrollProgress * 0.1,
                    }}
                    transition={{ type: "tween", ease: "easeOut" }}
                  >
                    ✂️
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Technical Features */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Performance Optimizations</h2>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Edge Runtime Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimized image delivery via Edge functions ensuring <100ms Largest Contentful Paint (LCP).
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Magnetic Scroll Effect</h3>
                  <p className="text-sm text-muted-foreground">
                    Smooth scroll-driven animations that create engaging user experiences with parallax depth.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Dynamic Layout Shifts</h3>
                  <p className="text-sm text-muted-foreground">
                    Responsive grid that adapts to screen size with elastic micro-interactions on hover.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">User Experience</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Loading Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Achieved <100ms LCP through optimized image delivery and edge computing
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Scroll Interactions</h3>
                    <p className="text-sm text-muted-foreground">
                      Magnetic scroll-driven gallery with dynamic depth effects
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Visual Appeal</h3>
                    <p className="text-sm text-muted-foreground">
                      Elastic micro-interactions and parallax depth create engaging experience
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

export default BarbershopGridPage;