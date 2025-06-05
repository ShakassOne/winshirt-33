
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

    // Calculate center point for more stable scaling
    const element = (e.target as HTMLElement).closest('[style*="transform"]');
    const rect = element?.getBoundingClientRect();
    const centerX = rect ? rect.left + rect.width / 2 : startX;
    const centerY = rect ? rect.top + rect.height / 2 : startY;

    const handleMove = (moveEvent: TouchEvent | MouseEvent) => {
      const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const currentY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      
      // Calculate distance from center for more stable scaling
      const startDistance = Math.sqrt(Math.pow(startX - centerX, 2) + Math.pow(startY - centerY, 2));
      const currentDistance = Math.sqrt(Math.pow(currentX - centerX, 2) + Math.pow(currentY - centerY, 2));
      
      let scaleFactor = currentDistance / startDistance;
      
      // Apply corner-specific scaling direction
      if (corner === 'top-left' || corner === 'top-right') {
        scaleFactor = scaleFactor;
      }
      
      const newScale = Math.max(0.2, Math.min(3, startScale * scaleFactor));
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
      const newRotation = (startRotation + deltaX * 0.8) % 360;
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
      {/* Corner resize handles - much larger and more stable */}
      <div 
        className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-nw-resize flex items-center justify-center"
        onTouchStart={(e) => handleCornerDrag(e, 'top-left')}
        onMouseDown={(e) => handleCornerDrag(e, 'top-left')}
      >
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <div 
        className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-ne-resize flex items-center justify-center"
        onTouchStart={(e) => handleCornerDrag(e, 'top-right')}
        onMouseDown={(e) => handleCornerDrag(e, 'top-right')}
      >
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <div 
        className="absolute -bottom-3 -left-3 w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-sw-resize flex items-center justify-center"
        onTouchStart={(e) => handleCornerDrag(e, 'bottom-left')}
        onMouseDown={(e) => handleCornerDrag(e, 'bottom-left')}
      >
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <div 
        className="absolute -bottom-3 -right-3 w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-se-resize flex items-center justify-center"
        onTouchStart={(e) => handleCornerDrag(e, 'bottom-right')}
        onMouseDown={(e) => handleCornerDrag(e, 'bottom-right')}
      >
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>

      {/* Rotation handle - larger */}
      <div 
        className="absolute -top-12 right-0 w-10 h-10 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
        onTouchStart={handleRotationDrag}
        onMouseDown={handleRotationDrag}
      >
        <RotateCw className="h-5 w-5 text-white" />
      </div>

      {/* Delete handle - larger */}
      <div className="absolute -top-12 left-0">
        <Button
          size="sm"
          variant="outline"
          className="h-10 w-10 p-0 bg-red-500 border-red-500 text-white rounded-full shadow-lg"
          onClick={onDelete}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Move indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <Move className="h-8 w-8 text-white/60" />
      </div>
    </>
  );
};
