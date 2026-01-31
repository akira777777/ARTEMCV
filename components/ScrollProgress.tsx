import React, { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from '../lib/hooks';

const ScrollProgress: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
        setProgress(Math.min(1, Math.max(0, scrollProgress)));
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
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left"
      style={{
        background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #ec4899)',
        width: `${progress * 100}%`,
        transition: 'width 0.1s ease-out',
        boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
      }}
    />
  );
};

export default React.memo(ScrollProgress);
