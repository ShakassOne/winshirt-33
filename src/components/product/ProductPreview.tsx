
import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { ProductColorSelector } from './ProductColorSelector';

interface ProductPreviewProps {
  // Product data
  productName: string;
  productImageUrl?: string;
  
  // View state
  currentViewSide: 'front' | 'back';
  onViewSideChange: (side: 'front' | 'back') => void;
  
  // Mockup data
  mockup?: any;
  selectedMockupColor: MockupColor | null;
  mockupColors?: MockupColor[];
  hasTwoSides: boolean;
  
  // Design states
  selectedDesignFront: Design | null;
  selectedDesignBack: Design | null;
  designTransformFront: { position: { x: number; y: number }; scale: number; rotation: number };
  designTransformBack: { position: { x: number; y: number }; scale: number; rotation: number };
  
  // SVG states
  svgColorFront: string;
  svgColorBack: string;
  svgContentFront: string;
  svgContentBack: string;
  
  // Text states
  textContentFront: string;
  textContentBack: string;
  textFontFront: string;
  textFontBack: string;
  textColorFront: string;
  textColorBack: string;
  textStylesFront: { bold: boolean; italic: boolean; underline: boolean };
  textStylesBack: { bold: boolean; italic: boolean; underline: boolean };
  textTransformFront: { position: { x: number; y: number }; scale: number; rotation: number };
  textTransformBack: { position: { x: number; y: number }; scale: number; rotation: number };
  
