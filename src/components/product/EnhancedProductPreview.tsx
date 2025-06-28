
import React, { useRef, useState, useCallback } from 'react';
import { RotateCcw, Move, RotateCw, ZoomIn, ZoomOut, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { UnifiedCustomizationRenderer } from './UnifiedCustomizationRenderer';
import { ElementManipulationControls } from './ElementManipulationControls';

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
  const [selectedElement, setSelectedElement] = useState<'design' | 'text' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [initialScale, setInitialScale] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [rotateStart, setRotateStart] = useState({ x: 0, y: 0 });
  const [initialRotation, setInitialRotation] = useState(0);

  const currentData = {
    design: currentViewSide === 'front' ? customization?.frontDesign : customization?.backDesign,
    text: currentViewSide === 'front' ? customization?.frontText : customization?.backText
  };

  const getProductImage = () => {
    if (selectedMockupColor) {
      return currentViewSide === 'front'
        ? selectedMockupColor.front_image_url
        : selectedMockupColor.back_image_url || productImageUrl;
    } else if (mockup) {
      return currentViewSide === 'front'
        ? mockup.svg_front_url
        : mockup.svg_back_url || productImageUrl;
    }
    return productImageUrl;
  };

  // Drag handlers
  const handleElementMouseDown = useCallback((elementType: 'design' | 'text', e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const currentTransform = elementType === 'design' ? currentData.design?.transform : currentData.text?.transform;
    if (!currentTransform) return;
    
    setSelectedElement(elementType);
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setInitialPosition(currentTransform.position);
  }, [currentData]);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !selectedElement) return;
    
    e.preventDefault();
    
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    const newPosition = {
      x: initialPosition.x + deltaX,
      y: initialPosition.y + deltaY
    };
    
    if (selectedElement === 'design') {
      onDesignTransformChange('position', newPosition);
    } else if (selectedElement === 'text') {
      onTextTransformChange('position', newPosition);
    }
  }, [isDragging, selectedElement, dragStart, initialPosition, onDesignTransformChange, onTextTransformChange]);

  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isResizing || !selectedElement) return;
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const deltaX = clientX - resizeStart.x;
    const newScale = Math.max(0.1, initialScale + deltaX / 150);
    if (selectedElement === 'design') {
      onDesignTransformChange('scale', newScale);
    } else {
      onTextTransformChange('scale', newScale);
    }
  }, [isResizing, selectedElement, resizeStart, initialScale, onDesignTransformChange, onTextTransformChange]);

  const handleRotateMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isRotating || !selectedElement) return;
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const delta = clientX - rotateStart.x;
    const newRotation = initialRotation + delta;
    if (selectedElement === 'design') {
      onDesignTransformChange('rotation', newRotation);
    } else {
      onTextTransformChange('rotation', newRotation);
    }
  }, [isRotating, selectedElement, rotateStart, initialRotation, onDesignTransformChange, onTextTransformChange]);

  const startResize = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedElement) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const currentTransform = selectedElement === 'design' ? currentData.design?.transform : currentData.text?.transform;
    if (!currentTransform) return;
    setIsResizing(true);
    setResizeStart({ x: clientX, y: 0 });
    setInitialScale(currentTransform.scale);
  }, [selectedElement, currentData]);

  const startRotate = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedElement) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const currentTransform = selectedElement === 'design' ? currentData.design?.transform : currentData.text?.transform;
    if (!currentTransform) return;
    setIsRotating(true);
    setRotateStart({ x: clientX, y: 0 });
    setInitialRotation(currentTransform.rotation);
  }, [selectedElement, currentData]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  }, []);

  // Global event listeners for drag / resize / rotate
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('touchmove', handleResizeMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('touchmove', handleResizeMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isResizing, handleResizeMove, handleMouseUp]);

  React.useEffect(() => {
    if (isRotating) {
      document.addEventListener('mousemove', handleRotateMove);
      document.addEventListener('touchmove', handleRotateMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleRotateMove);
        document.removeEventListener('touchmove', handleRotateMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isRotating, handleRotateMove, handleMouseUp]);

  // Deselect when clicking outside
  const handleBackgroundClick = useCallback(() => {
    setSelectedElement(null);
  }, []);

  const handleElementClick = useCallback((elementType: 'design' | 'text', e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(elementType);
  }, []);

  return (
    <>
      <div className="relative w-full h-full bg-gray-900/50 rounded-lg overflow-hidden" onClick={handleBackgroundClick}>
        {/* Preview Area avec rendu unifié - Vue principale visible */}
        <div 
          ref={previewRef}
          className="relative w-full h-full"
        >
          <div className="w-full h-full">
            <UnifiedCustomizationRenderer
              customization={customization}
              side={currentViewSide}
              withBackground={true}
              backgroundUrl={getProductImage()}
              className="w-full h-full"
            />
          </div>

          {/* Interactive design element */}
          {currentData.design && (
            <div
              className={`absolute cursor-move select-none ${
                selectedElement === 'design' ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
              }`}
              style={{
                transform: `translate(${currentData.design.transform.position.x}px, ${currentData.design.transform.position.y}px) rotate(${currentData.design.transform.rotation}deg) scale(${currentData.design.transform.scale})`,
                transformOrigin: 'center',
                zIndex: 10,
                left: '50%',
                top: '50%',
                marginLeft: '-100px',
                marginTop: '-100px'
              }}
              onMouseDown={(e) => handleElementMouseDown('design', e)}
              onTouchStart={(e) => handleElementMouseDown('design', e)}
              onClick={(e) => handleElementClick('design', e)}
            >
              <img
                src={currentData.design.designUrl}
                alt={currentData.design.designName}
                className="max-w-[200px] max-h-[200px] w-auto h-auto pointer-events-none"
                draggable={false}
              />
              {selectedElement === 'design' && (
                <>
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full border border-black"
                    onMouseDown={startResize}
                    onTouchStart={startResize}
                  />
                  <div
                    className="absolute -top-5 left-1/2 -ml-2 w-4 h-4 bg-white rounded-full border border-black"
                    onMouseDown={startRotate}
                    onTouchStart={startRotate}
                  />
                  <button
                    className="absolute -top-5 -right-5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center"
                    onClick={onRemoveDesign}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Interactive text element */}
          {currentData.text && (
            <div
              className={`absolute cursor-move select-none ${
                selectedElement === 'text' ? 'ring-2 ring-green-400 ring-opacity-50' : ''
              }`}
              style={{
                transform: `translate(${currentData.text.transform.position.x}px, ${currentData.text.transform.position.y}px) rotate(${currentData.text.transform.rotation}deg) scale(${currentData.text.transform.scale})`,
                transformOrigin: 'center',
                fontFamily: currentData.text.font,
                color: currentData.text.color,
                fontWeight: currentData.text.styles.bold ? 'bold' : 'normal',
                fontStyle: currentData.text.styles.italic ? 'italic' : 'normal',
                textDecoration: currentData.text.styles.underline ? 'underline' : 'none',
                fontSize: '24px',
                textShadow: '0px 0px 3px rgba(0,0,0,0.5)',
                zIndex: 20,
                left: '50%',
                top: '50%'
              }}
              onMouseDown={(e) => handleElementMouseDown('text', e)}
              onTouchStart={(e) => handleElementMouseDown('text', e)}
              onClick={(e) => handleElementClick('text', e)}
            >
              {currentData.text.content}
              {selectedElement === 'text' && (
                <>
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full border border-black"
                    onMouseDown={startResize}
                    onTouchStart={startResize}
                  />
                  <div
                    className="absolute -top-5 left-1/2 -ml-2 w-4 h-4 bg-white rounded-full border border-black"
                    onMouseDown={startRotate}
                    onTouchStart={startRotate}
                  />
                  <button
                    className="absolute -top-5 -right-5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center"
                    onClick={onRemoveText}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
          )}
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

        {/* Element Manipulation Controls */}
        {showControls && selectedElement && (
          <ElementManipulationControls
            elementType={selectedElement}
            transform={selectedElement === 'design' ? currentData.design?.transform : currentData.text?.transform}
            onTransformChange={selectedElement === 'design' ? onDesignTransformChange : onTextTransformChange}
            onRemove={selectedElement === 'design' ? onRemoveDesign : onRemoveText}
            onDeselect={() => setSelectedElement(null)}
          />
        )}

        {/* Quick Controls (simplified when element is selected) */}
        {showControls && !selectedElement && (currentData.design || currentData.text) && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex justify-center gap-1 bg-black/70 rounded-md p-1">
              {currentData.design && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-white/70 hover:text-white"
                  onClick={() => setSelectedElement('design')}
                >
                  <Move className="h-3 w-3 mr-1" />
                  Design
                </Button>
              )}
              
              {currentData.text && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-white/70 hover:text-white"
                  onClick={() => setSelectedElement('text')}
                >
                  <Move className="h-3 w-3 mr-1" />
                  Texte
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
