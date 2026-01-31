import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useReducedMotion } from '../lib/hooks';
import LanguageSwitcher from './LanguageSwitcher';
import { useI18n } from '../i18n';

const navItems: { key: string; href: string }[] = [
  { key: 'nav.home', href: '#home' },
  { key: 'nav.works', href: '#works' },
  { key: 'nav.lab', href: '#lab' },
  { key: 'nav.services', href: '#services' },
  { key: 'nav.about', href: '#studio' },
  { key: 'nav.contact', href: '#contact' },
];

// Memoized nav item component
const NavLink = React.memo<{
  item: { key: string; href: string };
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}>(({ item, isActive, onClick }) => {
  const { t } = useI18n();
  return (
    <li key={item.key}>
      <a
        href={item.href}
        onClick={(e) => onClick(e, item.href)}
        className={`
          px-4 py-2 rounded-xl text-xs font-bold tracking-widest transition-all duration-300
          ${isActive
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
            : 'text-neutral-400 hover:text-white hover:bg-white/10 hover:scale-105'}
        `}
      >
        {t(item.key)}
      </a>
    </li>
  );
});

NavLink.displayName = 'NavLink';

export const Navigation: React.FC = React.memo(() => {
  const { t } = useI18n();
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState('nav.home');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const sectionCacheRef = useRef<Map<string, HTMLElement | null>>(new Map());

  // Cache section elements on mount
  useEffect(() => {
    navItems.forEach(item => {
      sectionCacheRef.current.set(item.href, document.getElementById(item.href.substring(1)));
    });
  }, []);

  // Optimize scroll detection with debouncing
  const updateActiveSection = useCallback(() => {
    for (const item of navItems) {
      const element = sectionCacheRef.current.get(item.href);
      if (!element) continue;
      
      const rect = element.getBoundingClientRect();
      if (rect.top >= -100 && rect.top <= 300) {
        setActive(item.key);
        break;
      }
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      // Update visibility
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollYRef.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollYRef.current = currentScrollY;

      // Update active section
      updateActiveSection();
      rafRef.current = null;
    });
  }, [updateActiveSection]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActive(navItems.find(item => item.href === href)?.key || '');
    }
  }, []);

  // Memoize nav items to prevent unnecessary re-renders
  const navLinks = useMemo(() => 
    navItems.map(item => (
      <NavLink 
        key={item.key}
        item={item}
        isActive={active === item.key}
        onClick={handleLinkClick}
      />
    )),
    [active, handleLinkClick]
  );

  const transitionClass = prefersReducedMotion ? '' : 'transition-all duration-500 ease-in-out';

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 ${transitionClass}
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
      `}
    >
      <div className="mx-4 mt-4 md:mx-8 md:mt-6">
        <nav className="bg-gradient-to-r from-neutral-900/90 via-neutral-900/95 to-neutral-900/90 backdrop-blur-xl border border-white/20 rounded-3xl px-6 py-4 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_48px_rgba(99,102,241,0.2)] transition-shadow duration-300">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleLinkClick(e, '#home')}
            className="flex items-center gap-2 group"
            aria-label={`${t('brand.vision')} - ${t('nav.home')}`}
          >
            <span className="text-xl font-display font-black tracking-tighter text-white group-hover:text-neutral-400 transition-colors">
              JULES.ENGINEER
            </span>
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.8)] transition-all duration-300 animate-pulse" />
          </a>

          {/* Desktop Nav */}
          <div className="flex items-center gap-4 md:gap-8">
            <ul className="flex items-center gap-1 md:gap-2">
              {navLinks}
            </ul>
            <div className="hidden sm:block h-4 w-px bg-white/10" />
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
});

Navigation.displayName = 'Navigation';
