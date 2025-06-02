
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Palette } from 'lucide-react';
import { fetchAllDesigns } from '@/services/api.service';
import { Design } from '@/types/supabase.types';
import { SVGColorEditor } from './SVGColorEditor';

interface SVGDesignsProps {
  onSelectDesign: (design: Design) => void;
  selectedDesign: Design | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSvgColorChange: (color: string) => void;
  onSvgContentChange: (content: string) => void;
  defaultSvgColor: string;
}

export const SVGDesigns: React.FC<SVGDesignsProps> = ({
  onSelectDesign,
  selectedDesign,
  onFileUpload,
  onSvgColorChange,
  onSvgContentChange,
  defaultSvgColor
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('svg');

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

    if (selectedCategoryFilter === 'svg') {
      return svgDesigns;
    } else {
      return svgDesigns.filter(design => design.category === selectedCategoryFilter);
    }
  }, [designs, selectedCategoryFilter]);

  const handleDesignSelect = (design: Design) => {
    console.log('🎨 [SVGDesigns] Sélection du design SVG:', design.name);
    onSelectDesign(design);
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isSvgDesign = () => {
    if (!selectedDesign?.image_url) return false;
    const url = selectedDesign.image_url.toLowerCase();
    return url.includes('.svg') || url.includes('svg') || selectedDesign.image_url.includes('data:image/svg');
  };

  return (
    <div className="space-y-6">
      {/* Upload SVG */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Importer un fichier SVG</Label>
        
        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-winshirt-purple/50 transition-colors">
          <Upload className="h-10 w-10 mx-auto mb-3 text-white/40" />
          <p className="text-white/70 mb-3 text-sm">
            Glissez-déposez votre fichier SVG ici ou cliquez pour sélectionner
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-winshirt-purple/20 to-winshirt-blue/20"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choisir un fichier SVG
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".svg,image/svg+xml"
            onChange={onFileUpload}
          />
          <p className="text-xs text-white/50 mt-2">
            Format supporté : SVG uniquement
          </p>
        </div>
      </div>

      {/* Filtres par catégorie SVG */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Catégories SVG</Label>
        <div className="flex flex-wrap gap-2">
          {svgCategories.map(category => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              className={selectedCategoryFilter === category ? "bg-winshirt-purple text-white" : ""}
              onClick={() => setSelectedCategoryFilter(category)}
            >
              {category === 'svg' ? 'Tous les SVG' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Galerie de designs SVG */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Designs SVG disponibles ({filteredSvgDesigns.length})
        </Label>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-square bg-white/10 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto">
            {filteredSvgDesigns.map(design => (
              <Card
                key={design.id}
                className={`bg-black/40 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] border-white/10 hover:border-winshirt-purple/30 ${
                  selectedDesign?.id === design.id ? 'border-winshirt-purple' : ''
                }`}
                onClick={() => handleDesignSelect(design)}
              >
                <div className="aspect-square overflow-hidden bg-gray-900/40">
                  <img
                    src={design.image_url}
                    alt={design.name}
                    className="object-contain w-full h-full p-2"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs truncate">{design.name}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredSvgDesigns.length === 0 && !isLoading && (
          <div className="text-center py-8 text-white/50">
            Aucun design SVG trouvé dans cette catégorie.
          </div>
        )}
      </div>

      {/* Éditeur de couleur SVG */}
      {isSvgDesign() && selectedDesign && (
        <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
          <Label className="text-sm font-medium flex items-center">
            <Palette className="h-4 w-4 mr-2 text-winshirt-purple" />
            Personnaliser la couleur du SVG
          </Label>
          
          <SVGColorEditor
            imageUrl={selectedDesign.image_url}
            onColorChange={onSvgColorChange}
            onSvgContentChange={onSvgContentChange}
            defaultColor={defaultSvgColor}
          />
        </div>
      )}
    </div>
  );
};
