
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchAllDesigns } from '@/services/api.service';
import { Design } from '@/types/supabase.types';

interface CompactSVGGalleryProps {
  onSelectDesign: (design: Design) => void;
  selectedDesign: Design | null;
  svgColor: string;
  onSvgColorChange: (color: string) => void;
}

export const CompactSVGGallery: React.FC<CompactSVGGalleryProps> = ({
  onSelectDesign,
  selectedDesign,
  svgColor,
  onSvgColorChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('svg');

  const { data: designs = [], isLoading } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchAllDesigns
  });

  const svgCategories = React.useMemo(() => {
    if (!designs) return ['svg'];
    const categories = designs
      .filter(design => {
        const url = design.image_url?.toLowerCase() || '';
        return url.includes('.svg') || url.includes('svg') || design.image_url?.includes('data:image/svg');
      })
      .map(design => design.category);
    return ['svg', ...new Set(categories)];
  }, [designs]);

  const filteredSvgDesigns = React.useMemo(() => {
    if (!designs) return [];
    
    const svgDesigns = designs.filter(design => {
      if (design.is_active === false) return false;
      const url = design.image_url?.toLowerCase() || '';
      return url.includes('.svg') || url.includes('svg') || design.image_url?.includes('data:image/svg');
    });

    if (selectedCategory === 'svg') {
      return svgDesigns.slice(0, 12);
    } else {
      return svgDesigns.filter(design => design.category === selectedCategory).slice(0, 12);
    }
  }, [designs, selectedCategory]);

  const isSvgDesign = () => {
    if (!selectedDesign?.image_url) return false;
    const url = selectedDesign.image_url.toLowerCase();
    return url.includes('.svg') || url.includes('svg') || selectedDesign.image_url.includes('data:image/svg');
  };

  const colorOptions = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-white text-sm">Catégories SVG</Label>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex gap-2 p-1">
            {svgCategories.map(category => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className={`shrink-0 text-xs ${
                  selectedCategory === category 
                    ? 'bg-winshirt-purple text-white border-winshirt-purple' 
                    : 'border-white/20 text-white/70'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'svg' ? 'Tous les SVG' : category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <Label className="text-white text-sm">Designs SVG ({filteredSvgDesigns.length})</Label>
        {isLoading ? (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-square bg-white/10 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto">
            {filteredSvgDesigns.map(design => (
              <Card
                key={design.id}
                className={`bg-black/40 overflow-hidden cursor-pointer transition-all hover:scale-105 border-white/10 ${
                  selectedDesign?.id === design.id ? 'border-winshirt-purple ring-1 ring-winshirt-purple' : ''
                }`}
                onClick={() => onSelectDesign(design)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={design.image_url}
                    alt={design.name}
                    className="object-contain w-full h-full p-1"
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {isSvgDesign() && (
        <div>
          <Label className="text-white text-sm">Couleur SVG</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 ${
                  svgColor === color ? 'border-white scale-110' : 'border-white/30'
                } transition-all`}
                style={{ backgroundColor: color }}
                onClick={() => onSvgColorChange(color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
