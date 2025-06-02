import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { TouchHandles } from './TouchHandles';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedProductPreviewProps {
  productName: string;
  productImageUrl?: string;
  currentViewSide: 'front' | 'back';
  onViewSideChange: (side: 'front' | 'back') => void;
  mockup?: any;
  selectedMockupColor: MockupColor | null;
  hasTwoSides: boolean;
  selectedDesignFront: Design | null;
  selectedDesignBack: Design | null;
  designTransformFront: { position: { x: number; y: number }; scale: number; rotation: number };
  designTransformBack: { position: { x: number; y: number }; scale: number; rotation: number };
  svgColorFront: string;
  svgColorBack: string;
  svgContentFront: string;
  svgContentBack: string;
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
  onDesignMouseDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  onTextMouseDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  onDesignTransformChange: (property: string, value: any) => void;
  onTextTransformChange: (property: string, value: any) => void;
  onRemoveDesign?: () => void;
  onRemoveText?: () => void;
}

export const EnhancedProductPreview: React.FC<EnhancedProductPreviewProps> = ({
  productName,
  productImageUrl,
  currentViewSide,
  onViewSideChange,
  mockup,
  selectedMockupColor,
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
  onDesignTransformChange,
  onTextTransformChange,
  onRemoveDesign,
  onRemoveText
}) => {
  const isMobile = useIsMobile();
  const [selectedElement, setSelectedElement] = useState<'design' | 'text' | null>(null);

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

  const handleElementSelect = (element: 'design' | 'text') => {
    setSelectedElement(selectedElement === element ? null : element);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-center">{productName}</h3>
        <p className="text-sm text-white/60 text-center">
          {currentViewSide === 'front' ? 'Vue avant' : 'Vue arrière'}
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div 
          className="relative bg-black/30 rounded-lg overflow-hidden shadow-xl flex justify-center items-center mb-6" 
          style={{ 
            touchAction: 'none',
            minHeight: '400px',
            maxHeight: 'calc(100vh - 250px)',
            aspectRatio: '1/1'
          }} 
          onTouchMove={onTouchMove}
          onClick={() => setSelectedElement(null)}
        >
          <img
            src={getProductImage()}
            alt={productName}
            className="w-full h-full object-contain"
          />

          {getCurrentDesign() && (
            <div
              className={`absolute cursor-move select-none ${
                selectedElement === 'design' && isMobile ? 'z-30' : 'z-10'
              }`}
              style={{
                transform: `translate(${getCurrentDesignTransform().position.x}px, ${getCurrentDesignTransform().position.y}px) 
                               rotate(${getCurrentDesignTransform().rotation}deg) 
                               scale(${getCurrentDesignTransform().scale})`,
                transformOrigin: 'center'
              }}
              onMouseDown={onDesignMouseDown}
              onTouchStart={onDesignMouseDown}
              onClick={(e) => {
                e.stopPropagation();
                if (isMobile) handleElementSelect('design');
              }}
            >
              {isSvgDesign() && getCurrentSvgContent() ? (
                <div
                  className="w-[200px] h-[200px] flex items-center justify-center"
                  dangerouslySetInnerHTML={{ 
                    __html: getCurrentSvgContent().replace(
                      /<svg([^>]*)>/i, 
                      '<svg$1 width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">'
                    )
                  }}
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px',
                    overflow: 'visible'
                  }}
                />
              ) : (
                <img
                  src={getCurrentDesign()!.image_url}
                  alt={getCurrentDesign()!.name}
                  className="max-w-[200px] max-h-[200px] w-auto h-auto"
                  draggable={false}
                />
              )}
              
              {selectedElement === 'design' && isMobile && (
                <TouchHandles
                  onResize={(scale) => onDesignTransformChange('scale', scale)}
                  onRotate={(rotation) => onDesignTransformChange('rotation', rotation)}
                  onDelete={() => onRemoveDesign?.()}
                  currentScale={getCurrentDesignTransform().scale}
                  currentRotation={getCurrentDesignTransform().rotation}
                  elementType="design"
                />
              )}
            </div>
          )}
          
          {getCurrentTextContent() && (
            <div 
              className={`absolute cursor-move select-none ${
                selectedElement === 'text' && isMobile ? 'z-30' : 'z-20'
              }`}
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
                fontSize: '24px',
                textShadow: '0px 0px 3px rgba(0,0,0,0.5)'
              }} 
              onMouseDown={onTextMouseDown} 
              onTouchStart={onTextMouseDown}
              onClick={(e) => {
                e.stopPropagation();
                if (isMobile) handleElementSelect('text');
              }}
            >
              {getCurrentTextContent()}
              
              {selectedElement === 'text' && isMobile && (
                <TouchHandles
                  onResize={(scale) => onTextTransformChange('scale', scale)}
                  onRotate={(rotation) => onTextTransformChange('rotation', rotation)}
                  onDelete={() => onRemoveText?.()}
                  currentScale={getCurrentTextTransform().scale}
                  currentRotation={getCurrentTextTransform().rotation}
                  elementType="text"
                />
              )}
            </div>
          )}
        </div>

        {hasTwoSides && (
          <div className="flex justify-center mt-auto pb-4">
            <ToggleGroup 
              type="single" 
              value={currentViewSide} 
              onValueChange={value => value && onViewSideChange(value as 'front' | 'back')} 
              className="bg-black/40 backdrop-blur-sm rounded-lg p-1"
            >
              <ToggleGroupItem 
                value="front" 
                className="text-sm data-[state=on]:bg-winshirt-purple/70 px-4 py-2"
              >
                Avant
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="back" 
                className="text-sm data-[state=on]:bg-winshirt-purple/70 px-4 py-2"
              >
                Arrière
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        )}
      </div>
    </div>
  );
};
