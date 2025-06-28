
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RotateCw, Eraser, Sparkles, Eye, FileImage, Type } from 'lucide-react';
import { Design } from '@/types/supabase.types';

interface UnifiedEditingControlsProps {
  selectedDesign: Design | null;
  currentTransform: { position: { x: number; y: number }; scale: number; rotation: number };
  selectedSize: string;
  onTransformChange: (property: string, value: any) => void;
  onSizeChange: (size: string) => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;
  hasText?: boolean;
  textContent?: string;
}

const sizePresets = [
  { label: 'A3', min: 121, max: 140 },
  { label: 'A4', min: 101, max: 120 },
  { label: 'A5', min: 81, max: 100 },  
  { label: 'A6', min: 61, max: 80 },
  { label: 'A7', min: 41, max: 60 }
];

export const UnifiedEditingControls: React.FC<UnifiedEditingControlsProps> = ({
  selectedDesign,
  currentTransform,
  selectedSize,
  onTransformChange,
  onSizeChange,
  onRemoveBackground,
  isRemovingBackground,
  hasText,
  textContent
}) => {
  const handleSizeClick = (label: string) => {
    const preset = sizePresets.find(p => p.label === label);
    if (preset) {
      const newScale = (preset.min + preset.max) / 200;
      onTransformChange('scale', newScale);
      onSizeChange(label);
    }
  };

  const handleScaleChange = (value: number[]) => {
    const newScale = value[0] / 100;
    const getSizeLabel = (scale: number): string => {
      const scalePercent = Math.round(scale * 100);
      const preset = sizePresets.find(p => scalePercent >= p.min && scalePercent <= p.max);
      return preset?.label || 'Custom';
    };
    onTransformChange('scale', newScale);
    onSizeChange(getSizeLabel(newScale));
  };

  // Toujours afficher si au moins un élément est présent
  if (!selectedDesign && !hasText) {
    return (
      <Card className="bg-white/5 border-white/10 p-4">
        <div className="text-center text-white/50 text-sm">
          <Eye className="h-6 w-6 mx-auto mb-2 opacity-50" />
          Sélectionnez un design ou ajoutez du texte pour voir les options d'édition
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-white">Options d'édition</Label>
        <div className="flex gap-1">
          {selectedDesign && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <FileImage className="h-3 w-3" />
              Design
            </Badge>
          )}
          {hasText && textContent && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Type className="h-3 w-3" />
              Texte
            </Badge>
          )}
        </div>
      </div>

      {selectedDesign && (
        <>
          {/* Nom du design */}
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-xs text-white/70 mb-1">Design sélectionné</p>
            <p className="text-sm text-white truncate">{selectedDesign.name}</p>
          </div>

          {/* Tailles d'impression */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="block text-sm text-white">Taille d'impression</Label>
              <span className="text-sm text-purple-300">
                Format: {selectedSize}
              </span>
            </div>
            <div className="flex gap-2 mb-2">
              {sizePresets.map(preset => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  className={`${
                    selectedSize === preset.label 
                      ? 'bg-purple-500 text-white border-purple-500' 
                      : 'hover:bg-white/10 border-white/30'
                  }`}
                  onClick={() => handleSizeClick(preset.label)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Échelle */}
          <div className="space-y-2">
            <Label className="text-white">Échelle ({Math.round(currentTransform.scale * 100)}%)</Label>
            <Slider
              value={[currentTransform.scale * 100]}
              min={1}
              max={140}
              step={1}
              onValueChange={handleScaleChange}
              className="flex-1"
            />
          </div>

          {/* Rotation */}
          <div className="space-y-2">
            <Label className="text-white">Rotation ({currentTransform.rotation}°)</Label>
            <div className="flex gap-2 items-center">
              <Slider
                value={[currentTransform.rotation + 180]}
                min={0}
                max={360}
                step={5}
                onValueChange={value => onTransformChange('rotation', value[0] - 180)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onTransformChange('rotation', 0)}
                className="border-white/30 hover:bg-white/10"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Suppression du fond */}
          <div className="pt-2 border-t border-white/10">
            <Button
              variant="outline"
              onClick={onRemoveBackground}
              disabled={isRemovingBackground}
              className="w-full border-white/30 hover:bg-red-500/20 hover:border-red-500/50"
            >
              {isRemovingBackground ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Suppression en cours...
                </>
              ) : (
                <>
                  <Eraser className="mr-2 h-4 w-4" />
                  Supprimer le fond
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {/* Pour le texte seulement */}
      {hasText && textContent && !selectedDesign && (
        <>
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-xs text-white/70 mb-1">Texte</p>
            <p className="text-sm text-white truncate">{textContent}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Échelle du texte ({Math.round(currentTransform.scale * 100)}%)</Label>
            <Slider
              value={[currentTransform.scale * 100]}
              min={10}
              max={300}
              step={5}
              onValueChange={value => onTransformChange('scale', value[0] / 100)}
              className="flex-1"
            />
            
            <Label className="text-white">Rotation ({currentTransform.rotation}°)</Label>
            <div className="flex gap-2 items-center">
              <Slider
                value={[currentTransform.rotation + 180]}
                min={0}
                max={360}
                step={5}
                onValueChange={value => onTransformChange('rotation', value[0] - 180)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onTransformChange('rotation', 0)}
                className="border-white/30 hover:bg-white/10"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Pour le texte et design ensemble */}
      {hasText && textContent && selectedDesign && (
        <div className="pt-2 border-t border-white/10">
          <div className="bg-white/10 rounded-lg p-2">
            <p className="text-xs text-white/70 mb-1">Texte ajouté</p>
            <p className="text-sm text-white truncate">{textContent}</p>
          </div>
        </div>
      )}
    </Card>
  );
};
