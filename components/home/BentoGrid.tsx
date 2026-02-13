import React from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../../constants';
import { useI18n } from '../../i18n';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import LazyGradientShaderCard from '../LazyGradientShaderCard';

// Animation variants for stagger effect
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20
    }
  }
};

const cardHoverVariants = {
  rest: { 
    scale: 1,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  },
  hover: { 
    scale: 1.02,
    boxShadow: '0 0 40px rgba(99, 102, 241, 0.3), 0 20px 25px -5px rgb(0 0 0 / 0.1)'
  }
};

const BentoGrid: React.FC = () => {
  const { t } = useI18n();
  const mainProject = PROJECTS[0]; // Detailing Hub
  const secondaryProject = PROJECTS[2]; // Barbershop
  const tertiaryProject = PROJECTS[1]; // Dental Clinic

  return (
    <section className="max-w-7xl mx-auto px-6 py-32" id="works" aria-labelledby="work-title">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Main Project: Detailing Hub */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          whileHover="hover"
          animate="rest"
          className="md:col-span-8 md:row-span-2 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] group cursor-pointer"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent" 
            aria-hidden="true"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div 
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <OptimizedImage
              alt={t(mainProject.title)}
              className="w-full h-full"
              src={mainProject.image}
              priority={true}
            />
          </motion.div>
          <div className="relative h-full p-10 flex flex-col justify-between z-10">
            <div>
              <motion.span 
                className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-widest uppercase"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                {t('works.badge')}
              </motion.span>
              <h3 id="work-title" className="text-4xl md:text-5xl font-display font-bold mt-6 text-white">{t(mainProject.title)}</h3>
              <motion.p 
                className="mt-4 opacity-50 max-w-sm text-white"
                initial={{ opacity: 0.5 }}
                whileHover={{ opacity: 0.8 }}
              >
                {t(mainProject.description)}
              </motion.p>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex gap-4">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1, rotate: 5, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">view_in_ar</span>
                </motion.div>
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white"
                  whileHover={{ scale: 1.1, rotate: -5, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">bolt</span>
                </motion.div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={mainProject.liveLink.startsWith('http') ? mainProject.liveLink : mainProject.liveLink}
                  className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                  aria-label={`${t('works.cta.view')} ${t(mainProject.title)}`}
                >
                  {t('works.cta.view')} <span className="material-symbols-outlined text-sm" aria-hidden="true">open_in_new</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stack Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="md:col-span-4 md:row-span-2 relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md flex flex-col p-10"
          id="stack"
          aria-labelledby="stack-title"
        >
          <h3 id="stack-title" className="text-2xl font-display font-bold mb-8 text-white">{t('about.title')}</h3>
          <motion.div className="flex-grow flex flex-col gap-6">
            <motion.div 
              className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group/item hover:bg-white/10 transition-all cursor-default"
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <motion.div 
                className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"
                whileHover={{ scale: 1.1 }}
              >
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">change_history</span>
              </motion.div>
              <div>
                <div className="font-bold text-sm text-white">{t('stack.nextjs.name')}</div>
                <div className="text-[10px] opacity-40 uppercase tracking-wider text-white">{t('stack.nextjs.desc')}</div>
              </div>
            </motion.div>
            <motion.div 
              className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group/item hover:bg-white/10 transition-all cursor-default"
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <motion.div 
                className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.7 }}
              >
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">token</span>
              </motion.div>
              <div>
                <div className="font-bold text-sm text-white">{t('stack.threejs.name')}</div>
                <div className="text-[10px] opacity-40 uppercase tracking-wider text-white">{t('stack.threejs.desc')}</div>
              </div>
            </motion.div>
            <motion.div 
              className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 group/item hover:bg-white/10 transition-all cursor-default"
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <motion.div 
                className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400"
                whileHover={{ scale: 1.1 }}
              >
                <span className="material-symbols-outlined text-3xl" aria-hidden="true">motion_mode</span>
              </motion.div>
              <div>
                <div className="font-bold text-sm text-white">{t('stack.gsap.name')}</div>
                <div className="text-[10px] opacity-40 uppercase tracking-wider text-white">{t('stack.gsap.desc')}</div>
              </div>
            </motion.div>
          </motion.div>
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
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="md:col-span-6 md:row-span-1 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] group cursor-pointer"
        >
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <OptimizedImage
              alt={t(secondaryProject.title)}
              className="absolute inset-0 w-full h-full opacity-60"
              src={secondaryProject.image}
              priority={false}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" aria-hidden="true"></div>
          <div className="relative h-full p-8 flex flex-col justify-end z-10">
            <div className="flex justify-between items-end">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-2xl font-display font-bold text-white">{t(secondaryProject.title)}</h4>
                <p className="text-sm opacity-60 text-white">{t(secondaryProject.description)}</p>
              </motion.div>
              <motion.a
                href={secondaryProject.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                aria-label={`${t('works.open_details')} ${t(secondaryProject.title)}`}
                whileHover={{ scale: 1.2, rotate: 45 }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Tertiary Project: Dental */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          className="md:col-span-6 md:row-span-1 relative overflow-hidden rounded-[2rem] border border-white/10 bg-indigo-900/10 group"
        >
          <motion.div 
            className="absolute inset-0 bg-indigo-900/20"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="relative h-full p-8 flex items-center gap-8">
            <motion.div 
              className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
              whileHover={{ borderColor: 'rgba(99, 102, 241, 0.5)' }}
            >
              <div className="relative w-12 h-12 flex items-center justify-center">
                <motion.span 
                  className="material-symbols-outlined text-5xl text-indigo-400 absolute"
                  animate={{ scale: [1, 0, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >dentistry</motion.span>
                <motion.span 
                  className="material-symbols-outlined text-5xl text-white absolute"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                >sentiment_very_satisfied</motion.span>
              </div>
            </motion.div>
            <div>
              <h4 className="text-2xl font-display font-bold text-white">{t(tertiaryProject.title)}</h4>
              <p className="text-sm opacity-60 max-w-xs text-white">{t(tertiaryProject.description)}</p>
              <motion.div className="flex gap-2 mt-4">
                {tertiaryProject.techStack.slice(0, 3).map((tech, i) => (
                   <motion.span 
                    key={i} 
                    className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/5 text-white/50"
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                   >{tech}</motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default BentoGrid;
