
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, Palette, Type, Image as ImageIcon, Upload, Sparkles, Paintbrush } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { GalleryDesigns } from './GalleryDesigns';
import { UploadDesign } from './UploadDesign';
import { TextCustomizer } from './TextCustomizer';
import { SVGDesigns } from './SVGDesigns';
import { ProductPreview } from './ProductPreview';
import { ProductColorSelector } from './ProductColorSelector';
import { EnhancedProductPreview } from './EnhancedProductPreview';
import { CompactMobileTools } from './CompactMobileTools';
import { CompactAIGenerator } from './CompactAIGenerator';

interface ModalPersonnalisationProps {
  open: boolean;
  onClose: () => void;
  currentViewSide: 'front' | 'back';
  onViewSideChange: (side: 'front' | 'back') => void;

  // Product data
  productName: string;
  productImageUrl?: string;
  productAvailableColors?: string[];

  // Mockup data
  mockup?: any;
  selectedMockupColor: MockupColor | null;
  onMockupColorChange: (color: MockupColor) => void;

  // Design states
  selectedDesignFront: Design | null;
  selectedDesignBack: Design | null;
  onSelectDesign: (design: Design) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIImageGenerated: (imageUrl: string, imageName: string) => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;

  // SVG states
  svgColorFront: string;
  svgColorBack: string;
  svgContentFront: string;
  svgContentBack: string;
  onSvgColorChange: (color: string) => void;
  onSvgContentChange: (content: string) => void;

  // Text states
  textContentFront: string;
  textContentBack: string;
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
  textTransformFront: {
    position: {
      x: number;
      y: number;
    };
    scale: number;
    rotation: number;
  };
  textTransformBack: {
    position: {
      x: number;
      y: number;
    };
    scale: number;
    rotation: number;
  };
  onTextContentChange: (content: string) => void;
  onTextFontChange: (font: string) => void;
  onTextColorChange: (color: string) => void;
  onTextStylesChange: (styles: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }) => void;
  onTextTransformChange: (property: string, value: any) => void;

  // Design transform states
  designTransformFront: {
    position: {
      x: number;
      y: number;
    };
    scale: number;
    rotation: number;
  };
  designTransformBack: {
    position: {
      x: number;
      y: number;
    };
    scale: number;
    rotation: number;
  };
  selectedSizeFront: string;
  selectedSizeBack: string;
  onDesignTransformChange: (property: string, value: any) => void;
  onSizeChange: (size: string) => void;
}

