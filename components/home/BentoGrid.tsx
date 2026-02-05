import React from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../../constants';
import { useI18n } from '../../i18n';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import LazyGradientShaderCard from '../LazyGradientShaderCard';

const BentoGrid: React.FC = () => {
  const { t } = useI18n();
  const mainProject = PROJECTS[0]; // Detailing Hub
  const secondaryProject = PROJECTS[2]; // Barbershop
  const tertiaryProject = PROJECTS[1]; // Dental Clinic

  return (
    <section className="max-w-7xl mx-auto px-6 py-32" id="works" aria-labelledby="work-title">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
        {/* Main Project: Detailing Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-8 md:row-span-2 relative overflow-hidden rounded-[2rem] border border-white/10 transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] bg-[#050505] group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent" aria-hidden="true"></div>
          <div className="absolute inset-0 opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000">
            <OptimizedImage
              alt={t(mainProject.title)}
              className="w-full h-full"
              src={mainProject.image}
              priority={true} // Priority loading for above-the-fold content
            />
          </div>
          <div className="relative h-full p-10 flex flex-col justify-between z-10">
            <div>
              <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase">
                {t('works.badge')}
              </span>
              <h3 id="work-title" className="text-4xl md:text-5xl font-display font-bold mt-6 text-white">{t(mainProject.title)}</h3>
              <p className="mt-4 opacity-50 max-w-sm text-white">{t(mainProject.description)}</p>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  <span className="material-symbols-outlined" aria-hidden="true">view_in_ar</span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                  <span className="material-symbols-outlined" aria-hidden="true">bolt</span>
                </div>
              </div>
              {mainProject.liveLink.startsWith('http') ? (
                <a
                  href={mainProject.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                  aria-label={`${t('works.cta.view')} ${t(mainProject.title)}`}
                >
                  {t('works.cta.view')} <span className="material-symbols-outlined text-sm" aria-hidden="true">open_in_new</span>
                </a>
              ) : (
                <Link
                  to={mainProject.liveLink}
                  className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                  aria-label={`${t('works.cta.view')} ${t(mainProject.title)}`}
                >
                  {t('works.cta.view')} <span className="material-symbols-outlined text-sm" aria-hidden="true">open_in_new</span>
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="md:col-span-4 md:row-span-2 relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md flex flex-col p-10"
          id="stack"
          aria-labelledby="stack-title"
        >
          <h3 id="stack-title" className="text-2xl font-display font-bold mb-8 text-white">{t('about.title')}</h3>
          <div className="flex-grow flex flex-col gap-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group/item hover:bg-white/10 transition-all cursor-default">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 group-hover/item:animate-pulse">
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">change_history</span>
              </div>
              <div>
                <div className="font-bold text-sm text-white">{t('stack.nextjs.name')}</div>
                <div className="text-[10px] opacity-40 uppercase tracking-wider text-white">{t('stack.nextjs.desc')}</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group/item hover:bg-white/10 transition-all cursor-default">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover/item:rotate-180 transition-transform duration-700">
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">token</span>
              </div>
              <div>
                <div className="font-bold text-sm text-white">{t('stack.threejs.name')}</div>
                <div className="text-[10px] opacity-40 uppercase tracking-wider text-white">{t('stack.threejs.desc')}</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group/item hover:bg-white/10 transition-all cursor-default">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover/item:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">motion_mode</span>
              </div>
              <div>
                <div className="font-bold text-sm text-white">{t('stack.gsap.name')}</div>
                <div className="text-[10px] opacity-40 uppercase tracking-wider text-white">{t('stack.gsap.desc')}</div>
              </div>
            </div>
          </div>
          {/* Gradient Shader Card for visual enhancement */}
          <div className="mt-8" aria-hidden="true">
            <LazyGradientShaderCard />
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-[10px] opacity-30 uppercase tracking-[0.4em] text-white">{t('stack.performance')}</p>
          </div>
        </motion.div>

        {/* Secondary Project: Barbershop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="md:col-span-6 md:row-span-1 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] group cursor-pointer"
        >
          <OptimizedImage
            alt={t(secondaryProject.title)}
            className="absolute inset-0 w-full h-full opacity-60 group-hover:scale-105 transition-transform duration-700"
            src={secondaryProject.image}
            priority={false} // Lazy loading for below-the-fold content
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" aria-hidden="true"></div>
          <div className="relative h-full p-8 flex flex-col justify-end z-10">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-2xl font-display font-bold text-white">{t(secondaryProject.title)}</h4>
                <p className="text-sm opacity-60 text-white">{t(secondaryProject.description)}</p>
              </div>
              <a
                href={secondaryProject.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all translate-x-4 group-hover:translate-x-0 group-focus-within:translate-x-0 focus:translate-x-0 duration-300"
                aria-label={`${t('works.open_details')} ${t(secondaryProject.title)}`}
              >
                <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Tertiary Project: Dental */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="md:col-span-6 md:row-span-1 relative overflow-hidden rounded-[2rem] border border-white/10 bg-indigo-900/10 hover:bg-indigo-900/20 group transition-colors"
        >
          <div className="relative h-full p-8 flex items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-colors">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-indigo-400 group-hover:scale-0 transition-all duration-500" aria-hidden="true">dentistry</span>
                <span className="material-symbols-outlined text-5xl text-white absolute scale-0 group-hover:scale-110 transition-all duration-500" aria-hidden="true">sentiment_very_satisfied</span>
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-display font-bold text-white">{t(tertiaryProject.title)}</h4>
              <p className="text-sm opacity-60 max-w-xs text-white">{t(tertiaryProject.description)}</p>
              <div className="flex gap-2 mt-4">
                {tertiaryProject.techStack.slice(0, 3).map((tech, i) => (
                   <span key={i} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 text-white/50">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default BentoGrid;
