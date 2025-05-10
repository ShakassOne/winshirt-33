
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';

interface ProductImageSectionProps {
  product: any;
  mockup: any;
  customizationMode: boolean;
  currentViewSide: 'front' | 'back';
  setCurrentViewSide: React.Dispatch<React.SetStateAction<'front' | 'back'>>;
  selectedMockupColor: MockupColor | null;
  getProductImage: () => string | undefined;
  selectedDesignFront: Design | null;
  selectedDesignBack: Design | null;
  designTransformFront: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  designTransformBack: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  textContentFront: string;
  textContentBack: string;
  textTransformFront: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  textTransformBack: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  textFontFront: string;
  textFontBack: string;
  textColorFront: string;
  textColorBack: string;
  textStylesFront: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  textStylesBack: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  handleMouseDown: (event: React.MouseEvent | React.TouchEvent, isText?: boolean) => void;
  productCanvasRef: React.RefObject<HTMLDivElement>;
  isDragging: boolean;
  isDraggingText: boolean;
}

const ProductImageSection = ({ 
  product,
  mockup,
  customizationMode,
  currentViewSide,
  setCurrentViewSide,
  selectedMockupColor,
  getProductImage,
  selectedDesignFront,
  selectedDesignBack,
  designTransformFront,
  designTransformBack,
  textContentFront,
  textContentBack,
  textTransformFront,
  textTransformBack,
  textFontFront,
  textFontBack,
  textColorFront,
  textColorBack,
  textStylesFront,
  textStylesBack,
  handleMouseDown,
  productCanvasRef,
  isDragging,
  isDraggingText
}: ProductImageSectionProps) => {
  // Helper function to get text style string
  const getTextStyleString = (styles: { bold: boolean; italic: boolean; underline: boolean }) => {
    return `${styles.bold ? 'font-bold' : ''} ${styles.italic ? 'italic' : ''} ${styles.underline ? 'underline' : ''}`;
  };
  
  const getCurrentDesign = () => {
    return currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack;
  };
  
  const getCurrentDesignTransform = () => {
    return currentViewSide === 'front' ? designTransformFront : designTransformBack;
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

  return (
    <div className="relative">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <AspectRatio ratio={1}>
          <div className="w-full h-full relative" ref={productCanvasRef}>
            <img 
              src={getProductImage()} 
              className="w-full h-full object-contain" 
              alt={product.name} 
            />
            
            {/* Render design overlay */}
            {customizationMode && currentViewSide === 'front' && selectedDesignFront && (
              <div 
                className={`absolute top-1/2 left-1/2 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
                style={{
                  transform: `translate(-50%, -50%) translate(${designTransformFront.position.x}px, ${designTransformFront.position.y}px) rotate(${designTransformFront.rotation}deg) scale(${designTransformFront.scale})`,
                  maxWidth: '80%',
                  maxHeight: '80%',
                }}
                onMouseDown={(e) => handleMouseDown(e)}
                onTouchStart={(e) => handleMouseDown(e)}
              >
                <img 
                  src={selectedDesignFront.image_url} 
                  className="max-w-full max-h-full object-contain" 
                  alt="Design" 
                  draggable="false"
                />
              </div>
            )}
            
            {customizationMode && currentViewSide === 'back' && selectedDesignBack && (
              <div 
                className={`absolute top-1/2 left-1/2 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
                style={{
                  transform: `translate(-50%, -50%) translate(${designTransformBack.position.x}px, ${designTransformBack.position.y}px) rotate(${designTransformBack.rotation}deg) scale(${designTransformBack.scale})`,
                  maxWidth: '80%',
                  maxHeight: '80%',
                }}
                onMouseDown={(e) => handleMouseDown(e)}
                onTouchStart={(e) => handleMouseDown(e)}
              >
                <img 
                  src={selectedDesignBack.image_url} 
                  className="max-w-full max-h-full object-contain" 
                  alt="Design" 
                  draggable="false"
                />
              </div>
            )}
            
            {/* Render text overlay */}
            {customizationMode && currentViewSide === 'front' && textContentFront && (
              <div 
                className={`absolute top-1/2 left-1/2 cursor-grab ${isDraggingText ? 'cursor-grabbing' : ''}`}
                style={{
                  transform: `translate(-50%, -50%) translate(${textTransformFront.position.x}px, ${textTransformFront.position.y}px) rotate(${textTransformFront.rotation}deg) scale(${textTransformFront.scale})`,
                  fontFamily: textFontFront,
                  color: textColorFront,
                  maxWidth: '90%',
                }}
                onMouseDown={(e) => handleMouseDown(e, true)}
                onTouchStart={(e) => handleMouseDown(e, true)}
              >
                <p className={getTextStyleString(textStylesFront)}>{textContentFront}</p>
              </div>
            )}
            
            {customizationMode && currentViewSide === 'back' && textContentBack && (
              <div 
                className={`absolute top-1/2 left-1/2 cursor-grab ${isDraggingText ? 'cursor-grabbing' : ''}`}
                style={{
                  transform: `translate(-50%, -50%) translate(${textTransformBack.position.x}px, ${textTransformBack.position.y}px) rotate(${textTransformBack.rotation}deg) scale(${textTransformBack.scale})`,
                  fontFamily: textFontBack,
                  color: textColorBack,
                  maxWidth: '90%',
                }}
                onMouseDown={(e) => handleMouseDown(e, true)}
                onTouchStart={(e) => handleMouseDown(e, true)}
              >
                <p className={getTextStyleString(textStylesBack)}>{textContentBack}</p>
              </div>
            )}
          </div>
        </AspectRatio>
      </div>
      
      {/* Toggle front/back button if product supports it */}
      {(customizationMode && mockup?.has_back_side) && (
        <Button
          variant="outline"
          className="absolute bottom-4 right-4 bg-white"
          onClick={() => setCurrentViewSide(prev => prev === 'front' ? 'back' : 'front')}
        >
          <RotateCw className="mr-2 h-4 w-4" />
          {currentViewSide === 'front' ? 'Voir arrière' : 'Voir avant'}
        </Button>
      )}
    </div>
  );
};

export default ProductImageSection;
