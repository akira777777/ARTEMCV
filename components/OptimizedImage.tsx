import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { checkWebPSupport } from '../lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image Component with WebP support and responsive loading
 * Implements performance optimizations like:
 * - WebP format with fallback to original format
 * - Lazy loading with intersection observer
 * - Loading states and error handling
 * - Blur-up technique for smoother loading
 * - Advanced caching strategies
 */
const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
  src,
  alt,
  className = '',
  width,
  height,
  sizes,
  priority = false,
  placeholder = 'empty',
  onLoad,
  onError
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const internalImgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the forwarded ref or fall back to internal ref
  useImperativeHandle(ref, () => internalImgRef.current!, [internalImgRef]);

  // Determine WebP version of image if available
  const getWebPSrc = (originalSrc: string): string => {
    if (originalSrc.endsWith('.webp')) {
      return originalSrc; // Already WebP
    }
    
    const webpVersion = originalSrc.replace(/\.(png|jpe?g)$/i, '.webp');
    return webpVersion;
  };

  // Extract low-quality placeholder from original src (if available)
  const getLQIPSrc = (originalSrc: string): string => {
    // Look for _lqip or _thumb variants in the filename
    const lqipMatch = originalSrc.replace(/(\.[^.]+)$/, '_lqip$1');
    return lqipMatch;
  };

  // Transparent 1x1 pixel GIF to prevent empty src warnings during lazy loading
  const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  
  // Check if browser supports WebP using centralized utility
  const [supportsWebP, setSupportsWebP] = useState(true);
  
  const webpSrc = getWebPSrc(src);
  const lqipSrc = getLQIPSrc(src);
  const [currentSrc, setCurrentSrc] = useState<string>(priority ? src : TRANSPARENT_PIXEL); // Don't load non-priority images until in viewport
  const [lqipLoaded, setLqipLoaded] = useState(false);

  useEffect(() => {
    checkWebPSupport().then(setSupportsWebP);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Preload image to trigger loading
          const img = new Image();
          img.src = supportsWebP ? webpSrc : src;
          
          setCurrentSrc(supportsWebP ? webpSrc : src);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '200px' } // Start loading 200px before entering viewport for better UX
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority, supportsWebP, webpSrc, src]);

  // Initialize source for priority images
  useEffect(() => {
    if (priority) {
      setCurrentSrc(supportsWebP ? webpSrc : src);
    }
  }, [priority, supportsWebP, webpSrc, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    
    // Fallback to original image if WebP failed
    if (supportsWebP && src !== currentSrc) {
      setCurrentSrc(src);
    } else {
      onError?.();
    }
  };

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`;

  // Placeholder while loading
  const renderPlaceholder = () => {
    if (placeholder === 'empty') {
      return null;
    }

    // If we have a low-quality placeholder, use it
    if (lqipSrc && !lqipLoaded) {
      return (
        <img
          src={lqipSrc}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover blur-sm ${className}`}
          style={{ width, height }}
          loading="eager"
          onLoad={() => setLqipLoaded(true)}
          onError={() => setLqipLoaded(true)} // Proceed with main image if LQIP fails
        />
      );
    }

    return (
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {isLoading && renderPlaceholder()}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <span className="text-gray-400 text-sm">Image failed to load</span>
        </div>
      ) : currentSrc ? (
        <picture className="block w-full h-full">
          {supportsWebP && (
            <source 
              srcSet={currentSrc} 
              type="image/webp" 
              sizes={responsiveSizes}
            />
          )}
          <img
            ref={internalImgRef}
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            sizes={responsiveSizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={`block w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      ) : null}
      
      {isLoading && !lqipLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;