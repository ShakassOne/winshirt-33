
import React from 'react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { sanitizeSvg } from '@/utils/sanitizeSvg';
import { DynamicColorMockup } from './DynamicColorMockup';

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
}

export const ProductPreview: React.FC<ProductPreviewProps> = ({
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
  onTouchMove
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
    const svgContent = getCurrentSvgContent();
    if (svgContent && svgContent.includes('<svg')) return true;
    if (!currentDesign?.image_url) return false;

    const url = currentDesign.image_url.toLowerCase();
    return (
      url.includes('.svg') ||
      url.includes('svg') ||
      url.startsWith('blob:') ||
      currentDesign.image_url.includes('data:image/svg')
    );
  };

  const getProductImage = () => {
    if (selectedMockupColor) {
      return currentViewSide === 'front' ? selectedMockupColor.front_image_url : selectedMockupColor.back_image_url || productImageUrl;
    } else if (mockup) {
      return currentViewSide === 'front' ? mockup.svg_front_url : mockup.svg_back_url || productImageUrl;
    }
    return productImageUrl;
  };

  const getBaseProductImage = () => {
    if (mockup) {
      return currentViewSide === 'front' ? mockup.svg_front_url : mockup.svg_back_url || productImageUrl;
    }
    return productImageUrl;
  };

  // Enhanced SVG rendering with proper content handling
  const renderSvgDesign = () => {
    const svgContent = getCurrentSvgContent();
    const svgColor = getCurrentSvgColor();
    const currentDesign = getCurrentDesign();
    
    console.log('Rendering SVG:', { 
      hasSvgContent: !!svgContent, 
      svgColor, 
      designUrl: currentDesign?.image_url,
      isSvgDesign: isSvgDesign()
    });
    
    // Priority 1: If we have processed SVG content, use it
    if (svgContent && svgContent.includes('<svg')) {
      let coloredSvg = svgContent;
      if (svgColor && svgColor !== '#ffffff') {
        // Apply color transformations
        coloredSvg = svgContent
          .replace(/fill="[^"]*"/g, `fill="${svgColor}"`)
          .replace(/stroke="[^"]*"/g, `stroke="${svgColor}"`)
          .replace(/fill:[^;"]*/g, `fill:${svgColor}`)
          .replace(/stroke:[^;"]*/g, `stroke:${svgColor}`)
          .replace(/fill="currentColor"/g, `fill="${svgColor}"`)
          .replace(/stroke="currentColor"/g, `stroke="${svgColor}"`);
      }
      
      // Ensure proper SVG structure
      if (!coloredSvg.includes('viewBox')) {
        coloredSvg = coloredSvg.replace(
          /<svg([^>]*)>/i,
          '<svg$1 viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">'
        );
      }
      
      return (
        <div
          className="w-[200px] h-[200px] flex items-center justify-center"
          dangerouslySetInnerHTML={{
            __html: sanitizeSvg(coloredSvg)
          }}
          style={{ 
            maxWidth: '200px', 
            maxHeight: '200px',
            overflow: 'visible'
          }}
        />
      );
    }
    
    // Priority 2: Regular image display (including SVG URLs)
    if (currentDesign) {
      const imageElement = (
        <img
          src={currentDesign.image_url}
          alt={currentDesign.name}
          className="max-w-[200px] max-h-[200px] w-auto h-auto"
          draggable={false}
          onLoad={() => console.log('Design image loaded successfully')}
          onError={(e) => console.error('Design image failed to load:', e)}
        />
      );

      // Apply color filter for SVG images if needed (and no SVG content available)
      if (isSvgDesign() && svgColor && svgColor !== '#ffffff' && !svgContent) {
        const getFilterForColor = (color: string) => {
          // Simple color mapping - you can extend this
          switch (color.toLowerCase()) {
            case '#ff0000':
            case 'red':
              return 'hue-rotate(0deg) saturate(2)';
            case '#00ff00':
            case 'green':
              return 'hue-rotate(120deg) saturate(2)';
            case '#0000ff':
            case 'blue':
              return 'hue-rotate(240deg) saturate(2)';
            default:
              return 'none';
          }
        };

        return (
          <div style={{
            filter: getFilterForColor(svgColor)
          }}>
            {imageElement}
          </div>
        );
      }

      return imageElement;
    }
    
    return null;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-center text-white">{productName}</h3>
        <p className="text-sm text-white/60 text-center">
          {currentViewSide === 'front' ? 'Vue avant' : 'Vue arrière'}
        </p>
        {selectedMockupColor && (
          <p className="text-xs text-white/50 text-center mt-1">
            Couleur: {selectedMockupColor.name}
          </p>
        )}
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
          data-capture-element
        >
          {/* Image de base avec coloration dynamique */}
          <DynamicColorMockup
            baseImageUrl={getBaseProductImage()}
            selectedColor={selectedMockupColor}
            alt={productName}
            className="w-full h-full"
          />

          {/* Design Layer with enhanced SVG support */}
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
              {renderSvgDesign()}
            </div>
          )}
          
          {/* Text Layer */}
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
                fontSize: '24px',
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
                className="text-sm data-[state=on]:bg-purple-500/70 px-4 py-2"
              >
                Avant
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="back" 
                className="text-sm data-[state=on]:bg-purple-500/70 px-4 py-2"
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
