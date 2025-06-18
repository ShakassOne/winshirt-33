
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Trash2, Move } from 'lucide-react';

interface ElementManipulationControlsProps {
  elementType: 'design' | 'text';
  transform: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  onTransformChange: (property: string, value: any) => void;
  onRemove: () => void;
  onDeselect: () => void;
}

export const ElementManipulationControls: React.FC<ElementManipulationControlsProps> = ({
  elementType,
  transform,
  onTransformChange,
  onRemove,
  onDeselect
}) => {
  const handleScaleChange = (delta: number) => {
    const newScale = Math.max(0.3, Math.min(3, transform.scale + delta));
    onTransformChange('scale', newScale);
  };

  const handleRotationChange = (delta: number) => {
    onTransformChange('rotation', transform.rotation + delta);
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-lg p-2 z-50">
      <div className="flex items-center gap-1">
        {/* Scale controls */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white hover:bg-white/20"
          onClick={() => handleScaleChange(-0.1)}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white hover:bg-white/20"
          onClick={() => handleScaleChange(0.1)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {/* Rotation controls */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white hover:bg-white/20"
          onClick={() => handleRotationChange(-15)}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white hover:bg-white/20"
          onClick={() => handleRotationChange(15)}
        >
          <RotateCw className="h-4 w-4" />
        </Button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/20 mx-1" />

        {/* Remove button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* Move indicator */}
        <div className="flex items-center gap-1 px-2 text-xs text-white/60">
          <Move className="h-3 w-3" />
          <span>Glisser</span>
        </div>
      </div>
      
      {/* Scale indicator */}
      <div className="text-center text-xs text-white/60 mt-1">
        {Math.round(transform.scale * 100)}% • {transform.rotation}°
      </div>
    </div>
  );
};
