import React from 'react';
import { SKILLS } from '../constants';

export const About: React.FC = React.memo(() => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="studio" className="py-24 md:py-40 border-t border-white/5 bg-gradient-to-b from-neutral-950 to-black relative overflow-hidden">
      <div className="absolute -top-32 left-0 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl float-slow" aria-hidden />
      <div className="absolute -bottom-40 right-0 w-[32rem] h-[32rem] rounded-full bg-emerald-400/15 blur-3xl float-slower" aria-hidden />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-purple-500/10 blur-3xl" aria-hidden />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              BUILDING DIGITAL <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">PRODUCTS THAT</span> <br />
              DRIVE RESULTS.
            </h2>
            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-lg">
              I'm a full-stack developer passionate about creating scalable, high-performance web applications. With expertise in modern frameworks and a keen eye for design, I deliver solutions that exceed expectations.
            </p>
            <div className="pt-8">
              <button
                onClick={scrollToContact}
                className="relative px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold tracking-widest rounded-full hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-105 transition-all duration-300 cta-button sheen-sweep overflow-hidden"
              >
                LET'S COLLABORATE
              </button>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold tracking-widest bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6 border-b border-indigo-500/30 pb-4">TECHNICAL EXPERTISE</h3>
            {SKILLS.map((category) => (
              <div key={category.name} className="space-y-3">
                <h4 className="text-base font-bold text-white">{category.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 text-sm font-medium bg-gradient-to-br from-white/10 to-white/5 border border-indigo-400/20 rounded-full text-neutral-200 hover:bg-gradient-to-br hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div id="services" className="mt-32 scroll-mt-24">
          <h3 className="text-sm font-bold tracking-widest bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-10 border-b border-indigo-500/30 pb-4">WHAT I OFFER</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Web Development', desc: 'Full-stack applications with React, Next.js, Node.js', icon: '💻' },
              { name: 'UI/UX Design', desc: 'Modern, accessible interfaces with Figma & Tailwind', icon: '🎨' },
              { name: 'API Integration', desc: 'RESTful APIs, GraphQL, third-party services', icon: '🔌' },
              { name: 'Database Design', desc: 'PostgreSQL, MongoDB, Redis optimization', icon: '🗄️' },
              { name: 'Performance', desc: 'Core Web Vitals, SEO, loading optimization', icon: '⚡' },
              { name: 'Deployment', desc: 'CI/CD, Docker, AWS, Vercel cloud hosting', icon: '🚀' },
            ].map((service, index) => (
              <div key={service.name} className="service-card rounded-2xl px-6 py-6 group cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] bg-gradient-to-br from-white/5 to-transparent border border-indigo-400/20 hover:border-indigo-400/50">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
                  <span className="text-xs text-indigo-400/60 font-mono">0{index + 1}</span>
                </div>
                <h4 className="text-xl font-display font-semibold group-hover:text-indigo-300 transition-colors mb-2">
                  {service.name}
                </h4>
                <p className="text-sm text-neutral-400 leading-relaxed">{service.desc}</p>
                <div className="mt-4 h-px bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-transparent group-hover:from-indigo-500 group-hover:via-purple-500 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
