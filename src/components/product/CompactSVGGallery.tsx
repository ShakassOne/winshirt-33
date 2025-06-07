
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
      return svgDesigns.slice(0, 18);
    } else {
      return svgDesigns.filter(design => design.category === selectedCategory).slice(0, 18);
    }
  }, [designs, selectedCategory]);

  return (
    <div className="space-y-2">
      <div>
        <Label className="text-white text-xs">Catégories SVG</Label>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex gap-1 p-1">
            {svgCategories.map(category => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className={`shrink-0 text-xs h-6 px-2 ${
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
        <Label className="text-white text-xs">Designs SVG ({filteredSvgDesigns.length})</Label>
        {isLoading ? (
          <div className="grid grid-cols-6 gap-1 mt-1">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="aspect-square bg-white/10 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-6 gap-1 mt-1 max-h-24 overflow-y-auto">
            {filteredSvgDesigns.map(design => (
              <button
                key={design.id}
                className={`aspect-square bg-black/40 overflow-hidden cursor-pointer transition-all hover:scale-105 border rounded ${
                  selectedDesign?.id === design.id ? 'border-winshirt-purple ring-1 ring-winshirt-purple' : 'border-white/10'
                }`}
                onClick={() => onSelectDesign(design)}
              >
                <img
                  src={design.image_url}
                  alt={design.name}
                  className="object-contain w-full h-full p-0.5"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
