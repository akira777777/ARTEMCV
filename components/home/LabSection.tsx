import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../i18n';
import { Orbit, Brain, ArrowUpRight } from 'lucide-react';

const GradientShaderCard = React.lazy(() => import('../GradientShaderCard'));

const LabSection: React.FC = () => {
  const { t } = useI18n();

  const cards = [
    {
      icon: Orbit,
      title: t('lab.card1.title'),
      desc: t('lab.card1.desc'),
      gradient: 'from-blue-500/10 to-cyan-500/10',
      hoverGradient: 'group-hover:from-blue-500/20 group-hover:to-cyan-500/20',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      hoverBorderColor: 'group-hover:border-blue-500/40'
    },
    {
      icon: Brain,
      title: t('lab.card2.title'),
      desc: t('lab.card2.desc'),
      gradient: 'from-purple-500/10 to-pink-500/10',
      hoverGradient: 'group-hover:from-purple-500/20 group-hover:to-pink-500/20',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      hoverBorderColor: 'group-hover:border-purple-500/40'
    }
  ];

  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden" id="lab">
      {/* Top Divider with gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-[0.2em] mb-4">
              <span className="w-8 h-px bg-indigo-500/50" />
              {t('lab.subtitle')}
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
              {t('lab.main_title')}
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="max-w-md text-white/40 md:text-right leading-relaxed text-base"
          >
            {t('lab.main_desc')}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Featured Card */}
          <motion.div 
            className="group lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Suspense fallback={
              <div className="w-full h-[360px] lg:h-[440px] rounded-[2rem] bg-[#0f172a] animate-pulse flex items-center justify-center border border-white/5">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            }>
              <GradientShaderCard />
            </Suspense>
          </motion.div>

          {/* Side Cards */}
          <div className="flex flex-col gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                className="group flex-1 cursor-pointer"
              >
                <div className={`relative h-full p-6 rounded-2xl bg-gradient-to-br ${card.gradient} ${card.hoverGradient} border ${card.borderColor} ${card.hoverBorderColor} transition-all duration-500 overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)`,
                      backgroundSize: '20px 20px'
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                      <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                    
                    {/* Title with arrow */}
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-bold text-lg text-white group-hover:text-white/90 transition-colors">
                        {card.title}
                      </h5>
                      <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-white/40 leading-relaxed flex-1">
                      {card.desc}
                    </p>

                    {/* Hover Indicator */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-white/20 group-hover:text-white/40 transition-colors">
                      <span className="w-6 h-px bg-current" />
                      <span>Explore</span>
                    </div>
                  </div>

                  {/* Corner Glow */}
                  <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${card.gradient} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LabSection;
