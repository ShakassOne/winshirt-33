
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <div className="animated-button-wrapper">
      <div className="animated-button-bg" />
      <button 
        className={cn("animated-button", className)} 
        {...props}
      >
        {children}
      </button>
    </div>
  );
};
