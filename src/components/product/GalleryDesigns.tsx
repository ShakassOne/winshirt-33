

import logger from '@/utils/logger';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
    e.stopPropagation();
    logger.log('🎨 [GalleryDesigns] Sélection du design:', design.name);
    onSelectDesign(design);
  };

  return (
    <div className="space-y-4">
      {/* Filtres par catégorie */}
      <div>
        <Label className="text-sm font-medium mb-3 block text-white">Catégories</Label>
        <div className="flex flex-wrap gap-2">
          {uniqueCategories.map(category => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className={selectedCategoryFilter === category ? "bg-purple-500 text-white border-purple-500" : "border-white/30 hover:bg-white/10"}
              onClick={() => setSelectedCategoryFilter(category)}
            >
              {category === 'all' ? 'Tous' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Galerie de designs */}
      <div>
        <Label className="text-sm font-medium mb-3 block text-white">
          Designs disponibles ({filteredDesigns.length})
        </Label>
        
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="aspect-square bg-white/10 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-[400px] overflow-y-auto">
            {filteredDesigns.map(design => (
              <Card
                key={design.id}
                className={`bg-black/40 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] border-white/10 hover:border-purple-500/30 ${
                  selectedDesign?.id === design.id ? 'border-purple-500' : ''
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
                  <p className="text-xs truncate text-white">{design.name}</p>
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
    </div>
  );
};
