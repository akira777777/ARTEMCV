'use client';

import { PROJECTS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';
import { ProjectCard } from './ProjectCard';
import { motion } from 'framer-motion';

export function BentoGrid() {
  const { t } = useI18n();

  return (
    <section id="projects" className="py-24 container mx-auto px-4">
      <div className="mb-12">
        <span className="text-purple-400 text-sm font-medium tracking-wider uppercase">
          {t('projects.badge')}
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mt-2">{t('projects.title')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[500px]">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={i === 0 || i === 3 ? "md:col-span-2" : "md:col-span-1"}
          >
            <ProjectCard project={project} className="h-full" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
