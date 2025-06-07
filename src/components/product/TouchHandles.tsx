
import React, { useCallback } from 'react';
import { RotateCcw, Move, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface TouchHandlesProps {
  onScale: (delta: number) => void;
  onRotate: (delta: number) => void;
  onMove: (deltaX: number, deltaY: number) => void;
  className?: string;
}

export const TouchHandles: React.FC<TouchHandlesProps> = ({
  onScale,
  onRotate,
  onMove,
  className = ''
}) => {
  // Use mouse events and touch events without preventDefault to avoid passive listener issues
  const handleScaleUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onScale(0.1);
  }, [onScale]);

  const handleScaleDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onScale(-0.1);
  }, [onScale]);

  const handleRotateLeft = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onRotate(-15);
  }, [onRotate]);

  const handleRotateRight = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onRotate(15);
  }, [onRotate]);

  return (
    <div className={`flex items-center gap-1 bg-black/80 rounded-lg p-1 ${className}`}>
      <button
        className="p-1 text-white hover:bg-white/20 rounded"
        onMouseDown={handleScaleDown}
        onTouchStart={handleScaleDown}
      >
        <ZoomOut className="h-3 w-3" />
      </button>
      
      <button
        className="p-1 text-white hover:bg-white/20 rounded"
        onMouseDown={handleScaleUp}
        onTouchStart={handleScaleUp}
      >
        <ZoomIn className="h-3 w-3" />
      </button>
      
      <button
        className="p-1 text-white hover:bg-white/20 rounded"
        onMouseDown={handleRotateLeft}
        onTouchStart={handleRotateLeft}
      >
        <RotateCcw className="h-3 w-3" />
      </button>
      
      <button
        className="p-1 text-white hover:bg-white/20 rounded"
        onMouseDown={handleRotateRight}
        onTouchStart={handleRotateRight}
      >
        <RotateCw className="h-3 w-3" />
      </button>
      
      <div className="p-1 text-white">
        <Move className="h-3 w-3" />
      </div>
    </div>
  );
};
