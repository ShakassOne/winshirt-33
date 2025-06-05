import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic, Underline } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { CompactDesignGallery } from './CompactDesignGallery';
import { CompactSVGGallery } from './CompactSVGGallery';
import { UploadDesign } from './UploadDesign';
import { AIDesignGenerator } from './AIDesignGenerator';

interface MobileQuickToolsProps {
  activeTab: string;
  
  // Design props
  selectedDesign: Design | null;
  designTransform: { position: { x: number; y: number }; scale: number; rotation: number };
  selectedSize: string;
  onDesignTransformChange: (property: string, value: any) => void;
  onSizeChange: (size: string) => void;
  onSelectDesign: (design: Design) => void;
  
  // Text props
  textContent: string;
  textFont: string;
  textColor: string;
  textStyles: { bold: boolean; italic: boolean; underline: boolean };
  onTextContentChange: (content: string) => void;
  onTextFontChange: (font: string) => void;
  onTextColorChange: (color: string) => void;
  onTextStylesChange: (styles: { bold: boolean; italic: boolean; underline: boolean }) => void;
  
  // SVG props
  isSvgDesign: boolean;
  svgColor: string;
  onSvgColorChange: (color: string) => void;
  
  // Product color props - filtered by product's available colors
  mockupColors?: MockupColor[];
  selectedMockupColor: MockupColor | null;
  onMockupColorChange: (color: MockupColor) => void;
  
  // Other props
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIImageGenerated: (imageUrl: string, imageName: string) => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;
}

export const MobileQuickTools: React.FC<MobileQuickToolsProps> = ({
  activeTab,
  selectedDesign,
  designTransform,
  selectedSize,
  onDesignTransformChange,
  onSizeChange,
  onSelectDesign,
  textContent,
  textFont,
  textColor,
  textStyles,
  onTextContentChange,
  onTextFontChange,
  onTextColorChange,
  onTextStylesChange,
  isSvgDesign,
  svgColor,
  onSvgColorChange,
  mockupColors,
  selectedMockupColor,
  onMockupColorChange,
  onFileUpload,
  onAIImageGenerated,
  onRemoveBackground,
  isRemovingBackground
}) => {
  const getActiveStylesValue = () => {
    const activeStyles = [];
    if (textStyles.bold) activeStyles.push('bold');
    if (textStyles.italic) activeStyles.push('italic');
    if (textStyles.underline) activeStyles.push('underline');
    return activeStyles;
  };

  const handleStyleChange = (values: string[]) => {
    onTextStylesChange({
      bold: values.includes('bold'),
      italic: values.includes('italic'),
      underline: values.includes('underline')
    });
  };

  if (activeTab === 'designs') {
    return (
      <Card className="bg-black/80 border-white/20 p-2 h-[50vh] overflow-y-auto">
        <CompactDesignGallery
          onSelectDesign={onSelectDesign}
          selectedDesign={selectedDesign}
        />
      </Card>
    );
  }

  if (activeTab === 'svg') {
    return (
      <Card className="bg-black/80 border-white/20 p-2 h-[50vh] overflow-y-auto">
        <div className="space-y-3">
          <CompactSVGGallery
            onSelectDesign={onSelectDesign}
            selectedDesign={selectedDesign}
            svgColor={svgColor}
            onSvgColorChange={onSvgColorChange}
          />
          {isSvgDesign && (
            <div className="border-t border-white/20 pt-3">
              <Label className="text-white text-xs mb-2 block">Couleur SVG</Label>
              <div className="flex flex-wrap gap-2">
                {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      svgColor === color ? 'border-white scale-110' : 'border-white/30'
                    } transition-all`}
                    style={{ backgroundColor: color }}
                    onClick={() => onSvgColorChange(color)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (activeTab === 'text') {
    return (
      <Card className="bg-black/80 border-white/20 p-3 space-y-3 h-[50vh] overflow-y-auto">
        <div>
          <Label className="text-white text-xs">Texte</Label>
          <Input
            value={textContent}
            onChange={(e) => onTextContentChange(e.target.value)}
            placeholder="Votre texte..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-8 text-sm mt-1"
          />
        </div>
        
        <div>
          <Label className="text-white text-xs">Couleur</Label>
          <div className="flex gap-2 mt-1">
            {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 ${
                  textColor === color ? 'border-white scale-110' : 'border-white/30'
                } transition-all`}
                style={{ backgroundColor: color }}
                onClick={() => onTextColorChange(color)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-white text-xs">Style</Label>
          <ToggleGroup 
            type="multiple" 
            className="mt-1 h-8"
            value={getActiveStylesValue()}
            onValueChange={handleStyleChange}
          >
            <ToggleGroupItem value="bold" className="h-8 w-8 p-0">
              <Bold className="h-3 w-3" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" className="h-8 w-8 p-0">
              <Italic className="h-3 w-3" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" className="h-8 w-8 p-0">
              <Underline className="h-3 w-3" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Card>
    );
  }

  if (activeTab === 'upload') {
    return (
      <Card className="bg-black/80 border-white/20 p-3 h-[50vh] overflow-y-auto">
        <UploadDesign
          onFileUpload={onFileUpload}
          onRemoveBackground={onRemoveBackground}
          isRemovingBackground={isRemovingBackground}
          currentDesign={selectedDesign}
        />
      </Card>
    );
  }

  if (activeTab === 'ai') {
    return (
      <Card className="bg-black/80 border-white/20 p-3 h-[50vh] overflow-y-auto">
        <AIDesignGenerator
          onImageGenerated={onAIImageGenerated}
        />
      </Card>
    );
  }

  if (activeTab === 'colors') {
    return (
      <Card className="bg-black/80 border-white/20 p-3 space-y-3 h-[50vh] overflow-y-auto">
        {mockupColors && mockupColors.length > 0 && (
          <div>
            <Label className="text-white text-xs">Couleur du produit</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {mockupColors.map((color) => (
                <button
                  key={color.id}
                  className={`aspect-square rounded-lg border-2 overflow-hidden ${
                    selectedMockupColor?.id === color.id ? 'border-white' : 'border-white/30'
                  }`}
                  onClick={() => onMockupColorChange(color)}
                >
                  <img
                    src={color.front_image_url}
                    alt={color.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {isSvgDesign && (
          <div>
            <Label className="text-white text-xs">Couleur du design</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${
                    svgColor === color ? 'border-white scale-110' : 'border-white/30'
                  } transition-all`}
                  style={{ backgroundColor: color }}
                  onClick={() => onSvgColorChange(color)}
                />
              ))}
            </div>
          </div>
        )}

        {!selectedDesign && !isSvgDesign && !mockupColors?.length && (
          <div className="text-center py-8 text-white/50 text-xs">
            Sélectionnez un design ou un produit pour voir les options de couleur
          </div>
        )}
      </Card>
    );
  }

  return null;
};
