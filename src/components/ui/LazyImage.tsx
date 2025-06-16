
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: string;
  loadingClassName?: string;
  errorClassName?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = '/placeholder.svg',
  fallback = '/placeholder.svg',
  className,
  loadingClassName,
  errorClassName,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      onLoad={handleLoad}
      onError={handleError}
      className={cn(
        'transition-opacity duration-300',
        isLoading && loadingClassName,
        hasError && errorClassName,
        className
      )}
      {...props}
    />
  );
};

export default LazyImage;
