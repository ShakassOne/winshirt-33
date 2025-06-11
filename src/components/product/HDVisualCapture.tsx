
import React from 'react';

interface HDVisualCaptureProps {
  side: 'recto' | 'verso';
  children: React.ReactNode;
  className?: string;
  hasContent?: boolean;
}

export const HDVisualCapture: React.FC<HDVisualCaptureProps> = ({
  side,
  children,
  className = '',
  hasContent = false
}) => {
  const elementId = `customization-${side}`;
  
  return (
    <div
      id={elementId}
      data-side={side === 'recto' ? 'front' : 'back'}
      data-has-content={hasContent}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        // Assurer que les éléments sont bien positionnés pour la capture
        transform: 'translateZ(0)', // Force hardware acceleration
        backfaceVisibility: 'hidden',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        // Éviter les problèmes de rendu
        WebkitTransform: 'translateZ(0)',
        willChange: 'transform'
      }}
    >
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  );
};
