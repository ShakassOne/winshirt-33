
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Bold, Italic, Underline } from 'lucide-react';
import { Design } from '@/types/supabase.types';

interface MobileQuickToolsProps {
  activeTab: string;
  
  // Design props
  selectedDesign: Design | null;
  designTransform: { position: { x: number; y: number }; scale: number; rotation: number };
  selectedSize: string;
  onDesignTransformChange: (property: string, value: any) => void;
  onSizeChange: (size: string) => void;
  
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
  
  // Other props
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIImageGenerated: (imageUrl: string, imageName: string) => void;
}

export const MobileQuickTools: React.FC<MobileQuickToolsProps> = ({
  activeTab,
  selectedDesign,
  designTransform,
  selectedSize,
  onDesignTransformChange,
  onSizeChange,
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
  onFileUpload,
  onAIImageGenerated
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

  if (activeTab === 'text') {
    return (
      <Card className="bg-black/80 border-white/20 p-4 space-y-4">
        <div>
          <Label className="text-white">Texte</Label>
          <Input
            value={textContent}
            onChange={(e) => onTextContentChange(e.target.value)}
            placeholder="Votre texte..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        <div>
          <Label className="text-white">Couleur</Label>
          <div className="flex gap-2 mt-2">
            {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-full border-2 ${
                  textColor === color ? 'border-white' : 'border-white/30'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onTextColorChange(color)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-white">Style</Label>
          <ToggleGroup 
            type="multiple" 
            className="mt-2"
            value={getActiveStylesValue()}
            onValueChange={handleStyleChange}
          >
            <ToggleGroupItem value="bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Card>
    );
  }

  if (activeTab === 'upload') {
    return (
      <Card className="bg-black/80 border-white/20 p-4 space-y-4">
        <div>
          <Label className="text-white">Télécharger une image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileUpload}
            className="w-full mt-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-winshirt-purple file:text-white"
          />
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue"
          onClick={() => {
            // This would trigger AI image generation
            console.log('Generate AI image');
          }}
        >
          Générer avec l'IA
        </Button>
      </Card>
    );
  }

  if (activeTab === 'colors' && (selectedDesign || isSvgDesign)) {
    return (
      <Card className="bg-black/80 border-white/20 p-4 space-y-4">
        {isSvgDesign && (
          <div>
            <Label className="text-white">Couleur du design</Label>
            <div className="flex gap-2 mt-2">
              {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${
                    svgColor === color ? 'border-white' : 'border-white/30'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onSvgColorChange(color)}
                />
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  }

  return null;
};
