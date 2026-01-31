import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { NavItem } from '../types';
import { useReducedMotion } from '../lib/hooks';
import LanguageSwitcher from './LanguageSwitcher';

const navItems: NavItem[] = [
  { label: 'HOME', href: '#home' },
  { label: 'WORKS', href: '#works' },
  { label: 'SERVICES', href: '#services' },
  { label: 'ABOUT', href: '#studio' },
  { label: 'CONTACT', href: '#contact' },
];

// Memoized nav item component
const NavLink = React.memo<{
  item: NavItem;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}>(({ item, isActive, onClick }) => (
  <li key={item.label}>
    <a
      href={item.href}
      onClick={(e) => onClick(e, item.href)}
      className={`
        px-4 py-2 rounded-lg text-xs font-bold tracking-widest transition-all duration-300
        ${isActive 
          ? 'bg-white text-black' 
          : 'text-neutral-400 hover:text-white hover:bg-white/10'}
      `}
    >
      {item.label}
    </a>
  </li>
));

export const Navigation: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState('HOME');
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
        setActive(item.label);
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
      setActive(navItems.find(item => item.href === href)?.label || '');
    }
  }, []);

  // Memoize nav items to prevent unnecessary re-renders
  const navLinks = useMemo(() => 
    navItems.map(item => (
      <NavLink 
        key={item.label}
        item={item}
        isActive={active === item.label}
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
        <nav className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 flex justify-between items-center shadow-2xl">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleLinkClick(e, '#home')}
            className="flex items-center gap-2 group"
          >
            <span className="text-xl font-display font-black tracking-tighter text-white group-hover:text-neutral-400 transition-colors">
              JULES.ENGINEER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-indigo-500 transition-colors" />
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
};
