import React, { useState, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface CardStackItem {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  gradient: string;
}

export const CardStack: React.FC = React.memo(() => {
  const stackItems = useMemo<CardStackItem[]>(() => [
    {
      id: 1,
      title: "Innovation First",
      description: "Cutting-edge solutions that push boundaries and redefine possibilities",
      image: "/innovation-icon.svg",
      tags: ["Research", "Development", "Future"],
      gradient: "from-emerald-500 to-cyan-500"
    },
    {
      id: 2,
      title: "User Centric",
      description: "Designs that prioritize human experience and intuitive interaction",
      image: "/user-icon.svg",
      tags: ["UX", "Accessibility", "Empathy"],
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      id: 3,
      title: "Performance Driven",
      description: "Optimized solutions that deliver exceptional speed and reliability",
      image: "/performance-icon.svg",
      tags: ["Optimization", "Speed", "Efficiency"],
      gradient: "from-orange-500 to-red-500"
    }
  ], []);

  const [cards, setCards] = useState<CardStackItem[]>(stackItems);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const handleDragEnd = (_: MouseEvent | TouchEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      // Remove card and add to end
      const newCards = [...cards.slice(1), cards[0]];
      setCards(newCards);
      x.set(0);
      y.set(0);
    } else {
      // Snap back
      x.set(0);
      y.set(0);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-orange-900/10" />
        <div className="blob-bg" style={{
          width: '600px',
          height: '600px',
          background: 'conic-gradient(from 0deg, #10B981, #06B6D4, #F59E0B)',
          top: '20%',
          left: '10%',
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
            Core Values
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Principles that guide every project and decision
          </p>
        </motion.div>

        <div className="relative max-w-md mx-auto h-96">
          {cards.map((card, index) => {
            // Calculate position based on index
            const positionOffset = index * 8;
            const scaleOffset = 1 - (index * 0.05);
            
            return (
              <motion.div
                key={card.id}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                style={{
                  x: index === 0 ? x : positionOffset,
                  y: index === 0 ? y : positionOffset,
                  rotate: index === 0 ? rotate : 0,
                  opacity: index === 0 ? opacity : 1 - (index * 0.2),
                  scale: scaleOffset,
                  zIndex: cards.length - index,
                }}
                drag={index === 0 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={index === 0 ? handleDragEnd : undefined}
                whileTap={{ scale: index === 0 ? 1.05 : scaleOffset }}
              >
                <div className={`glass-card-modern rounded-2xl h-full p-6 border-l-4 border-gradient-to-b ${card.gradient}`}>
                  <div className="h-full flex flex-col">
                    {/* Icon/Image */}
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br bg-white/10 flex items-center justify-center">
                        <span className="text-2xl">⭐</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {card.title}
                    </h3>
                    
                    <p className="text-neutral-300 text-sm mb-4 flex-grow">
                      {card.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map(tag => (
                        <span 
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {/* Swipe indicators */}
          <motion.div 
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-4 text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-2 text-sm">
              <span>←</span>
              <span>Swipe to explore</span>
              <span>→</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

// Alternative vertical stack variant
export const VerticalCardStack: React.FC = React.memo(() => {
  const stackItems = useMemo<CardStackItem[]>(() => [
    {
      id: 1,
      title: "Innovation First",
      description: "Cutting-edge solutions that push boundaries and redefine possibilities",
      image: "/innovation-icon.svg",
      tags: ["Research", "Development", "Future"],
      gradient: "from-emerald-500 to-cyan-500"
    },
    {
      id: 2,
      title: "User Centric",
      description: "Designs that prioritize human experience and intuitive interaction",
      image: "/user-icon.svg",
      tags: ["UX", "Accessibility", "Empathy"],
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      id: 3,
      title: "Performance Driven",
      description: "Optimized solutions that deliver exceptional speed and reliability",
      image: "/performance-icon.svg",
      tags: ["Optimization", "Speed", "Efficiency"],
      gradient: "from-orange-500 to-red-500"
    }
  ], []);
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {stackItems.map((item, index) => (
        <motion.div
          key={item.id}
          className="glass-card-modern rounded-xl p-6 cursor-pointer"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          whileHover={{ 
            scale: 1.02,
            y: -5
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: hoveredIndex === index 
              ? `linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))`
              : undefined
          }}
        >
          <div className="flex items-start gap-4">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.gradient} mt-2 flex-shrink-0`} />
            <div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-neutral-400 text-sm mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span 
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
});