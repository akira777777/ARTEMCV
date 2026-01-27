
import React from 'react';

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
  return (
    <section id="services" className="scroll-mt-24 py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-serif">Мой <span className="italic">стек</span> и услуги.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SERVICES.map((s) => (
            <div key={s.num} className="service-card p-10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="text-xs font-bold text-zinc-700 absolute top-8 right-10">{s.num}</div>
              <div className="space-y-8">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:scale-110 transition-all">
                  {s.icon}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-tight">{s.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
