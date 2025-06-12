
import React, { useRef, useState, useCallback } from 'react';
import { RotateCcw, Move, RotateCw, ZoomIn, ZoomOut, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { UnifiedCustomizationRenderer } from './UnifiedCustomizationRenderer';
import { ProductionFileRenderer } from './ProductionFileRenderer';

interface EnhancedProductPreviewProps {
  productName: string;
  productImageUrl?: string;
  currentViewSide: 'front' | 'back';
  onViewSideChange: (side: 'front' | 'back') => void;
  mockup?: any;
  selectedMockupColor: MockupColor | null;
  hasTwoSides: boolean;
  
  // Données de personnalisation unifiées
  customization: any;
  
  // Handlers pour les interactions
  onDesignTransformChange: (property: string, value: any) => void;
  onTextTransformChange: (property: string, value: any) => void;
  onRemoveDesign: () => void;
  onRemoveText: () => void;
}

export const EnhancedProductPreview: React.FC<EnhancedProductPreviewProps> = ({
  productName,
  currentViewSide,
  onViewSideChange,
  mockup,
  selectedMockupColor,
  hasTwoSides,
  customization,
  onDesignTransformChange,
  onTextTransformChange,
  onRemoveDesign,
  onRemoveText
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);

  const currentData = {
    design: currentViewSide === 'front' ? customization?.frontDesign : customization?.backDesign,
    text: currentViewSide === 'front' ? customization?.frontText : customization?.backText
  };

  const getProductImage = () => {
    if (selectedMockupColor) {
      return currentViewSide === 'front' ? selectedMockupColor.front_image_url : selectedMockupColor.back_image_url;
    } else if (mockup) {
      return currentViewSide === 'front' ? mockup.svg_front_url : mockup.svg_back_url;
    }
    return undefined;
  };

  return (
    <div className="relative w-full h-full bg-gray-900/50 rounded-lg overflow-hidden">
      {/* Preview Area avec rendu unifié - avec IDs pour capture */}
      <div 
        ref={previewRef}
        className="relative w-full h-full"
      >
        {/* Vue principale visible */}
        <div className="w-full h-full">
          <UnifiedCustomizationRenderer
            customization={customization}
            side={currentViewSide}
            withBackground={true}
            backgroundUrl={getProductImage()}
            className="w-full h-full"
          />
        </div>

        {/* Éléments cachés pour capture - Mockups */}
        <div className="absolute -left-[9999px] -top-[9999px] w-[600px] h-[600px]">
          <div id="mockup-front" className="w-full h-full">
            <UnifiedCustomizationRenderer
              customization={customization}
              side="front"
              withBackground={true}
              backgroundUrl={selectedMockupColor ? selectedMockupColor.front_image_url : mockup?.svg_front_url}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="absolute -left-[9999px] -top-[9999px] w-[600px] h-[600px]">
          <div id="mockup-back" className="w-full h-full">
            <UnifiedCustomizationRenderer
              customization={customization}
              side="back"
              withBackground={true}
              backgroundUrl={selectedMockupColor ? selectedMockupColor.back_image_url : mockup?.svg_back_url}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Renderers de production cachés pour capture HD */}
      <ProductionFileRenderer
        customization={customization}
        side="front"
        elementId="production-front"
      />
      <ProductionFileRenderer
        customization={customization}
        side="back"
        elementId="production-back"
      />

      {/* Side Toggle */}
      {hasTwoSides && (
        <div className="absolute top-2 left-2 flex bg-black/50 rounded-md overflow-hidden">
          <Button
            variant={currentViewSide === 'front' ? 'default' : 'ghost'}
            size="sm"
            className="h-6 px-2 text-xs rounded-none"
            onClick={() => onViewSideChange('front')}
          >
            Avant
          </Button>
          <Button
            variant={currentViewSide === 'back' ? 'default' : 'ghost'}
            size="sm"
            className="h-6 px-2 text-xs rounded-none"
            onClick={() => onViewSideChange('back')}
          >
            Arrière
          </Button>
        </div>
      )}

      {/* Control Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0 bg-black/50"
        onClick={() => setShowControls(!showControls)}
      >
        {showControls ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      </Button>

      {/* Quick Controls */}
      {showControls && (currentData.design || currentData.text) && (
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex justify-center gap-1 bg-black/70 rounded-md p-1">
            {currentData.design && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onDesignTransformChange('scale', Math.max(0.5, currentData.design.transform.scale - 0.1))}
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onDesignTransformChange('scale', Math.min(2, currentData.design.transform.scale + 0.1))}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onDesignTransformChange('rotation', currentData.design.transform.rotation - 15)}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onDesignTransformChange('rotation', currentData.design.transform.rotation + 15)}
                >
                  <RotateCw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={onRemoveDesign}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
            
            {currentData.text && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onRemoveText}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
