import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ImageIcon, Type, Upload, Sparkles, Paintbrush, Bold, Italic, Underline } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { CompactDesignGallery } from './CompactDesignGallery';
import { CompactSVGGallery } from './CompactSVGGallery';
import { CompactUpload } from './CompactUpload';
import { CompactAIGenerator } from './CompactAIGenerator';

interface CompactMobileToolsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  
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
  svgColor: string;
  onSvgColorChange: (color: string) => void;
  
  // Product color props
  mockupColors?: MockupColor[];
  selectedMockupColor: MockupColor | null;
  onMockupColorChange: (color: MockupColor) => void;
  
  // Other props
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIImageGenerated: (imageUrl: string, imageName: string) => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;
}

export const CompactMobileTools: React.FC<CompactMobileToolsProps> = ({
  activeTab,
  onTabChange,
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
  const activeStylesValue = useMemo(() => {
    const activeStyles = [];
    if (textStyles.bold) activeStyles.push('bold');
    if (textStyles.italic) activeStyles.push('italic');
    if (textStyles.underline) activeStyles.push('underline');
    return activeStyles;
  }, [textStyles]);

  const colorOptions = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'];

  const handleStyleChange = (values: string[]) => {
    onTextStylesChange({
      bold: values.includes('bold'),
      italic: values.includes('italic'),
      underline: values.includes('underline')
    });
  };

  const isSvgDesign = () => {
    if (!selectedDesign?.image_url) return false;
    const url = selectedDesign.image_url.toLowerCase();
    return url.includes('.svg') || url.includes('svg') || selectedDesign.image_url.includes('data:image/svg');
  };

  const ColorButton = ({ color, isSelected, onClick }: { color: string; isSelected: boolean; onClick: () => void }) => (
    <button
      className={`w-6 h-6 rounded-full border ${
        isSelected ? 'border-white scale-110' : 'border-white/30'
      } transition-all`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );

  return (
    <div className="h-full flex flex-col">
      {/* Compact tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-5 mb-1 h-8">
          <TabsTrigger value="designs" className="flex items-center gap-1 text-xs py-1">
            <ImageIcon className="h-3 w-3" />
            <span className="hidden sm:inline">Images</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-1 text-xs py-1">
            <Type className="h-3 w-3" />
            <span className="hidden sm:inline">Texte</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-1 text-xs py-1">
            <Upload className="h-3 w-3" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1 text-xs py-1">
            <Sparkles className="h-3 w-3" />
            <span className="hidden sm:inline">IA</span>
          </TabsTrigger>
          <TabsTrigger value="svg" className="flex items-center gap-1 text-xs py-1">
            <Paintbrush className="h-3 w-3" />
            <span className="hidden sm:inline">SVG</span>
          </TabsTrigger>
        </TabsList>

        {/* Compact content area */}
        <div className="flex-1 overflow-hidden bg-black/40 rounded border border-white/10">
          <TabsContent value="designs" className="h-full overflow-y-auto p-2 m-0">
            <CompactDesignGallery
              onSelectDesign={onSelectDesign}
              selectedDesign={selectedDesign}
            />
          </TabsContent>

          <TabsContent value="text" className="h-full overflow-y-auto p-2 m-0 space-y-2">
            <div>
              <Label className="text-white text-xs">Texte</Label>
              <Input
                value={textContent}
                onChange={(e) => onTextContentChange(e.target.value)}
                placeholder="Votre texte..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-xs h-6 mt-1"
              />
            </div>
            
            <div>
              <Label className="text-white text-xs">Couleur</Label>
              <div className="flex gap-1 mt-1">
                {colorOptions.map((color) => (
                  <ColorButton
                    key={color}
                    color={color}
                    isSelected={textColor === color}
                    onClick={() => onTextColorChange(color)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-white text-xs">Style</Label>
              <ToggleGroup 
                type="multiple" 
                className="mt-1 h-6"
                value={activeStylesValue}
                onValueChange={handleStyleChange}
              >
                <ToggleGroupItem value="bold" className="h-6 w-6 p-0">
                  <Bold className="h-3 w-3" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" className="h-6 w-6 p-0">
                  <Italic className="h-3 w-3" />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" className="h-6 w-6 p-0">
                  <Underline className="h-3 w-3" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Product colors in text tab */}
            {mockupColors && mockupColors.length > 0 && (
              <div>
                <Label className="text-white text-xs">Couleur produit</Label>
                <div className="grid grid-cols-6 gap-1 mt-1">
                  {mockupColors.slice(0, 6).map((color) => (
                    <button
                      key={color.id}
                      className={`aspect-square rounded border ${
                        selectedMockupColor?.id === color.id ? 'border-white' : 'border-white/30'
                      }`}
                      onClick={() => onMockupColorChange(color)}
                    >
                      <img
                        src={color.front_image_url}
                        alt={color.name}
                        className="w-full h-full object-cover rounded"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="h-full overflow-y-auto p-2 m-0">
            <CompactUpload
              onFileUpload={onFileUpload}
              onRemoveBackground={onRemoveBackground}
              isRemovingBackground={isRemovingBackground}
              currentDesign={selectedDesign}
            />
          </TabsContent>

          <TabsContent value="ai" className="h-full overflow-y-auto p-2 m-0">
            <CompactAIGenerator
              onImageGenerated={onAIImageGenerated}
            />
          </TabsContent>

          <TabsContent value="svg" className="h-full overflow-y-auto p-2 m-0 space-y-2">
            <CompactSVGGallery
              onSelectDesign={onSelectDesign}
              selectedDesign={selectedDesign}
              svgColor={svgColor}
              onSvgColorChange={onSvgColorChange}
            />
            
            {isSvgDesign() && (
              <div>
                <Label className="text-white text-xs">Couleur SVG</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {[...colorOptions, '#ff00ff', '#00ffff'].map((color) => (
                    <ColorButton
                      key={color}
                      color={color}
                      isSelected={svgColor === color}
                      onClick={() => onSvgColorChange(color)}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
