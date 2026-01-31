import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

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

  const webpSrc = getWebPSrc(src);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : ''); // Don't load non-priority images until in viewport

  // Check if browser supports WebP
  const [supportsWebP, setSupportsWebP] = useState(true); // Assume true by default

  useEffect(() => {
    // Detect WebP support
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      setSupportsWebP(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentSrc(supportsWebP ? webpSrc : src);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '100px' } // Start loading 100px before entering viewport
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
      ) : (
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
            className={`block w-full h-full object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      )}
      
      {isLoading && (
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