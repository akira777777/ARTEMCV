'use client';

import { SKILLS } from '@/lib/constants';
import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import {
  SiReact, SiTypescript, SiNextdotjs, SiTailwindcss, SiNodedotjs,
  SiPostgresql, SiDocker, SiMongodb, SiPython, SiSupabase, SiRedux, SiGit, SiAmazonwebservices
} from 'react-icons/si';
import { IconType } from 'react-icons';

const ICON_MAP: Record<string, IconType> = {
  'React 19': SiReact,
  'TypeScript': SiTypescript,
  'Next.js': SiNextdotjs,
  'Tailwind CSS': SiTailwindcss,
  'Node.js': SiNodedotjs,
  'PostgreSQL': SiPostgresql,
  'Docker': SiDocker,
  'MongoDB': SiMongodb,
  'Python (FastAPI, Django)': SiPython,
  'Supabase': SiSupabase,
  'Redux Toolkit': SiRedux,
  'Git': SiGit,
  'AWS/Vercel': SiAmazonwebservices
};

export function Skills() {
  const { t } = useI18n();

  return (
    <section className="py-24 bg-white/5 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <span className="text-purple-400 text-sm font-medium tracking-wider uppercase">
            {t('about.badge')}
          </span>
          <h2 className="text-4xl font-bold mt-2">{t('about.title')}</h2>
          <p className="max-w-2xl mx-auto mt-4 text-gray-400">
            {t('about.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SKILLS.map((category, catIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold mb-6 text-white">{category.name}</h3>
              <div className="flex flex-wrap gap-4">
                {category.items.map((item, itemIndex) => {
                  const Icon = ICON_MAP[item];
                  return (
                    <motion.div
                      key={item}
                      className="flex flex-col items-center gap-2 group"
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                      }}
                    >
                      <div className="p-3 rounded-xl bg-white/5 group-hover:bg-purple-500/20 transition-colors border border-white/10">
                        {Icon ? <Icon className="w-6 h-6 text-gray-300 group-hover:text-purple-300 transition-colors" /> : <span className="w-6 h-6 block bg-gray-600 rounded-full" />}
                      </div>
                      <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors text-center max-w-[80px]">
                        {item.split(' ')[0]}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
