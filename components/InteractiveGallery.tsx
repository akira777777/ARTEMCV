import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Code2, Palette, Layers, Cpu } from 'lucide-react';
import { useI18n } from '../i18n';
import { 
  GlowCard, 
  HolographicCard, 
  AnimatedCounter, 
  PulseButton,
  MorphingBlob,
  OrbitingRings,
  NeonBorder,
  GlitchText,
  TypingText,
} from './EnhancedElements';

/**
 * InteractiveGallery - Showcase of interactive UI components
 * Demonstrates advanced animations and visual effects
 */
export const InteractiveGallery: React.FC = React.memo(() => {
  const { t } = useI18n();

  const features = useMemo(() => [
    { icon: Sparkles, title: 'Motion Design', desc: 'Fluid animations & transitions', color: '#6366f1' },
    { icon: Zap, title: 'Performance', desc: 'GPU-accelerated effects', color: '#f59e0b' },
    { icon: Code2, title: 'Clean Code', desc: 'TypeScript & React patterns', color: '#10b981' },
    { icon: Palette, title: 'Visual Design', desc: 'Modern glassmorphism UI', color: '#ec4899' },
  ], []);

  return (
    <section className="py-24 relative overflow-hidden" id="gallery" aria-labelledby="gallery-heading">
      {/* Background effects */}
      <MorphingBlob 
        color1="#6366f1" 
        color2="#ec4899" 
        size={500} 
        className="top-0 -left-64" 
      />
      <MorphingBlob 
        color1="#22d3ee" 
        color2="#a855f7" 
        size={400} 
        className="bottom-0 -right-48" 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-400 mb-6"
            whileHover={{ scale: 1.05, borderColor: 'rgba(99, 102, 241, 0.5)' }}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Interactive Components</span>
          </motion.div>
          
          <h2 id="gallery-heading" className="text-4xl md:text-5xl font-display font-bold mb-4">
            <GlitchText text="Visual" className="text-white" />{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Experience
            </span>
          </h2>
          
          <p className="text-neutral-400 max-w-2xl mx-auto">
            <TypingText 
              text="Explore a collection of carefully crafted interactive elements designed for modern web experiences."
              speed={30}
            />
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Holographic showcase card */}
          <div className="lg:col-span-2">
            <HolographicCard className="h-full min-h-[320px]">
              <div className="p-8 h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs mb-4">
                    <Cpu className="w-3 h-3" />
                    <span>3D Effects</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Holographic Interface</h3>
                  <p className="text-neutral-400 text-sm">
                    Move your cursor to see the 3D depth effect and rainbow shimmer.
                    Built with Framer Motion and CSS transforms.
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-4">
                    <OrbitingRings size={80} />
                  </div>
                  <PulseButton variant="secondary">
                    Explore More
                  </PulseButton>
                </div>
              </div>
            </HolographicCard>
          </div>

          {/* Stats card with animated counters */}
          <GlowCard className="p-6" glowColor="rgba(168, 85, 247, 0.4)">
            <h3 className="text-lg font-bold text-white mb-6">Project Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-sm">Components</span>
                <AnimatedCounter 
                  value={50} 
                  suffix="+" 
                  className="text-2xl font-bold text-white" 
                />
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-sm">Animations</span>
                <AnimatedCounter 
                  value={100} 
                  suffix="+" 
                  className="text-2xl font-bold text-indigo-400" 
                />
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 text-sm">Performance</span>
                <AnimatedCounter 
                  value={60} 
                  suffix=" FPS" 
                  className="text-2xl font-bold text-emerald-400" 
                />
              </div>
            </div>
          </GlowCard>

          {/* Feature cards */}
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlowCard className="p-6 h-full" glowColor={`${feature.color}66`}>
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-400 text-sm">{feature.desc}</p>
              </GlowCard>
            </motion.div>
          ))}

          {/* Neon border showcase */}
          <NeonBorder className="lg:col-span-2">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Neon Borders</h3>
                  <p className="text-neutral-400 text-sm max-w-md">
                    Animated gradient borders with glow effects. Perfect for highlighting important content.
                  </p>
                </div>
                <div className="flex gap-4">
                  <PulseButton>Primary</PulseButton>
                  <PulseButton variant="secondary">Secondary</PulseButton>
                </div>
              </div>
            </div>
          </NeonBorder>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-neutral-500 text-sm mb-4">
            All components are fully accessible and optimized for performance
          </p>
          <div className="flex justify-center gap-2">
            {['React', 'TypeScript', 'Framer Motion', 'Tailwind'].map((tech) => (
              <span 
                key={tech}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});

InteractiveGallery.displayName = 'InteractiveGallery';

export default InteractiveGallery;
