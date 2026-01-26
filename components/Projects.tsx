
import React from 'react';
import { PROJECTS } from '../constants';

const Projects: React.FC = () => {
  return (
    <section id="work" className="scroll-mt-24 py-32 border-t border-white/5 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="text-4xl md:text-6xl font-serif">Things <span className="italic text-zinc-500">I’ve Designed.</span></h2>
          <div className="flex space-x-2">
            <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {PROJECTS.map((project) => (
            <div key={project.id} className="group space-y-8 cursor-pointer">
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-zinc-900 border border-white/5 relative">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                />
                <div className="absolute top-8 left-8 flex gap-2">
                  {project.techStack.slice(0, 2).map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-start px-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight text-white">{project.title}</h3>
                  <p className="text-zinc-500 text-sm max-w-sm line-clamp-2">{project.description}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