  // Interaction handlers
  onDesignMouseDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  onTextMouseDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onColorSelect?: (color: MockupColor) => void;
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({
  productName,
  productImageUrl,
  currentViewSide,
  onViewSideChange,
  mockup,
  selectedMockupColor,
  mockupColors = [],
  hasTwoSides,
  selectedDesignFront,
  selectedDesignBack,
  designTransformFront,
  designTransformBack,
  svgColorFront,
  svgColorBack,
  svgContentFront,
  svgContentBack,
  textContentFront,
  textContentBack,
  textFontFront,
  textFontBack,
  textColorFront,
  textColorBack,
  textStylesFront,
  textStylesBack,
  textTransformFront,
  textTransformBack,
  onDesignMouseDown,
  onTextMouseDown,
  onTouchMove,
  onColorSelect
}) => {
  const getCurrentDesign = () => {
    return currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack;
  };

  const getCurrentDesignTransform = () => {
    return currentViewSide === 'front' ? designTransformFront : designTransformBack;
  };

  const getCurrentSvgColor = () => {
    return currentViewSide === 'front' ? svgColorFront : svgColorBack;
  };

  const getCurrentSvgContent = () => {
    return currentViewSide === 'front' ? svgContentFront : svgContentBack;
  };

  const getCurrentTextContent = () => {
    return currentViewSide === 'front' ? textContentFront : textContentBack;
  };

  const getCurrentTextTransform = () => {
    return currentViewSide === 'front' ? textTransformFront : textTransformBack;
  };

  const getCurrentTextFont = () => {
    return currentViewSide === 'front' ? textFontFront : textFontBack;
  };

  const getCurrentTextColor = () => {
    return currentViewSide === 'front' ? textColorFront : textColorBack;
  };

  const getCurrentTextStyles = () => {
    return currentViewSide === 'front' ? textStylesFront : textStylesBack;
  };

  const isSvgDesign = () => {
    const currentDesign = getCurrentDesign();
    if (!currentDesign?.image_url) return false;
    
    const url = currentDesign.image_url.toLowerCase();
    return url.includes('.svg') || url.includes('svg') || currentDesign.image_url.includes('data:image/svg');
  };

  const getProductImage = () => {
    if (selectedMockupColor) {
      return currentViewSide === 'front' ? selectedMockupColor.front_image_url : selectedMockupColor.back_image_url || productImageUrl;
    } else if (mockup) {
      return currentViewSide === 'front' ? mockup.svg_front_url : mockup.svg_back_url || productImageUrl;
    }
    return productImageUrl;
  };

  const getCurrentColorIndex = () => {
    if (!mockupColors.length || !selectedMockupColor) return 0;
    return mockupColors.findIndex(color => color.id === selectedMockupColor.id);
  };

  const handlePreviousColor = () => {
    if (!mockupColors.length || !onColorSelect) return;
    const currentIndex = getCurrentColorIndex();
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : mockupColors.length - 1;
    onColorSelect(mockupColors[previousIndex]);
  };

  const handleNextColor = () => {
    if (!mockupColors.length || !onColorSelect) return;
    const currentIndex = getCurrentColorIndex();
    const nextIndex = currentIndex < mockupColors.length - 1 ? currentIndex + 1 : 0;
    onColorSelect(mockupColors[nextIndex]);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">{productName}</h3>
        <p className="text-sm text-white/60">
          {currentViewSide === 'front' ? 'Vue avant' : 'Vue arrière'}
        </p>
      </div>

      {/* Sélecteur de couleurs */}
      {mockupColors.length > 1 && onColorSelect && (
        <ProductColorSelector
          mockupColors={mockupColors}
          selectedMockupColor={selectedMockupColor}
          onColorSelect={onColorSelect}
        />
      )}

      {/* Preview du produit - taille réduite */}
      <div className="flex-1 max-w-sm mx-auto">
        <div 
          className="relative bg-black/30 rounded-lg overflow-hidden shadow-xl aspect-square flex justify-center items-center" 
          style={{ touchAction: 'none' }} 
          onTouchMove={onTouchMove}
        >
          <img
            src={getProductImage()}
            alt={productName}
            className="w-full h-full object-contain"
          />

          {getCurrentDesign() && (
            <div
              className="absolute cursor-move select-none"
              style={{
                transform: `translate(${getCurrentDesignTransform().position.x}px, ${getCurrentDesignTransform().position.y}px) 
                               rotate(${getCurrentDesignTransform().rotation}deg) 
                               scale(${getCurrentDesignTransform().scale})`,
                transformOrigin: 'center',
                zIndex: 10
              }}
              onMouseDown={onDesignMouseDown}
              onTouchStart={onDesignMouseDown}
            >
              {isSvgDesign() && getCurrentSvgContent() ? (
                <div
                  className="w-[120px] h-[120px] flex items-center justify-center"
                  dangerouslySetInnerHTML={{ 
                    __html: getCurrentSvgContent().replace(
                      /<svg([^>]*)>/i, 
                      '<svg$1 width="100%" height="100%" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">'
                    )
                  }}
                  style={{ 
                    maxWidth: '120px', 
                    maxHeight: '120px',
                    overflow: 'visible'
                  }}
                />
              ) : (
                <img
                  src={getCurrentDesign()!.image_url}
                  alt={getCurrentDesign()!.name}
                  className="max-w-[120px] max-h-[120px] w-auto h-auto"
                  draggable={false}
                />
              )}
            </div>
          )}
          
          {getCurrentTextContent() && (
            <div 
              className="absolute cursor-move select-none" 
              style={{
                transform: `translate(${getCurrentTextTransform().position.x}px, ${getCurrentTextTransform().position.y}px) 
                             rotate(${getCurrentTextTransform().rotation}deg) 
                             scale(${getCurrentTextTransform().scale})`,
                transformOrigin: 'center',
                fontFamily: getCurrentTextFont(),
                color: getCurrentTextColor(),
                fontWeight: getCurrentTextStyles().bold ? 'bold' : 'normal',
                fontStyle: getCurrentTextStyles().italic ? 'italic' : 'normal',
                textDecoration: getCurrentTextStyles().underline ? 'underline' : 'none',
                fontSize: '20px',
                textShadow: '0px 0px 3px rgba(0,0,0,0.5)',
                zIndex: 20
              }} 
              onMouseDown={onTextMouseDown} 
              onTouchStart={onTextMouseDown}
            >
              {getCurrentTextContent()}
            </div>
          )}
        </div>
      </div>

      {/* Navigation des couleurs et côtés */}
      <div className="space-y-3">
        {/* Boutons navigation couleurs */}
        {mockupColors.length > 1 && onColorSelect && (
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousColor}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            <span className="text-sm text-white/70">
              {selectedMockupColor?.name || 'Couleur'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextColor}
              className="flex items-center gap-1"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Toggle recto/verso */}
        {hasTwoSides && (
          <div className="flex justify-center">
            <ToggleGroup 
              type="single" 
              value={currentViewSide} 
              onValueChange={value => value && onViewSideChange(value as 'front' | 'back')} 
              className="bg-black/40 backdrop-blur-sm rounded-lg"
            >
              <ToggleGroupItem value="front" className="text-sm data-[state=on]:bg-winshirt-purple/70">
                Avant
              </ToggleGroupItem>
              <ToggleGroupItem value="back" className="text-sm data-[state=on]:bg-winshirt-purple/70">
                Arrière
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
      </div>
    </div>
  );
};
