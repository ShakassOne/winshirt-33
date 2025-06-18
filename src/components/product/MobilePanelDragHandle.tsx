
import React, { useState, useCallback } from 'react';
import { GripHorizontal } from 'lucide-react';

interface MobilePanelDragHandleProps {
  onHeightChange: (height: number) => void;
  minHeight?: number;
  maxHeight?: number;
  currentHeight: number;
}

export const MobilePanelDragHandle: React.FC<MobilePanelDragHandleProps> = ({
  onHeightChange,
  minHeight = 120,
  maxHeight = 400,
  currentHeight
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const handleStart = useCallback((clientY: number) => {
    setIsDragging(true);
    setStartY(clientY);
    setStartHeight(currentHeight);
    document.body.style.userSelect = 'none';
  }, [currentHeight]);

  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    
    const deltaY = startY - clientY; // Inverse pour que tirer vers le haut augmente la hauteur
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
    onHeightChange(newHeight);
  }, [isDragging, startY, startHeight, minHeight, maxHeight, onHeightChange]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  }, []);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientY);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleStart(e.touches[0].clientY);
  };

  // Global event listeners
  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div 
      className={`flex justify-center items-center py-2 cursor-grab active:cursor-grabbing ${
        isDragging ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
      } transition-colors`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="flex flex-col items-center gap-1">
        <GripHorizontal className="h-4 w-4 text-white/60" />
        <div className="flex gap-1">
          <div className="w-8 h-1 bg-white/40 rounded-full"></div>
          <div className="w-8 h-1 bg-white/40 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
