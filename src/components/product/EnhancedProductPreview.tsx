
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { RotateCcw, Move, RotateCw, ZoomIn, ZoomOut, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';

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
  onDesignTransformChange,
  onTextTransformChange,
  onRemoveDesign,
  onRemoveText
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'design' | 'text' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);

  const currentData = {
    design: currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack,
    designTransform: currentViewSide === 'front' ? designTransformFront : designTransformBack,
    svgColor: currentViewSide === 'front' ? svgColorFront : svgColorBack,
    svgContent: currentViewSide === 'front' ? svgContentFront : svgContentBack,
    textContent: currentViewSide === 'front' ? textContentFront : textContentBack,
    textFont: currentViewSide === 'front' ? textFontFront : textFontBack,
    textColor: currentViewSide === 'front' ? textColorFront : textColorBack,
    textStyles: currentViewSide === 'front' ? textStylesFront : textStylesBack,
    textTransform: currentViewSide === 'front' ? textTransformFront : textTransformBack
  };

  // Fixed touch event handlers with proper passive handling
  const handleTouchStart = useCallback((e: React.TouchEvent, type: 'design' | 'text') => {
    e.stopPropagation();
    const touch = e.touches[0];
    setIsDragging(type);
    setDragStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    // Don't call preventDefault in passive listeners
    e.stopPropagation();
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;

    if (isDragging === 'design') {
      const currentPos = currentData.designTransform.position;
      onDesignTransformChange('position', {
        x: currentPos.x + deltaX * 0.5,
        y: currentPos.y + deltaY * 0.5
      });
    } else if (isDragging === 'text') {
      const currentPos = currentData.textTransform.position;
      onTextTransformChange('position', {
        x: currentPos.x + deltaX * 0.5,
        y: currentPos.y + deltaY * 0.5
      });
    }

    setDragStart({ x: touch.clientX, y: touch.clientY });
  }, [isDragging, dragStart, currentData, onDesignTransformChange, onTextTransformChange]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Set up passive event listeners properly
  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;

    const handleMove = (e: TouchEvent) => {
      if (isDragging) {
        handleTouchMove(e as any);
      }
    };

    // Add event listener with passive: false only when needed
    if (isDragging) {
      element.addEventListener('touchmove', handleMove, { passive: false });
    }

    return () => {
      if (element) {
        element.removeEventListener('touchmove', handleMove);
      }
    };
  }, [isDragging, handleTouchMove]);

  const renderCurrentSide = () => {
    const sideUrl = currentViewSide === 'front' 
      ? (selectedMockupColor?.svg_front_url || mockup?.svg_front_url)
      : (selectedMockupColor?.svg_back_url || mockup?.svg_back_url);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {sideUrl && (
          <img 
            src={sideUrl} 
            alt={`${productName} ${currentViewSide}`}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: '90%' }}
          />
        )}
        
        {/* Design Layer */}
        {currentData.design && (
          <div
            className="absolute cursor-move"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${currentData.designTransform.position.x}px, ${currentData.designTransform.position.y}px) scale(${currentData.designTransform.scale}) rotate(${currentData.designTransform.rotation}deg)`,
              zIndex: 2
            }}
            onTouchStart={(e) => handleTouchStart(e, 'design')}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              src={currentData.design.image_url} 
              alt={currentData.design.name}
              className="max-w-[120px] max-h-[120px] object-contain pointer-events-none"
            />
          </div>
        )}

        {/* Text Layer */}
        {currentData.textContent && (
          <div
            className="absolute cursor-move"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${currentData.textTransform.position.x}px, ${currentData.textTransform.position.y}px) scale(${currentData.textTransform.scale}) rotate(${currentData.textTransform.rotation}deg)`,
              fontFamily: currentData.textFont,
              color: currentData.textColor,
              fontSize: '16px',
              fontWeight: currentData.textStyles.bold ? 'bold' : 'normal',
              fontStyle: currentData.textStyles.italic ? 'italic' : 'normal',
              textDecoration: currentData.textStyles.underline ? 'underline' : 'none',
              zIndex: 3,
              pointerEvents: 'auto'
            }}
            onTouchStart={(e) => handleTouchStart(e, 'text')}
            onTouchEnd={handleTouchEnd}
          >
            {currentData.textContent}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-gray-900/50 rounded-lg overflow-hidden">
      {/* Preview Area */}
      <div 
        ref={previewRef}
        className="relative w-full h-full"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {renderCurrentSide()}
      </div>

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
      {showControls && (currentData.design || currentData.textContent) && (
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex justify-center gap-1 bg-black/70 rounded-md p-1">
            {currentData.design && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onDesignTransformChange('scale', Math.max(0.5, currentData.designTransform.scale - 0.1))}
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onDesignTransformChange('scale', Math.min(2, currentData.designTransform.scale + 0.1))}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onDesignTransformChange('rotation', currentData.designTransform.rotation - 15)}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onDesignTransformChange('rotation', currentData.designTransform.rotation + 15)}
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
            
            {currentData.textContent && (
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