export const ModalPersonnalisation: React.FC<ModalPersonnalisationProps> = ({
  open,
  onClose,
  currentViewSide,
  onViewSideChange,
  productName,
  productImageUrl,
  productAvailableColors,
  mockup,
  selectedMockupColor,
  onMockupColorChange,
  selectedDesignFront,
  selectedDesignBack,
  onSelectDesign,
  onFileUpload,
  onAIImageGenerated,
  onRemoveBackground,
  isRemovingBackground,
  svgColorFront,
  svgColorBack,
  svgContentFront,
  svgContentBack,
  onSvgColorChange,
  onSvgContentChange,
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
  onTextContentChange,
  onTextFontChange,
  onTextColorChange,
  onTextStylesChange,
  onTextTransformChange,
  designTransformFront,
  designTransformBack,
  selectedSizeFront,
  selectedSizeBack,
  onDesignTransformChange,
  onSizeChange
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('designs');

  // Memoized getters for better performance
  const currentData = useMemo(() => ({
    design: currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack,
    svgColor: currentViewSide === 'front' ? svgColorFront : svgColorBack,
    svgContent: currentViewSide === 'front' ? svgContentFront : svgContentBack,
    textContent: currentViewSide === 'front' ? textContentFront : textContentBack,
    textFont: currentViewSide === 'front' ? textFontFront : textFontBack,
    textColor: currentViewSide === 'front' ? textColorFront : textColorBack,
    textStyles: currentViewSide === 'front' ? textStylesFront : textStylesBack,
    textTransform: currentViewSide === 'front' ? textTransformFront : textTransformBack,
    designTransform: currentViewSide === 'front' ? designTransformFront : designTransformBack,
    selectedSize: currentViewSide === 'front' ? selectedSizeFront : selectedSizeBack
  }), [currentViewSide, selectedDesignFront, selectedDesignBack, svgColorFront, svgColorBack, svgContentFront, svgContentBack, textContentFront, textContentBack, textFontFront, textFontBack, textColorFront, textColorBack, textStylesFront, textStylesBack, textTransformFront, textTransformBack, designTransformFront, designTransformBack, selectedSizeFront, selectedSizeBack]);

  const filteredMockupColors = useMemo(() => {
    if (!mockup?.colors) return [];
    if (!productAvailableColors || productAvailableColors.length === 0) {
      return mockup.colors;
    }
    return mockup.colors.filter((mockupColor: MockupColor) => 
      productAvailableColors.some(availableColor => 
        mockupColor.name.toLowerCase().includes(availableColor.toLowerCase()) || 
        availableColor.toLowerCase().includes(mockupColor.name.toLowerCase())
      )
    );
  }, [mockup?.colors, productAvailableColors]);

  const hasTwoSides = mockup?.svg_back_url ? true : false;

  const handleDesignSelection = (design: Design) => {
    onSelectDesign(design);
  };

  const handleRemoveDesign = () => {
    // This would need to be passed as a prop or implemented
  };

  const handleRemoveText = () => {
    onTextContentChange('');
  };

  const desktopContent = (
    <div className="flex h-full gap-6">
      <div className="w-1/2 flex flex-col">
        <ProductPreview
          productName={productName}
          productImageUrl={productImageUrl}
          currentViewSide={currentViewSide}
          onViewSideChange={onViewSideChange}
          mockup={mockup}
          selectedMockupColor={selectedMockupColor}
          hasTwoSides={hasTwoSides}
          selectedDesignFront={selectedDesignFront}
          selectedDesignBack={selectedDesignBack}
          designTransformFront={designTransformFront}
          designTransformBack={designTransformBack}
          onDesignTransformChange={onDesignTransformChange}
          svgColorFront={svgColorFront}
          svgColorBack={svgColorBack}
          svgContentFront={svgContentFront}
          svgContentBack={svgContentBack}
          textContentFront={textContentFront}
          textContentBack={textContentBack}
          textFontFront={textFontFront}
          textFontBack={textFontBack}
          textColorFront={textColorFront}
          textColorBack={textColorBack}
          textStylesFront={textStylesFront}
          textStylesBack={textStylesBack}
          textTransformFront={textTransformFront}
          textTransformBack={textTransformBack}
          onTextTransformChange={onTextTransformChange}
        />
      </div>

      <div className="w-1/2 flex flex-col">
        {filteredMockupColors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Couleur du produit</h3>
            <ProductColorSelector
              colors={filteredMockupColors}
              selectedColor={selectedMockupColor}
              onColorSelect={onMockupColorChange}
            />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="designs" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Images</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">Texte</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">IA</span>
            </TabsTrigger>
            <TabsTrigger value="svg" className="flex items-center gap-2">
              <Paintbrush className="h-4 w-4" />
              <span className="hidden sm:inline">SVG</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="designs" className="h-full overflow-y-auto">
              <GalleryDesigns
                onSelectDesign={handleDesignSelection}
                selectedDesign={currentData.design}
                currentDesignTransform={currentData.designTransform}
                selectedSize={currentData.selectedSize}
                onDesignTransformChange={onDesignTransformChange}
                onSizeChange={onSizeChange}
              />
            </TabsContent>

            <TabsContent value="text" className="h-full overflow-y-auto">
              <TextCustomizer
                textContent={currentData.textContent}
                textFont={currentData.textFont}
                textColor={currentData.textColor}
                textStyles={currentData.textStyles}
                textTransform={currentData.textTransform}
                onTextContentChange={onTextContentChange}
                onTextFontChange={onTextFontChange}
                onTextColorChange={onTextColorChange}
                onTextStylesChange={onTextStylesChange}
                onTextTransformChange={onTextTransformChange}
              />
            </TabsContent>

            <TabsContent value="upload" className="h-full overflow-y-auto">
              <UploadDesign
                onFileUpload={onFileUpload}
                onRemoveBackground={onRemoveBackground}
                isRemovingBackground={isRemovingBackground}
                currentDesign={currentData.design}
              />
            </TabsContent>

            <TabsContent value="ai" className="h-full overflow-y-auto">
              <CompactAIGenerator onImageGenerated={onAIImageGenerated} />
            </TabsContent>

            <TabsContent value="svg" className="h-full overflow-y-auto">
              <SVGDesigns
                onSelectDesign={handleDesignSelection}
                selectedDesign={currentData.design}
                onFileUpload={onFileUpload}
                onSvgColorChange={onSvgColorChange}
                onSvgContentChange={onSvgContentChange}
                defaultSvgColor={currentData.svgColor}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );

  const optimizedMobileContent = (
    <div className="flex flex-col h-full">
      {/* Maximized preview area - 80% of screen */}
      <div 
        className="flex-1 px-1 pt-1 overflow-hidden"
        style={{ height: 'calc(100vh - 180px)' }}
      >
        <EnhancedProductPreview
          productName={productName}
          productImageUrl={productImageUrl}
          currentViewSide={currentViewSide}
          onViewSideChange={onViewSideChange}
          mockup={mockup}
          selectedMockupColor={selectedMockupColor}
          hasTwoSides={hasTwoSides}
          selectedDesignFront={selectedDesignFront}
          selectedDesignBack={selectedDesignBack}
          designTransformFront={designTransformFront}
          designTransformBack={designTransformBack}
          svgColorFront={svgColorFront}
          svgColorBack={svgColorBack}
          svgContentFront={svgContentFront}
          svgContentBack={svgContentBack}
          textContentFront={textContentFront}
          textContentBack={textContentBack}
          textFontFront={textFontFront}
          textFontBack={textFontBack}
          textColorFront={textColorFront}
          textColorBack={textColorBack}
          textStylesFront={textStylesFront}
          textStylesBack={textStylesBack}
          textTransformFront={textTransformFront}
          textTransformBack={textTransformBack}
          onDesignTransformChange={onDesignTransformChange}
          onTextTransformChange={onTextTransformChange}
          onRemoveDesign={handleRemoveDesign}
          onRemoveText={handleRemoveText}
        />
      </div>

      {/* Compacted options area - 20% of screen */}
      <div className="h-44 px-1 pb-1">
        <CompactMobileTools
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedDesign={currentData.design}
          designTransform={currentData.designTransform}
          selectedSize={currentData.selectedSize}
          onDesignTransformChange={onDesignTransformChange}
          onSizeChange={onSizeChange}
          onSelectDesign={handleDesignSelection}
          textContent={currentData.textContent}
          textFont={currentData.textFont}
          textColor={currentData.textColor}
          textStyles={currentData.textStyles}
          onTextContentChange={onTextContentChange}
          onTextFontChange={onTextFontChange}
          onTextColorChange={onTextColorChange}
          onTextStylesChange={onTextStylesChange}
          svgColor={currentData.svgColor}
          onSvgColorChange={onSvgColorChange}
          mockupColors={filteredMockupColors}
          selectedMockupColor={selectedMockupColor}
          onMockupColorChange={onMockupColorChange}
          onFileUpload={onFileUpload}
          onAIImageGenerated={onAIImageGenerated}
          onRemoveBackground={onRemoveBackground}
          isRemovingBackground={isRemovingBackground}
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DrawerContent className="bg-black/90 backdrop-blur-lg border-white/20 h-[100vh]">
          <DrawerHeader className="border-b border-white/10 pb-1 px-2 py-1">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-sm font-semibold">
                🎨 Personnalisation
              </DrawerTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden">
            {optimizedMobileContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl max-w-[95vw] w-[95vw] h-[95vh] overflow-hidden">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-2xl font-semibold">
            🎨 Personnalisation - {currentViewSide === 'front' ? 'Avant' : 'Arrière'}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Personnalisez votre produit avec des designs, du texte et des couleurs.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4 h-full overflow-hidden">
          {desktopContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};
