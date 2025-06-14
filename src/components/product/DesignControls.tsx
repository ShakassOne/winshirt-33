
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Design } from '@/types/supabase.types';

interface DesignControlsProps {
  selectedDesign: Design | null;
  designTransform: { position: { x: number; y: number }; scale: number; rotation: number };
  selectedSize: string;
  onDesignTransformChange: (property: string, value: any) => void;
  onSizeChange: (size: string) => void;
  compact?: boolean;
}

export const DesignControls: React.FC<DesignControlsProps> = ({
  selectedDesign,
  designTransform,
  selectedSize,
  onDesignTransformChange,
  onSizeChange,
  compact = false
}) => {
  if (!selectedDesign) {
    return (
      <div className="text-center py-4 text-white/50 text-xs">
        Aucun design sélectionné
      </div>
    );
  }

  const sizeOptions = [
    { value: 'XS', label: 'XS (10cm)' },
    { value: 'S', label: 'S (15cm)' },
    { value: 'M', label: 'M (20cm)' },
    { value: 'L', label: 'L (25cm)' },
    { value: 'XL', label: 'XL (30cm)' },
    { value: 'A4', label: 'A4 (21x29cm)' }
  ];

  if (compact) {
    return (
      <div className="space-y-2 border-t border-white/20 pt-2">
        <div className="flex items-center justify-between">
          <Label className="text-white text-xs">Design: {selectedDesign.name}</Label>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onDesignTransformChange('scale', Math.max(0.5, designTransform.scale - 0.1))}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onDesignTransformChange('scale', Math.min(2, designTransform.scale + 0.1))}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onDesignTransformChange('rotation', designTransform.rotation - 15)}
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onDesignTransformChange('rotation', designTransform.rotation + 15)}
            >
              <RotateCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div>
          <Label className="text-white text-xs">Taille</Label>
          <Select value={selectedSize} onValueChange={onSizeChange}>
            <SelectTrigger className="w-full bg-white/10 border-white/20 text-white h-6 text-xs mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 border-t border-white/20 pt-4">
      <div>
        <h4 className="text-sm font-medium text-white mb-2">
          Design sélectionné: {selectedDesign.name}
        </h4>
      </div>

      <div>
        <Label className="text-white text-sm">Taille d'impression</Label>
        <Select value={selectedSize} onValueChange={onSizeChange}>
          <SelectTrigger className="w-full bg-white/10 border-white/20 text-white mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white text-sm">Échelle: {designTransform.scale.toFixed(1)}x</Label>
        <Slider
          value={[designTransform.scale]}
          onValueChange={([value]) => onDesignTransformChange('scale', value)}
          min={0.5}
          max={2}
          step={0.1}
          className="mt-2"
        />
      </div>

      <div>
        <Label className="text-white text-sm">Rotation: {designTransform.rotation}°</Label>
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onDesignTransformChange('rotation', designTransform.rotation - 15)}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            -15°
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onDesignTransformChange('rotation', designTransform.rotation + 15)}
          >
            <RotateCw className="h-4 w-4 mr-1" />
            +15°
          </Button>
        </div>
      </div>

      <div className="text-xs text-white/60">
        <Move className="h-3 w-3 inline mr-1" />
        Glissez le design sur l'aperçu pour le repositionner
      </div>
    </div>
  );
};
