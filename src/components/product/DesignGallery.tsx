
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Grid, List } from 'lucide-react';
import { fetchDesignsByProductId } from '@/services/api.service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface DesignGalleryProps {
  productId: string;
  selectedDesign: any;
  onDesignSelect: (design: any) => void;
  currentSide: 'front' | 'back';
}

export const DesignGallery: React.FC<DesignGalleryProps> = ({
  productId,
  selectedDesign,
  onDesignSelect,
  currentSide,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: designs, isLoading } = useQuery({
    queryKey: ['designs', productId, currentSide],
    queryFn: () => fetchDesignsByProductId(productId),
  });

  const categories = React.useMemo(() => {
    if (!designs) return [];
    const cats = Array.from(new Set(designs.map(d => d.category).filter(Boolean)));
    return ['all', ...cats];
  }, [designs]);

  const filteredDesigns = React.useMemo(() => {
    if (!designs) return [];
    
    return designs.filter(design => {
      const matchesSearch = design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          design.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || design.category === selectedCategory;
      const matchesSide = design.side === currentSide || design.side === 'both';
      
      return matchesSearch && matchesCategory && matchesSide;
    });
  }, [designs, searchTerm, selectedCategory, currentSide]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
        <span className="ml-3 text-white/70">Chargement des designs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec recherche et filtres */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Rechercher un design..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-winshirt-purple/20 transition-colors"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'Tous' : category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Galerie de designs */}
      {filteredDesigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/70 mb-2">Aucun design trouvé</p>
          <p className="text-sm text-white/50">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "space-y-3"
        }>
          {filteredDesigns.map((design) => (
            <div
              key={design.id}
              className={`
                group cursor-pointer transition-all duration-200
                ${viewMode === 'grid' ? 'aspect-square' : 'flex items-center gap-4 p-3'}
                ${selectedDesign?.id === design.id 
                  ? 'ring-2 ring-winshirt-purple shadow-lg shadow-winshirt-purple/25' 
                  : 'hover:ring-1 hover:ring-white/30'
                }
                bg-white/5 rounded-lg border border-white/10 overflow-hidden
                hover:bg-white/10 hover:border-white/20
              `}
              onClick={() => onDesignSelect(design)}
            >
              {viewMode === 'grid' ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 p-3 flex items-center justify-center">
                    <img
                      src={design.image_url}
                      alt={design.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden text-white/40 text-center">
                      <div className="text-2xl mb-2">🎨</div>
                      <div className="text-xs">Design non disponible</div>
                    </div>
                  </div>
                  <div className="p-2 border-t border-white/10">
                    <h4 className="text-sm font-medium text-white truncate">{design.name}</h4>
                    {design.category && (
                      <p className="text-xs text-white/60 truncate">{design.category}</p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 flex-shrink-0 bg-white/5 rounded border border-white/10 flex items-center justify-center">
                    <img
                      src={design.image_url}
                      alt={design.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden text-white/40 text-center">
                      <div className="text-lg">🎨</div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{design.name}</h4>
                    {design.description && (
                      <p className="text-sm text-white/70 truncate">{design.description}</p>
                    )}
                    {design.category && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {design.category}
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
