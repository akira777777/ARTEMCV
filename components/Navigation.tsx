import React, { useState, useEffect, useRef } from 'react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'HOME', href: '#home' },
  { label: 'WORKS', href: '#works' },
  { label: 'SERVICES', href: '#services' },
  { label: 'ABOUT', href: '#studio' },
  { label: 'CONTACT', href: '#contact' },
];

export const Navigation: React.FC = () => {
  const [active, setActive] = useState('HOME');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Cancel any pending animation frame to prevent multiple updates
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Determine scroll direction and toggle visibility
        if (currentScrollY < 50) {
          setIsVisible(true); // Always show at top
        } else if (currentScrollY > lastScrollYRef.current) {
          setIsVisible(false); // Hide when scrolling down
        } else {
          setIsVisible(true); // Show when scrolling up
        }
        lastScrollYRef.current = currentScrollY;

        // Active Link Logic
        for (const item of navItems) {
          const sectionId = item.href.substring(1);
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Adjust detection zone for top header
            if (rect.top >= -100 && rect.top <= 300) {
              setActive(item.label);
              break; // Exit early once active section is found
            }
          }
        }

        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActive(navItems.find(item => item.href === href)?.label || '');
    }
  };

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
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
              ARTEM.DEV
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-indigo-500 transition-colors" />
          </a>

          {/* Desktop Nav */}
          <ul className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className={`
                    px-4 py-2 rounded-lg text-xs font-bold tracking-widest transition-all duration-300
                    ${active === item.label 
                      ? 'bg-white text-black' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/10'}
                  `}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};