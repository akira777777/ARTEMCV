
import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n';

const SERVICES = [
  {
    num: "01",
    title: "Backend Development",
    desc: "Node.js, Python, Java. REST API, микросервисы, обработка данных, интеграция внешних сервисов. Оптимизация производительности и масштабируемости.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
  },
  {
    num: "02",
    title: "Frontend Development",
    desc: "React, Next.js, TypeScript. Responsive UI, animations, состояние, интеграция с API. Tailwind CSS, Framer Motion для плавного взаимодействия.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
  },
  {
    num: "03",
    title: "Database Design",
    desc: "PostgreSQL, MongoDB, Supabase. Схемы, индексация, оптимизация запросов, миграции, backups. Выбор оптимального хранилища для задачи.",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
  }
];

const About: React.FC = () => {
  const { t } = useI18n();
  return (
    <section id="services" className="scroll-mt-24 py-32 px-6 lg:px-12 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.08),transparent_35%)] opacity-60" aria-hidden />
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full floating-badge accent-pill text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            {t('about.badge')}
          </div>
          <h2 className="text-4xl md:text-6xl font-serif">{t('about.title')}</h2>
          <p className="text-zinc-500 max-w-3xl mx-auto">{t('about.desc')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SERVICES.map((s, idx) => (
            <motion.div
              key={s.num}
              className="service-card p-10 rounded-[2.5rem] relative overflow-hidden group glass-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.04)] via-transparent to-transparent opacity-60" aria-hidden />
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-400/10 via-sky-400/0 to-white/0 blur-3xl" aria-hidden />
              <div className="text-xs font-bold text-zinc-700 absolute top-8 right-10">{s.num}</div>
              <div className="space-y-8 relative">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:scale-110 transition-all bg-white/5">
                  {s.icon}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-tight text-white">{s.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
