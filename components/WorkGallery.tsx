import React, { useRef, useState, useMemo, useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { useReducedMotion } from '../lib/hooks';
import { useI18n } from '../i18n';
import OptimizedImage from './OptimizedImage';

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = React.memo(({ project, onClick }) => {
  const { t } = useI18n();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Use IntersectionObserver to track visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: '50px', threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) return;

    let animationFrameId: number;
    let ticking = false;

    const updateParallax = () => {
      if (!containerRef.current || !imgRef.current) {
        ticking = false;
        return;
      }
      
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only calculate if the element is roughly in view
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const speed = 0.15;
        const centerOffset = (viewportHeight / 2) - (rect.top + rect.height / 2);
        const translateY = centerOffset * speed;
        imgRef.current.style.transform = `translateY(${translateY}px) scale(1.2)`;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, prefersReducedMotion]);

  const primaryTag = project.techStack[0] || t('works.fallback.tag');

  return (
    <article
      className="relative flex-none w-[85vw] md:w-[400px] lg:w-[500px] group snap-start cursor-pointer animate-fade-up text-left bg-transparent border-0 project-card-button"
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={`${t('works.open_details')} ${t(project.title)}`}
        className="absolute inset-0 z-10 rounded-sm"
      />
      <div ref={containerRef} className="relative overflow-hidden aspect-[3/4] rounded-sm mb-6 bg-neutral-900 project-card-container">
         
         {/* Wrapper for Hover Animations (Scale & Brightness) 
             Separating this allows the inner image to handle Parallax transform independently.
         */}
         <div className="w-full h-full transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110">
            <OptimizedImage 
              ref={imgRef as React.RefObject<HTMLImageElement>}
              src={project.image} 
              alt={t(project.title)}
              onLoad={() => setIsLoaded(true)}
              className={`
                w-full h-full object-cover scale-[1.2]
                will-change-transform
                transition-opacity duration-700
                ${isLoaded ? 'opacity-90 group-hover:opacity-100' : 'opacity-0'}
              `}
            />
         </div>
         
         {/* Placeholder */}
         <div className={`absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse transition-opacity duration-500 pointer-events-none z-10 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
         
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
         
         {/* Action Buttons */}
         <div className="absolute top-4 right-4 flex gap-2 z-20">
           <a
             href={project.liveLink}
             target="_blank"
             rel="noopener noreferrer"
             onClick={(e) => e.stopPropagation()}
             aria-label={`${t('works.cta.view')} ${t(project.title)}`}
             className="bg-white text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-y-4 scale-90 group-hover:translate-y-0 group-hover:scale-100 shadow-xl hover:bg-indigo-500 hover:text-white"
           >
             <ArrowUpRight size={20} />
           </a>
         </div>
      </div>
      
      <div className="relative z-10 flex justify-between items-start border-t border-indigo-500/20 pt-4">
        <div>
          <h3 className="text-2xl font-bold font-display tracking-wide group-hover:text-neutral-300 transition-colors">{t(project.title)}</h3>
          <p className="text-neutral-500 text-sm mt-1">{primaryTag}</p>
        </div>
        <div className="flex gap-2">
          {project.techStack.slice(1, 3).map((tech) => (
            <span key={tech} className="text-xs font-mono border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 rounded text-indigo-300 hover:border-indigo-400/60 transition-colors">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
});

ProjectCard.displayName = 'ProjectCard';

export const WorkGallery: React.FC = React.memo(() => {
  const { t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const categories = useMemo(() => {
    const tags = PROJECTS.flatMap(project => project.techStack);
    return ['All', ...Array.from(new Set(tags))];
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return PROJECTS;
    return PROJECTS.filter(project => project.techStack.includes(activeCategory));
  }, [activeCategory]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCloseOverlay = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedProject(null);
      setIsClosing(false);
    }, 400); // Matches the animation duration in CSS
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  return (
    <section id="works" className="py-32 w-full relative border-t border-white/5 bg-gradient-to-b from-black to-neutral-950">
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-neutral-500 text-xs font-bold tracking-widest mb-2 block">{t('works.badge')}</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white">{t('works.title')}</h2>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex gap-4 mt-8 md:mt-0">
            <button
              onClick={() => scroll('left')}
              aria-label={t('works.scroll_left')}
              className="p-4 rounded-full border-2 border-indigo-400/30 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:border-transparent hover:text-white text-neutral-300 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label={t('works.scroll_right')}
              className="p-4 rounded-full border-2 border-indigo-400/30 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:border-transparent hover:text-white text-neutral-300 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
            >
              →
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-12 border-b border-indigo-500/20 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-6 py-2.5 rounded-full text-xs tracking-widest transition-all duration-300 border font-bold
                ${activeCategory === cat 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent scale-110 shadow-[0_0_25px_rgba(99,102,241,0.5)]' 
                  : 'text-neutral-400 border-indigo-400/20 hover:text-white hover:bg-indigo-500/10 hover:border-indigo-400/50'}
              `}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 no-scrollbar snap-x snap-mandatory min-h-[500px] scroll-pl-6"
      >
        {filteredProjects.map((project) => (
          <ProjectCard 
            key={`${project.id}-${activeCategory}`}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
         {/* Spacer for right padding */}
         <div className="w-12 flex-none" />
      </div>

      {/* Project Detail Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
           {/* Backdrop */}
           <button
             type="button"
             aria-label="Close project details"
             className={`absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-400 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
             onClick={handleCloseOverlay}
           />

           {/* Modal Content */}
           <div 
             className={`
                relative w-full max-w-5xl bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl 
                max-h-[90vh] flex flex-col md:flex-row
                ${isClosing ? 'animate-fade-out-down' : 'animate-fade-up'}
             `}
           >
              {/* Close Button */}
              <button 
                onClick={handleCloseOverlay}
                aria-label="Close project details"
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur rounded-full text-white border border-white/10 hover:bg-white hover:text-black transition-colors"
              >
                <X size={20} />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-neutral-800">
                 <OptimizedImage 
                   src={selectedProject.image} 
                   alt={t(selectedProject.title)}
                   className="w-full h-full object-cover animate-breathe-zoom" 
                   priority={true}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                 <div className="mb-auto">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-xs font-mono text-neutral-400 border border-white/10 px-2 py-1 rounded inline-block">
                        {selectedProject.techStack[0]}
                      </span>
                      {selectedProject.techStack[1] && (
                        <span className="text-xs font-mono text-neutral-500">
                          {'// '}{selectedProject.techStack[1]}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white leading-tight">
                      {t(selectedProject.title)}
                    </h2>
                    
                    <div className="w-12 h-0.5 bg-white/20 mb-8" />
                    
                    <p className="text-neutral-400 leading-relaxed text-base md:text-lg font-light">
                      {t(selectedProject.description) || t('works.no.desc')}
                    </p>
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-white/10">
                     <a 
                       href={selectedProject.liveLink || selectedProject.githubLink || '#'}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="group flex items-center justify-center gap-3 w-full py-4 bg-white text-black text-xs font-bold tracking-widest rounded hover:bg-neutral-200 transition-all duration-300"
                     >
                        {t('works.cta.view')}
                        <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                     </a>
                 </div>
              </div>
           </div>
        </div>
      )}
    </section>
  );
});

WorkGallery.displayName = 'WorkGallery';
