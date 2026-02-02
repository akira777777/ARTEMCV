import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n';

interface MobileMenuItem {
  key: string;
  href: string;
  submenu?: MobileMenuItem[];
}

const navItems: MobileMenuItem[] = [
  { key: 'nav.home', href: '#home' },
  { key: 'nav.works', href: '#works' },
  { key: 'nav.lab', href: '#lab' },
  { key: 'nav.services', href: '#services' },
  { key: 'nav.about', href: '#studio' },
  { key: 'nav.contact', href: '#contact' },
];

const MobileMenuItemComponent: React.FC<{
  item: MobileMenuItem;
  onClick: (href: string) => void;
  depth?: number;
}> = ({ item, onClick, depth = 0 }) => {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.stopPropagation();
    if (item.submenu && item.submenu.length > 0) {
      setIsExpanded(!isExpanded);
    } else {
      onClick(href);
    }
  };

  return (
    <div className={depth > 0 ? 'ml-4' : ''}>
      <button
        onClick={(e) => handleClick(e, item.href)}
        className={`
          w-full text-left py-3 px-4 rounded-lg text-sm font-medium
          flex justify-between items-center
          hover:bg-white/10 hover:text-white transition-colors
          ${depth > 0 ? 'text-neutral-300' : 'text-white'}
        `}
      >
        <span>{t(item.key)}</span>
        {item.submenu && item.submenu.length > 0 && (
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        )}
      </button>
      
      {item.submenu && item.submenu.length > 0 && (
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {item.submenu.map((subItem, index) => (
                <MobileMenuItemComponent
                  key={index}
                  item={subItem}
                  onClick={onClick}
                  depth={depth + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLinkClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[#0a0a0a] z-50 shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                  <div className="text-xl font-display font-black tracking-tighter text-white">
                    ARTEM.DEV
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <nav aria-label="Mobile navigation">
                    <ul className="space-y-1">
                      {navItems.map((item, index) => (
                        <li key={item.key}>
                          <MobileMenuItemComponent
                            item={item}
                            onClick={handleLinkClick}
                          />
                        </li>
                      ))}
                    </ul>
                  </nav>
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="px-4">
                      <div className="text-sm text-neutral-400 mb-4">{t('nav.language')}</div>
                      {/* Языковой переключатель будет добавлен позже */}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-t border-white/10 text-center">
                  <div className="text-xs text-neutral-500">
                    © {new Date().getFullYear()} JULES.DEV
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};