
import React from 'react';
import { useI18n } from '../i18n';

const Footer: React.FC = () => {
  const { t } = useI18n();
  return (
    <footer id="contact" className="border-t border-white/5 py-24 px-6 lg:px-12 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div className="flex items-center space-x-6 p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden">
                <img src="/avatar.jpg" alt="Artem Mikhailov" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-zinc-500 leading-relaxed italic">
                  Full Stack разработчик. React, TypeScript, Node.js, PostgreSQL, AI-интеграции. Базируюсь: Прага, Чехия.
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Доступен к сотрудничеству и консультациям.</p>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">{t('footer.contacts')}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <a href="https://t.me/younghustle45" target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors">
                  {t('contacts.telegram')}
                </a>
                <a href="mailto:fear75412@gmail.com" className="px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors">
                  {t('contacts.email')}
                </a>
                <a href="tel:+420737500587" className="px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors">
                  {t('contacts.phone')}
                </a>
                <div className="px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-300">
                  {t('contacts.location')}
                </div>
                <a href="https://github.com/akira777777" target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors">
                  {t('contacts.github')}
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-12 md:text-right">
            <h2 className="text-4xl md:text-6xl font-serif">{t('footer.ready.title.main')} <br /> <span className="italic text-zinc-500 text-3xl md:text-5xl">{t('footer.ready.title.sub')}</span></h2>
            <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} Artem Mikhailov &bull; {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
