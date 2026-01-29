'use client';

import { useI18n } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone, FiGithub } from 'react-icons/fi';
import { FaTelegramPlane } from 'react-icons/fa';

export function Contact() {
  const { t } = useI18n();

  return (
    <footer id="contact" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              {t('footer.ready.title.main')} <br />
              <span className="text-gradient">{t('footer.ready.title.sub')}</span>
            </h2>

            <div className="flex flex-col gap-6">
              <a
                href="https://t.me/younghustle45"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 text-xl hover:text-purple-400 transition-colors group"
              >
                <div className="p-4 rounded-full bg-white/5 group-hover:bg-purple-500/10 border border-white/10 transition-colors">
                  <FaTelegramPlane className="w-6 h-6" />
                </div>
                <span>Telegram: @younghustle45</span>
              </a>

              <a
                href="mailto:fear75412@gmail.com"
                className="flex items-center gap-4 text-xl hover:text-purple-400 transition-colors group"
              >
                 <div className="p-4 rounded-full bg-white/5 group-hover:bg-purple-500/10 border border-white/10 transition-colors">
                  <FiMail className="w-6 h-6" />
                </div>
                <span>fear75412@gmail.com</span>
              </a>

              <div className="flex items-center gap-4 text-xl text-gray-400">
                 <div className="p-4 rounded-full bg-white/5 border border-white/10">
                  <FiPhone className="w-6 h-6" />
                </div>
                <span>+420 737 500 587</span>
              </div>

               <div className="flex items-center gap-4 text-xl text-gray-400">
                 <div className="p-4 rounded-full bg-white/5 border border-white/10">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <span>Prague, Czechia</span>
              </div>
            </div>
          </div>

          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl rounded-full" />
             <form className="relative bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium mb-2 text-gray-400">Name</label>
                   <input type="text" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors" placeholder="John Doe" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-2 text-gray-400">Email</label>
                   <input type="email" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors" placeholder="john@example.com" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-2 text-gray-400">Message</label>
                   <textarea rows={4} className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors" placeholder="Hello..." />
                 </div>
                 <button type="button" className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-purple-50 transition-colors">
                   Send Message
                 </button>
               </div>
             </form>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© 2024 ArtemCV. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-white transition-colors">Github</a>
             <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
