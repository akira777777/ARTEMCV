import React, { useState, useEffect, useRef, useCallback } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Enhanced LazyLoad component with performance optimizations
 * Features:
 * - Intersection Observer for efficient viewport detection
 * - Memory efficient implementation
 * - SSR-friendly
 * - Configurable threshold and margins
 */
export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  className = '',
  fallback = null,
  threshold = 0.1,
  rootMargin = '0px',
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const createObserver = useCallback(() => {
    if (!elementRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            setHasBeenVisible(true);
            observerRef.current?.disconnect();
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(elementRef.current);
  }, [threshold, rootMargin, once]);

  useEffect(() => {
    if (hasBeenVisible || once) return;

    if ('IntersectionObserver' in window) {
      createObserver();
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      setIsVisible(true);
      setHasBeenVisible(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [createObserver, hasBeenVisible, once]);

  useEffect(() => {
    if (!once && isVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible, once]);

  // Preload resources when component is near viewport
  useEffect(() => {
    if (isVisible && elementRef.current) {
      // Preload images within the component
      const images = elementRef.current.querySelectorAll('img[data-src]');
      images.forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.setAttribute('src', src);
          img.removeAttribute('data-src');
        }
      });
    }
  }, [isVisible]);

  return (
    <div ref={elementRef} className={className}>
      {(isVisible || hasBeenVisible) ? children : fallback}
    </div>
  );
};

/**
 * LazyLoadImage - Specialized lazy loader for images with WebP support
 */
interface LazyLoadImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  priority?: boolean;
  width?: number;
  height?: number;
}

export const LazyLoadImage: React.FC<LazyLoadImageProps> = ({
  src,
  alt,
  className = '',
  fallback = null,
  priority = false,
  width,
  height
}) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Determine if browser supports WebP
  const supportsWebP = typeof window !== 'undefined' && 
    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;

  // Construct WebP version of image
  const webpSrc = supportsWebP ? src.replace(/\.(png|jpe?g)$/i, '.webp') : src;

  return (
    <LazyLoad 
      fallback={fallback}
      threshold={priority ? 0 : 0.2}
      once={true}
    >
      <picture className={className}>
        {supportsWebP && (
          <source srcSet={webpSrc} type="image/webp" />
        )}
        <img
          src={supportsWebP ? webpSrc : src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </picture>
      {hasError && (
        <div className="flex items-center justify-center w-full h-full bg-gray-800">
          <span className="text-gray-400">Image failed to load</span>
        </div>
      )}
    </LazyLoad>
  );
};