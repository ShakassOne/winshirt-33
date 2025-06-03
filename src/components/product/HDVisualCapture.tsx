
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
        backfaceVisibility: 'hidden',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
      }}
    >
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  );
};
