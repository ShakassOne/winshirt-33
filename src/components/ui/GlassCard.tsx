
import React from 'react';
import { motion } from 'framer-motion';
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
    
    // Make the effect more pronounced and responsive with immediate response
    const rotateX = (y - 0.5) * 20; // Increased from 16 to 20
    const rotateY = (x - 0.5) * -20; // Increased from 16 to 20
    
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`);
  };
  
  const handleMouseLeave = () => {
    if (!hover3D) return;
    setTransform('');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'glass-card',
        !hover3D && 'transition-all duration-300', // Only add transition when not in hover3D mode
        className
      )}
      style={{
        transform,
        transition: hover3D ? 'none' : 'all 0.3s ease' // Remove transition for hover3D for immediate responsiveness
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
