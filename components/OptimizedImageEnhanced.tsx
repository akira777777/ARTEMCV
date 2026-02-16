import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLogger } from '../lib/logger-enhanced';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  sizes?: string;
  srcSet?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  blurDataURL?: string;
  fill?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  objectPosition?: string;
  transition?: boolean;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Enhanced Optimized Image Component
 * 
 * Advanced image optimization with lazy loading, format detection,
 * progressive enhancement, and performance monitoring.
 */
export const OptimizedImageEnhanced: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  onLoad,
  onError,
  priority = false,
  sizes,
  srcSet,
  loading = 'lazy',
  width,
  height,
  quality = 75,
  format = 'auto',
  blurDataURL,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  transition = true,
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const { logger } = useLogger('OptimizedImage');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Performance monitoring
  const loadStartTime = useRef<number>(0);
  const loadEndTime = useRef<number>(0);

  // Format detection and optimization
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    if (!originalSrc) return '';
    
    // If srcSet is provided, use it directly
    if (srcSet) return originalSrc;

    // Add optimization parameters based on format preference
    const url = new URL(originalSrc, window.location.origin);
    url.searchParams.set('q', quality.toString());
    url.searchParams.set('w', width ? width.toString() : 'auto');
    url.searchParams.set('h', height ? height.toString() : 'auto');

    if (format !== 'auto') {
      url.searchParams.set('f', format);
    }

    return url.toString();
  }, [srcSet, quality, width, height, format]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const imgElement = imgRef.current;
    if (!imgElement) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(imgElement);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, isInView, threshold, rootMargin]);

  // Handle image loading
  const handleLoad = useCallback(() => {
    loadEndTime.current = performance.now();
    const loadTime = loadEndTime.current - loadStartTime.current;
    
    setIsLoaded(true);
    setHasError(false);
    
    // Performance logging
    logger.debug(`Image loaded: ${src}`, { loadTime: parseFloat(loadTime.toFixed(2)) });

    onLoad?.();
  }, [src, onLoad, logger]);

  // Handle image error
  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Set up image source when in view
  useEffect(() => {
    if (!isInView || hasError) return;

    const optimizedSrc = getOptimizedSrc(src);
    setCurrentSrc(optimizedSrc);
    loadStartTime.current = performance.now();
  }, [isInView, src, getOptimizedSrc, hasError]);

  // Progressive enhancement for placeholder
  const renderPlaceholder = () => {
    if (blurDataURL && !isLoaded) {
      return (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: objectPosition
          }}
        />
      );
    }

    if (placeholder && !isLoaded) {
      return <div className="absolute inset-0">{placeholder}</div>;
    }

    return null;
  };

  // Image styles
  const imageStyles = {
    width: fill ? '100%' : (width || 'auto'),
    height: fill ? '100%' : (height || 'auto'),
    objectFit,
    objectPosition,
    transition: transition ? 'opacity 0.3s ease-in-out' : 'none'
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={fill ? { position: 'relative', width: '100%', height: '100%' } : {}}
    >
      {/* Placeholder */}
      {renderPlaceholder()}

      {/* Actual Image */}
      {isInView && currentSrc && !hasError && (
        <motion.img
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${fill ? 'absolute inset-0 w-full h-full' : ''}`}
          style={imageStyles}
          sizes={sizes}
          loading={priority ? 'eager' : loading}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.05 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          draggable={false}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

/**
 * Image Gallery Component with advanced optimization
 */
export const ImageGallery: React.FC<{
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
  }>;
  columns?: number;
  gap?: string;
  priorityFirst?: boolean;
}> = ({
  images,
  columns = 3,
  gap = '1rem',
  priorityFirst = true
}) => {
  const [visibleImages, setVisibleImages] = useState(new Set<number>());

  const handleImageLoad = (index: number) => {
    setVisibleImages(prev => new Set([...prev, index]));
  };

  const getGridColumns = () => {
    if (typeof window === 'undefined') return columns;
    
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    return columns;
  };

  return (
    <div 
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${getGridColumns()}, minmax(0, 1fr))`,
        gap
      }}
    >
      {images.map((image, index) => (
        <OptimizedImageEnhanced
          key={index}
          {...image}
          priority={priorityFirst && index === 0}
          onLoad={() => handleImageLoad(index)}
          className={`rounded-lg overflow-hidden shadow-lg ${
            visibleImages.has(index) ? 'animate-in slide-in-from-bottom-2 duration-500' : ''
          }`}
        />
      ))}
    </div>
  );
};

/**
 * Background Image Component with optimization
 */
export const BackgroundImage: React.FC<{
  src: string;
  alt?: string;
  className?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  position?: string;
  size?: string;
  repeat?: string;
  priority?: boolean;
}> = ({
  src,
  alt = '',
  className = '',
  overlay = false,
  overlayColor = 'black',
  overlayOpacity = 0.5,
  position = 'center',
  size = 'cover',
  repeat = 'no-repeat',
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div 
      className={`relative ${className}`}
      style={{
        backgroundImage: isLoaded && !hasError ? `url(${src})` : 'none',
        backgroundPosition: position,
        backgroundSize: size,
        backgroundRepeat: repeat,
        backgroundColor: hasError ? '#f3f4f6' : 'transparent'
      }}
    >
      {/* Fallback content when image fails to load */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <span className="material-symbols-outlined text-6xl">image_not_supported</span>
        </div>
      )}

      {/* Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity
          }}
        />
      )}

      {/* Hidden image for loading */}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className="hidden"
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};

export default OptimizedImageEnhanced;