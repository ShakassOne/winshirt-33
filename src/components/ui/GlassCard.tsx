
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  shine?: boolean;
  hover3D?: boolean;
}

const GlassCard = ({ 
  children, 
  className, 
  shine = false,
  hover3D = false,
  ...props 
}: GlassCardProps) => {
  const [transform, setTransform] = React.useState('');
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D) return;
    
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    
    // Make the effect more pronounced and responsive
    const rotateX = (y - 0.5) * 16; // Increased from 10 to 16
    const rotateY = (x - 0.5) * -16; // Increased from 10 to 16
    
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`);
  };
  
  const handleMouseLeave = () => {
    if (!hover3D) return;
    setTransform('');
  };
  
  return (
    <div
      className={cn(
        'glass-card', 
        className
      )}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
