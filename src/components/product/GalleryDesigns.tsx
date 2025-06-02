import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RotateCw } from 'lucide-react';
import { fetchAllDesigns } from '@/services/api.service';
import { Design } from '@/types/supabase.types';

interface GalleryDesignsProps {
  onSelectDesign: (design: Design) => void;
  selectedDesign: Design | null;
  currentDesignTransform: { position: { x: number; y: number }; scale: number; rotation: number };
  selectedSize: string;
  onDesignTransformChange: (property: string, value: any) => void;
  onSizeChange: (size: string) => void;
}

const sizePresets = [
  { label: 'A3', min: 81, max: 100 },
  { label: 'A4', min: 61, max: 80 },
  { label: 'A5', min: 41, max: 60 },
  { label: 'A6', min: 21, max: 40 },
  { label: 'A7', min: 1, max: 20 }
];

export const GalleryDesigns: React.FC<GalleryDesignsProps> = ({
  onSelectDesign,
  selectedDesign,
  currentDesignTransform,
  selectedSize,
  onDesignTransformChange,
  onSizeChange
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const { data: designs = [], isLoading } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchAllDesigns
  });

  const uniqueCategories = React.useMemo(() => {
    if (!designs) return ['all'];
    // Exclure les designs SVG et ne garder que les autres catégories
    const nonSvgDesigns = designs.filter(design => {
      const url = design.image_url?.toLowerCase() || '';
      return !(url.includes('.svg') || url.includes('svg') || design.image_url?.includes('data:image/svg'));
    });
    const categories = nonSvgDesigns.map(design => design.category);
    return ['all', ...new Set(categories)];
  }, [designs]);

  const filteredDesigns = React.useMemo(() => {
    if (!designs) return [];
    
    // Filtrer d'abord pour exclure les SVG
    const nonSvgDesigns = designs.filter(design => {
      if (design.is_active === false) return false;
      const url = design.image_url?.toLowerCase() || '';
      return !(url.includes('.svg') || url.includes('svg') || design.image_url?.includes('data:image/svg'));
    });

    if (selectedCategoryFilter === 'all') {
      return nonSvgDesigns;
    } else {
      return nonSvgDesigns.filter(design => design.category === selectedCategoryFilter);
    }
  }, [designs, selectedCategoryFilter]);

  const handleDesignSelect = (design: Design, e: React.MouseEvent) => {
    e.stopPropagation(); // ← Empêche le clic de "sortir" du Dialog
    console.log('🎨 [GalleryDesigns] Sélection du design:', design.name);
    console.log('🔒 Appel de onSelectDesign sans fermeture de modal');
    
    // Appeler directement la fonction sans aucune logique de fermeture
    onSelectDesign(design);
  };

  const handleSizeClick = (label: string) => {
    const preset = sizePresets.find(p => p.label === label);
    if (preset) {
      const newScale = (preset.min + preset.max) / 200;
      onDesignTransformChange('scale', newScale);
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
    onDesignTransformChange('scale', newScale);
    onSizeChange(getSizeLabel(newScale));
  };

  return (
    <div className="space-y-6">
      {/* Filtres par catégorie */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Catégories</Label>
        <div className="flex flex-wrap gap-2">
          {uniqueCategories.map(category => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className={selectedCategoryFilter === category ? "bg-winshirt-purple text-white" : ""}
              onClick={() => setSelectedCategoryFilter(category)}
            >
              {category === 'all' ? 'Tous' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Galerie de designs - 6 colonnes au lieu de 4 */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Designs disponibles ({filteredDesigns.length})
        </Label>
        
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="aspect-square bg-white/10 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[250px] overflow-y-auto">
            {filteredDesigns.map(design => (
              <Card
                key={design.id}
                className={`bg-black/40 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] border-white/10 hover:border-winshirt-purple/30 ${
                  selectedDesign?.id === design.id ? 'border-winshirt-purple' : ''
                }`}
                onClick={(e) => handleDesignSelect(design, e)}
              >
                <div className="aspect-square overflow-hidden bg-gray-900/40">
                  <img
                    src={design.image_url}
                    alt={design.name}
                    className="object-contain w-full h-full p-1"
                  />
                </div>
                <div className="p-1">
                  <p className="text-xs truncate">{design.name}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredDesigns.length === 0 && !isLoading && (
          <div className="text-center py-8 text-white/50">
            Aucun design trouvé dans cette catégorie.
          </div>
        )}
      </div>

      {/* Options de transformation si un design est sélectionné */}
      {selectedDesign && (
        <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <Label className="text-sm font-medium">Options du design sélectionné</Label>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="block text-sm">Taille d'impression</Label>
              <span className="text-sm text-winshirt-blue">
                Format sélectionné : {selectedSize}
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
                      ? 'bg-winshirt-purple text-white' 
                      : 'hover:bg-winshirt-purple/20'
                  }`}
                  onClick={() => handleSizeClick(preset.label)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-white/60">
              Les tailles A3 à A7 correspondent à l'échelle approximative d'impression.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Échelle ({Math.round(currentDesignTransform.scale * 100)}%)</Label>
            <Slider
              value={[currentDesignTransform.scale * 100]}
              min={1}
              max={100}
              step={1}
              onValueChange={handleScaleChange}
              className="flex-1"
            />
          </div>

          <div className="space-y-2">
            <Label>Rotation ({currentDesignTransform.rotation}°)</Label>
            <div className="flex gap-2 items-center">
              <Slider
                value={[currentDesignTransform.rotation + 180]}
                min={0}
                max={360}
                step={5}
                onValueChange={value => onDesignTransformChange('rotation', value[0] - 180)}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDesignTransformChange('rotation', 0)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
