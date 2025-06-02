
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
  const handleScaleChange = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(2, currentScale + delta));
    onResize(newScale);
  };

  const handleRotationChange = (delta: number) => {
    const newRotation = (currentRotation + delta) % 360;
    onRotate(newRotation);
  };

  return (
    <>
      {/* Scale handles */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 bg-blue-500 border-blue-500 text-white rounded-full shadow-lg"
          onClick={() => handleScaleChange(-0.1)}
        >
          -
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 bg-blue-500 border-blue-500 text-white rounded-full shadow-lg"
          onClick={() => handleScaleChange(0.1)}
        >
          +
        </Button>
      </div>

      {/* Rotation handle */}
      <div className="absolute -top-8 -right-8">
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 bg-green-500 border-green-500 text-white rounded-full shadow-lg"
          onClick={() => handleRotationChange(15)}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Delete handle */}
      <div className="absolute -top-8 -left-8">
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

      {/* Corner indicators for better visibility */}
      <div className="absolute -top-1 -left-1 w-3 h-3 bg-white/80 rounded-full border-2 border-blue-500"></div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/80 rounded-full border-2 border-blue-500"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white/80 rounded-full border-2 border-blue-500"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white/80 rounded-full border-2 border-blue-500"></div>
    </>
  );
};
