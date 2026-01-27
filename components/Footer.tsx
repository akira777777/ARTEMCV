
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-24 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="flex items-center space-x-6 p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Astra" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed italic">
                Full Stack разработчик с опытом в сложных веб-приложениях. Специализация: React, Node.js, PostgreSQL, AI-интеграции. Помогу воплотить идею в production.
              </p>
            </div>
            
            <div className="flex space-x-12">
              <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>

          <div className="space-y-12 md:text-right">
            <h2 className="text-4xl md:text-6xl font-serif">Готов к <br /> <span className="italic text-zinc-500 text-3xl md:text-5xl">сотрудничеству.</span></h2>
            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} Artem Mikhailov &bull; Full Stack Developer
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
