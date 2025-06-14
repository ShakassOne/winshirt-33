import logger from '@/utils/logger';

import React, { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({ 
  size = 'md', 
  text = 'Chargement...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  React.useEffect(() => {
    logger.log(`[LoadingSpinner] Rendered with text: ${text}`);
  }, [text]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin ${sizeClasses[size]} border-4 border-blue-500 border-t-transparent rounded-full`}></div>
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
