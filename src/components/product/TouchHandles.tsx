
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw, Trash2, Move } from 'lucide-react';

interface TouchHandlesProps {
  onResize: (scale: number) => void;
  onRotate: (rotation: number) => void;
  onDelete: () => void;
  currentScale: number;
  currentRotation: number;
  elementType: 'design' | 'text';
}

export const TouchHandles: React.FC<TouchHandlesProps> = ({
  onResize,
  onRotate,
  onDelete,
  currentScale,
  currentRotation,
  elementType
}) => {
  const handleCornerDrag = (e: React.TouchEvent | React.MouseEvent, corner: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startTouches = 'touches' in e ? e.touches : null;
    const startX = startTouches ? startTouches[0].clientX : (e as React.MouseEvent).clientX;
    const startY = startTouches ? startTouches[0].clientY : (e as React.MouseEvent).clientY;
    const startScale = currentScale;

    const handleMove = (moveEvent: TouchEvent | MouseEvent) => {
      const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const scaleFactor = corner.includes('bottom') || corner.includes('right') ? 1 : -1;
      
      const newScale = Math.max(0.3, Math.min(2, startScale + (distance * scaleFactor * 0.01)));
      onResize(newScale);
    };

    const handleEnd = () => {
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    };

    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
  };

  const handleRotationDrag = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startTouches = 'touches' in e ? e.touches : null;
    const startX = startTouches ? startTouches[0].clientX : (e as React.MouseEvent).clientX;
    const startRotation = currentRotation;

    const handleMove = (moveEvent: TouchEvent | MouseEvent) => {
      const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const deltaX = currentX - startX;
      const newRotation = (startRotation + deltaX * 0.5) % 360;
      onRotate(newRotation);
    };

    const handleEnd = () => {
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    };

    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
  };

  return (
    <>
      {/* Corner resize handles - larger and easier to touch */}
      <div 
        className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-nw-resize"
        onTouchStart={(e) => handleCornerDrag(e, 'top-left')}
        onMouseDown={(e) => handleCornerDrag(e, 'top-left')}
      />
      <div 
        className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-ne-resize"
        onTouchStart={(e) => handleCornerDrag(e, 'top-right')}
        onMouseDown={(e) => handleCornerDrag(e, 'top-right')}
      />
      <div 
        className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-sw-resize"
        onTouchStart={(e) => handleCornerDrag(e, 'bottom-left')}
        onMouseDown={(e) => handleCornerDrag(e, 'bottom-left')}
      />
      <div 
        className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-se-resize"
        onTouchStart={(e) => handleCornerDrag(e, 'bottom-right')}
        onMouseDown={(e) => handleCornerDrag(e, 'bottom-right')}
      />

      {/* Rotation handle */}
      <div 
        className="absolute -top-10 right-0 w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
        onTouchStart={handleRotationDrag}
        onMouseDown={handleRotationDrag}
      >
        <RotateCw className="h-4 w-4 text-white" />
      </div>

      {/* Delete handle */}
      <div className="absolute -top-10 left-0">
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 bg-red-500 border-red-500 text-white rounded-full shadow-lg"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Move indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Move className="h-6 w-6 text-white/60" />
      </div>
    </>
  );
};
