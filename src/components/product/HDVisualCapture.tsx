
import React from 'react';

interface HDVisualCaptureProps {
  side: 'recto' | 'verso';
  children: React.ReactNode;
  className?: string;
}

export const HDVisualCapture: React.FC<HDVisualCaptureProps> = ({
  side,
  children,
  className = ''
}) => {
  return (
    <div
      id={`customization-${side}`}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        // Assurer que les éléments sont bien positionnés pour la capture
        transform: 'translateZ(0)', // Force hardware acceleration
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </div>
  );
};
