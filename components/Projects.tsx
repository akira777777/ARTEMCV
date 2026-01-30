
import React from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../constants';
import { useI18n } from '../i18n';

const Projects: React.FC = () => {
  const { t } = useI18n();
  return (
    <section id="work" className="scroll-mt-24 py-32 border-t border-white/5 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04),transparent_60%)]" aria-hidden />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full floating-badge accent-pill text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {t('projects.badge')}
            </div>
            <h2 className="text-4xl md:text-6xl font-serif">{t('projects.title')}</h2>
          </div>
          <div className="flex space-x-2">
            <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors" title="Previous project" aria-label="Previous project">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors" title="Next project" aria-label="Next project">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {PROJECTS.map((project, idx) => (
            <motion.a
              key={project.id}
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="group space-y-6 block"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: idx * 0.05 }}
              whileHover={{ y: -6 }}
            >
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-zinc-900 border border-white/10 relative shine-border group/image">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-700" aria-hidden />
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover brightness-80 group-hover:brightness-110 group-hover:scale-105 transition-all duration-1000 ease-out will-change-transform"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-8 left-8 flex gap-2">
                  {project.techStack.slice(0, 3).map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-8 left-0 right-0 px-8 flex justify-between items-center">
                  <div className="text-sm text-white/80 uppercase tracking-[0.2em]">{project.title}</div>
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-start px-1">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-white">{project.title}</h3>
                  <p className="text-zinc-500 text-sm max-w-sm line-clamp-2">{project.description}</p>
                </div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-600">{project.techStack[0]}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Projects);
