import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { useI18n } from '../i18n';
import OptimizedImage from './OptimizedImage';
import { HolographicCard } from './HolographicCard';
import { FloatingParticleCanvas } from './FloatingParticleCanvas';
import { RenderOptimizer } from './RenderOptimizer';

/**
 * Spotlight Gallery - Modern project showcase with featured project and thumbnail carousel
 */
export const SpotlightGallery: React.FC = React.memo(() => {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const activeProject = useMemo(() => PROJECTS[activeIndex], [activeIndex]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? PROJECTS.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === PROJECTS.length - 1 ? 0 : prev + 1));
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, handleNext]);

  const visibleThumbnails = useMemo(() => {
    const start = activeIndex;
    const thumbnails = [];
    for (let i = 0; i < 4; i++) {
      thumbnails.push(PROJECTS[(start + i) % PROJECTS.length]);
    }
    return thumbnails;
  }, [activeIndex]);

  // Hydration effect for SSR
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Return a simplified skeleton while hydrating
    return (
      <section id="works" className="py-32 w-full relative border-t border-white/5 bg-gradient-to-b from-black via-neutral-950/50 to-black">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-16 bg-white/5 rounded w-full mb-16"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
              <div className="lg:col-span-2 h-96 bg-white/5 rounded-2xl"></div>
              <div className="space-y-6">
                <div className="h-48 bg-white/5 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <RenderOptimizer priority="medium">
      <section id="works" className="py-32 w-full relative border-t border-white/5 bg-gradient-to-b from-black via-neutral-950/50 to-black overflow-hidden">
        {/* Background floating particles */}
        <div className="absolute inset-0 -z-10">
          <FloatingParticleCanvas 
            particleCount={50} 
            interactionRadius={80}
            backgroundColor="transparent"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-neutral-500 text-xs font-bold tracking-widest mb-2 block">{t('works.badge')}</span>
              <h2 className="text-5xl md:text-7xl font-display font-bold text-white">{t('works.title')}</h2>
            </div>

            {/* Controls */}
            <div className="flex gap-4 mt-8 md:mt-0">
              {/* Auto-play toggle */}
              <button
                onClick={() => setAutoPlay(!autoPlay)}
                className={`p-4 rounded-full border-2 ${
                  autoPlay 
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300' 
                    : 'border-white/20 text-neutral-400 hover:border-indigo-400/30'
                } transition-all duration-300`}
                aria-label={autoPlay ? "Pause auto-play" : "Start auto-play"}
              >
                {autoPlay ? '⏸️' : '▶️'}
              </button>
              
              <button
                onClick={handlePrev}
                aria-label={t('works.prev')}
                className="p-4 rounded-full border-2 border-indigo-400/30 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:border-transparent hover:text-white text-neutral-300 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                aria-label={t('works.next')}
                className="p-4 rounded-full border-2 border-indigo-400/30 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:border-transparent hover:text-white text-neutral-300 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Spotlight Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* Featured Project */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="group relative overflow-hidden rounded-2xl aspect-video bg-neutral-900 border border-white/5 hover:border-indigo-400/30 transition-all duration-300"
                >
                  <OptimizedImage
                    src={activeProject.image}
                    alt={t(activeProject.title)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    priority={true}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div>
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {activeProject.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-mono bg-indigo-500/20 border border-indigo-400/50 px-3 py-1 rounded text-indigo-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                        {t(activeProject.title)}
                      </h3>
                      <p className="text-neutral-300 text-sm md:text-base max-w-lg">
                        {t(activeProject.description) || 'High-quality project developed with cutting-edge technologies'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Project Info Sidebar */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold tracking-widest text-neutral-400">Project Details</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-neutral-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-2">Project #{activeIndex + 1} of {PROJECTS.length}</p>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((activeIndex + 1) / PROJECTS.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                {activeProject.liveLink && (
                  <a
                    href={activeProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold rounded-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300"
                  >
                    {t('works.cta.view')}
                    <ExternalLink size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </a>
                )}
                {activeProject.githubLink && (
                  <a
                    href={activeProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300"
                  >
                    VIEW CODE
                    <Github size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Thumbnail Carousel */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-neutral-400">Quick Navigation</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <AnimatePresence>
                {visibleThumbnails.map((project, idx) => {
                  const actualIndex = (activeIndex + idx) % PROJECTS.length;
                  const isActive = actualIndex === activeIndex;

                  return (
                    <motion.button
                      key={`${actualIndex}-${idx}`}
                      onClick={() => setActiveIndex(actualIndex)}
                      className={`group relative overflow-hidden rounded-lg aspect-video cursor-pointer transition-all duration-300 ${
                        isActive
                          ? 'ring-2 ring-indigo-500 scale-105'
                          : 'hover:ring-2 hover:ring-indigo-400/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <OptimizedImage
                        src={project.image}
                        alt={t(project.title)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        width={100}
                        height={100}
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/30 to-transparent" />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                        <p className="text-xs font-bold text-white truncate">{t(project.title)}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Counter */}
          <div className="mt-16 text-center">
            <p className="text-sm text-neutral-400">
              {t('works.open_details')} <span className="text-white font-bold">{t(activeProject.title)}</span> •{' '}
              {t('works.scroll_left')} / {t('works.scroll_right')} •{' '}
              Auto {autoPlay ? 'PLAY' : 'PAUSED'}
            </p>
          </div>
        </div>
      </section>
    </RenderOptimizer>
  );
});

SpotlightGallery.displayName = 'SpotlightGallery';
