
import React, { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: string;
  loadingClassName?: string;
  errorClassName?: string;
  priority?: boolean;
  sizes?: string;
}

const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  placeholder = '/placeholder.svg',
  fallback = '/placeholder.svg',
  className,
  loadingClassName,
  errorClassName,
  priority = false,
  sizes,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return; // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: priority ? '0px' : '100px' // Larger margin for non-priority images
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const currentSrc = !isIntersecting 
    ? placeholder 
    : hasError 
    ? fallback 
    : src;

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      onLoad={handleLoad}
      onError={handleError}
      className={cn(
        'transition-opacity duration-300',
        isLoading && 'animate-pulse bg-gray-200',
        isLoading && loadingClassName,
        hasError && errorClassName,
        className
      )}
      {...props}
    />
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
