import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import { GalleryDesigns } from './GalleryDesigns';
import { SVGDesigns } from './SVGDesigns';
import { CompactUpload } from './CompactUpload';
import { UnifiedEditingControls } from './UnifiedEditingControls';

interface ImagesPanelProps {
  onSelectDesign: (design: Design | null) => void;
  selectedDesign: Design | null;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveBackground: (tolerance?: number) => void;
  isRemovingBackground: boolean;
  svgColor: string;
  onSvgColorChange: (color: string) => void;
  onRemoveDesign: () => void;
  // Transform controls props
  designTransform: {
    position: { x: number; y: number; };
    scale: number;
    rotation: number;
  };
  selectedSize: string;
  onDesignTransformChange: (property: string, value: any) => void;
  onSizeChange: (size: string) => void;
}

export const ImagesPanel: React.FC<ImagesPanelProps> = ({
  onSelectDesign,
  selectedDesign,
  onFileUpload,
  onRemoveBackground,
  isRemovingBackground,
  svgColor,
  onSvgColorChange,
  onRemoveDesign,
  designTransform,
  selectedSize,
  onDesignTransformChange,
  onSizeChange
}) => {
  const [currentLevel, setCurrentLevel] = useState<'gallery' | 'options'>('gallery');
  const [activeTab, setActiveTab] = useState<'gallery' | 'svg' | 'upload'>('gallery');

  const handleDesignSelect = (design: Design | null) => {
    onSelectDesign(design);
    if (design) {
      setCurrentLevel('options');
    }
  };

  const handleBackToGallery = () => {
    setCurrentLevel('gallery');
  };

  if (currentLevel === 'options' && selectedDesign) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToGallery}
            className="p-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-sm font-medium">Options Image</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveDesign}
          >
            Supprimer
          </Button>
        </div>
        
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">{selectedDesign.name}</p>
          {selectedDesign.image_url && (
            <img 
              src={selectedDesign.image_url} 
              alt={selectedDesign.name}
              className="w-full h-20 object-contain rounded"
            />
          )}
        </div>

        <UnifiedEditingControls
          selectedDesign={selectedDesign}
          currentTransform={designTransform}
          selectedSize={selectedSize}
          onTransformChange={onDesignTransformChange}
          onSizeChange={onSizeChange}
          onRemoveBackground={onRemoveBackground}
          isRemovingBackground={isRemovingBackground}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Images</h3>
        {selectedDesign && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentLevel('options')}
          >
            <Settings className="w-4 h-4 mr-1" />
            Options
          </Button>
        )}
      </div>
      
      {/* Tabs for different image sources */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        <Button
          variant={activeTab === 'gallery' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('gallery')}
          className="flex-1"
        >
          Galerie
        </Button>
        <Button
          variant={activeTab === 'svg' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('svg')}
          className="flex-1"
        >
          SVG
        </Button>
        <Button
          variant={activeTab === 'upload' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('upload')}
          className="flex-1"
        >
          Upload
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'gallery' && (
        <GalleryDesigns
          onSelectDesign={handleDesignSelect}
          selectedDesign={selectedDesign}
          currentDesignTransform={designTransform}
          selectedSize={selectedSize}
          onDesignTransformChange={onDesignTransformChange}
          onSizeChange={onSizeChange}
        />
      )}

      {activeTab === 'svg' && (
        <SVGDesigns
          onSelectDesign={handleDesignSelect}
          selectedDesign={selectedDesign}
          onFileUpload={onFileUpload}
          onSvgColorChange={onSvgColorChange}
          onSvgContentChange={() => {}}
          defaultSvgColor={svgColor}
        />
      )}

      {activeTab === 'upload' && (
        <CompactUpload
          onFileUpload={onFileUpload}
          onRemoveBackground={onRemoveBackground}
          isRemovingBackground={isRemovingBackground}
          currentDesign={selectedDesign}
        />
      )}
    </div>
  );
};