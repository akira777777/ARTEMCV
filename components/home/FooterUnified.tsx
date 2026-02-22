import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Twitter, Heart } from 'lucide-react';
import { Text } from '../ui/Typography';
import { useSmoothScroll } from '../../hooks/useScrollProgress';

/**
 * Footer Navigation Links
 */
const footerLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Works', href: '#works' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
];

/**
 * Unified Footer Component
 */
export const FooterUnified: React.FC = () => {
  const { scrollTo } = useSmoothScroll();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a]">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a href="#home" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">
                Artem<span className="text-emerald-400">.</span>
              </span>
            </a>
            <Text size="sm" color="tertiary" className="max-w-xs">
              Full-stack developer crafting modern web experiences with clean
              code and thoughtful design.
            </Text>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href, 80)}
                    className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <Text size="sm" color="muted">
            © {currentYear} Artem Mikhailov. All rights reserved.
          </Text>
          
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using React & Tailwind
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={() => scrollTo(0)}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center z-50 hover:bg-emerald-400 transition-colors"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};

export default FooterUnified;
