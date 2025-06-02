
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PenTool, Palette, Type, RotateCw, Move, Settings } from 'lucide-react';
import { Design } from '@/types/supabase.types';

interface QuickCustomizationToolsProps {
  // Design tools
  selectedDesign: Design | null;
  designTransform: { position: { x: number; y: number }; scale: number; rotation: number };
  onDesignTransformChange: (property: string, value: any) => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  
  // Text tools
  textContent: string;
  textFont: string;
  textColor: string;
  onTextContentChange: (text: string) => void;
  onTextFontChange: (font: string) => void;
  onTextColorChange: (color: string) => void;
  
  // SVG tools
  isSvgDesign: boolean;
  svgColor: string;
  onSvgColorChange: (color: string) => void;
  
  // Side management
  currentViewSide: 'front' | 'back';
  onViewSideChange: (side: 'front' | 'back') => void;
  hasBackSide: boolean;
  
  // Modal control
  onOpenModal: () => void;
}

const QuickCustomizationTools: React.FC<QuickCustomizationToolsProps> = ({
  selectedDesign,
  designTransform,
  onDesignTransformChange,
  selectedSize,
  onSizeChange,
  textContent,
  textFont,
  textColor,
  onTextContentChange,
  onTextFontChange,
  onTextColorChange,
  isSvgDesign,
  svgColor,
  onSvgColorChange,
  currentViewSide,
  onViewSideChange,
  hasBackSide,
  onOpenModal
}) => {
  const hasDesign = !!selectedDesign;
  const hasText = !!textContent.trim();
  const hasAnyCustomization = hasDesign || hasText;

  if (!hasAnyCustomization) return null;

  const sizeOptions = [
    { label: 'A3', value: 'A3' },
    { label: 'A4', value: 'A4' },
    { label: 'A5', value: 'A5' },
    { label: 'A6', value: 'A6' },
    { label: 'A7', value: 'A7' }
  ];

  const fontOptions = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display',
    'Raleway', 'Nunito', 'Oswald', 'Poppins', 'Ubuntu'
  ];

  return (
    <div className="mt-4 p-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PenTool className="h-4 w-4 text-winshirt-purple" />
          <span className="text-sm font-medium">Outils rapides</span>
          <Badge variant="outline" className="text-xs">
            {currentViewSide === 'front' ? 'Avant' : 'Arrière'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {hasBackSide && (
            <ToggleGroup 
              type="single" 
              value={currentViewSide} 
              onValueChange={(value) => value && onViewSideChange(value as 'front' | 'back')}
              size="sm"
            >
              <ToggleGroupItem value="front" className="text-xs">Avant</ToggleGroupItem>
              <ToggleGroupItem value="back" className="text-xs">Arrière</ToggleGroupItem>
            </ToggleGroup>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenModal}
            className="text-xs"
          >
            <Settings className="h-3 w-3 mr-1" />
            Plus d'options
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Design Tools */}
        {hasDesign && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium">Design: {selectedDesign.name}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Size Selection */}
              <div className="space-y-2">
                <label className="text-xs text-white/70">Taille</label>
                <Select value={selectedSize} onValueChange={onSizeChange}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Scale Control */}
              <div className="space-y-2">
                <label className="text-xs text-white/70">
                  Échelle: {Math.round(designTransform.scale * 100)}%
                </label>
                <Slider
                  value={[designTransform.scale * 100]}
                  onValueChange={(value) => onDesignTransformChange('scale', value[0] / 100)}
                  max={200}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>

              {/* Rotation Control */}
              <div className="space-y-2">
                <label className="text-xs text-white/70">
                  Rotation: {designTransform.rotation}°
                </label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[designTransform.rotation]}
                    onValueChange={(value) => onDesignTransformChange('rotation', value[0])}
                    max={360}
                    min={-360}
                    step={15}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDesignTransformChange('rotation', 0)}
                    className="h-6 w-6 p-0"
                  >
                    <RotateCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* SVG Color Control */}
            {isSvgDesign && (
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-green-400" />
                <span className="text-xs text-white/70">Couleur SVG:</span>
                <input
                  type="color"
                  value={svgColor}
                  onChange={(e) => onSvgColorChange(e.target.value)}
                  className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                />
                <span className="text-xs text-white/50">{svgColor}</span>
              </div>
            )}
          </div>
        )}

        {/* Text Tools */}
        {hasText && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">Texte: "{textContent.substring(0, 20)}{textContent.length > 20 ? '...' : ''}"</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Text Content */}
              <div className="space-y-2">
                <label className="text-xs text-white/70">Contenu</label>
                <input
                  type="text"
                  value={textContent}
                  onChange={(e) => onTextContentChange(e.target.value)}
                  className="w-full h-8 px-2 text-xs bg-black/40 border border-white/20 rounded focus:outline-none focus:border-winshirt-purple"
                  placeholder="Votre texte..."
                />
              </div>

              {/* Font Selection */}
              <div className="space-y-2">
                <label className="text-xs text-white/70">Police</label>
                <Select value={textFont} onValueChange={onTextFontChange}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-40">
                    {fontOptions.map(font => (
                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Text Color */}
              <div className="space-y-2">
                <label className="text-xs text-white/70">Couleur</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => onTextColorChange(e.target.value)}
                    className="w-8 h-6 rounded border border-white/20 cursor-pointer"
                  />
                  <span className="text-xs text-white/50">{textColor}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickCustomizationTools;
