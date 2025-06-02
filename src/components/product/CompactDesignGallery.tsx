
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchAllDesigns } from '@/services/api.service';
import { Design } from '@/types/supabase.types';

interface CompactDesignGalleryProps {
  onSelectDesign: (design: Design) => void;
  selectedDesign: Design | null;
}

export const CompactDesignGallery: React.FC<CompactDesignGalleryProps> = ({
  onSelectDesign,
  selectedDesign
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: designs = [], isLoading } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchAllDesigns
  });

  const categories = React.useMemo(() => {
    if (!designs) return ['all'];
    const nonSvgDesigns = designs.filter(design => {
      const url = design.image_url?.toLowerCase() || '';
      return !(url.includes('.svg') || url.includes('svg') || design.image_url?.includes('data:image/svg'));
    });
    const cats = nonSvgDesigns.map(design => design.category);
    return ['all', ...new Set(cats)];
  }, [designs]);

  const filteredDesigns = React.useMemo(() => {
    if (!designs) return [];
    
    const nonSvgDesigns = designs.filter(design => {
      if (design.is_active === false) return false;
      const url = design.image_url?.toLowerCase() || '';
      return !(url.includes('.svg') || url.includes('svg') || design.image_url?.includes('data:image/svg'));
    });

    if (selectedCategory === 'all') {
      return nonSvgDesigns.slice(0, 12); // Limite pour mobile
    } else {
      return nonSvgDesigns.filter(design => design.category === selectedCategory).slice(0, 12);
    }
  }, [designs, selectedCategory]);

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-white text-sm">Catégories</Label>
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex gap-2 p-1">
            {categories.map(category => (
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
                {category === 'all' ? 'Tous' : category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <Label className="text-white text-sm">Designs ({filteredDesigns.length})</Label>
        {isLoading ? (
          <div className="grid grid-cols-4 gap-2 mt-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-square bg-white/10 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto">
            {filteredDesigns.map(design => (
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
    </div>
  );
};
