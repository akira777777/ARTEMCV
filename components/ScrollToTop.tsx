import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop: React.FC = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const toggleVisibility = () => {
      // Cancel any pending animation frame to prevent multiple updates
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        if (window.scrollY > window.innerHeight) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className={`fixed bottom-8 left-8 z-50 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <button
        onClick={scrollToTop}
        className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(99,102,241,0.8)] hover:scale-110 transition-all duration-300 border-2 border-indigo-400/30"
        aria-label="Scroll to top"
      >
        <ArrowUp size={22} className="animate-pulse" />
      </button>
    </div>
  );
});

ScrollToTop.displayName = 'ScrollToTop';
