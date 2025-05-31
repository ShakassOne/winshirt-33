
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, Palette, Type, Image as ImageIcon, Upload } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { GalleryDesigns } from './GalleryDesigns';
import { UploadDesign } from './UploadDesign';
import { TextCustomizer } from './TextCustomizer';
import { SVGColorEditor } from './SVGColorEditor';
import { ProductPreview } from './ProductPreview';

interface ModalPersonnalisationProps {
  open: boolean;
  onClose: () => void;
  currentViewSide: 'front' | 'back';
  onViewSideChange: (side: 'front' | 'back') => void;
  
  // Product data
  productName: string;
  productImageUrl?: string;
  
  // Mockup data
  mockup?: any;
  selectedMockupColor: MockupColor | null;
  mockupColors?: MockupColor[];
  onColorSelect?: (color: MockupColor) => void;
  
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
  textStylesFront: { bold: boolean; italic: boolean; underline: boolean };
  textStylesBack: { bold: boolean; italic: boolean; underline: boolean };
  textTransformFront: { position: { x: number; y: number }; scale: number; rotation: number };
  textTransformBack: { position: { x: number; y: number }; scale: number; rotation: number };
  onTextContentChange: (content: string) => void;
  onTextFontChange: (font: string) => void;
  onTextColorChange: (color: string) => void;
  onTextStylesChange: (styles: { bold: boolean; italic: boolean; underline: boolean }) => void;
  onTextTransformChange: (property: string, value: any) => void;
  
  // Design transform states
  designTransformFront: { position: { x: number; y: number }; scale: number; rotation: number };
  designTransformBack: { position: { x: number; y: number }; scale: number; rotation: number };
  selectedSizeFront: string;
  selectedSizeBack: string;
  onDesignTransformChange: (property: string, value: any) => void;
  onSizeChange: (size: string) => void;
  
  // Interaction handlers
  onDesignMouseDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  onTextMouseDown?: (e: React.MouseEvent | React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
}

export const ModalPersonnalisation: React.FC<ModalPersonnalisationProps> = ({
  open,
  onClose,
  currentViewSide,
  onViewSideChange,
  productName,
  productImageUrl,
  mockup,
  selectedMockupColor,
  mockupColors = [],
  onColorSelect,
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
  onSizeChange,
  onDesignMouseDown,
  onTextMouseDown,
  onTouchMove
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('designs');

  const getCurrentDesign = () => {
    return currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack;
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

  const getCurrentTextFont = () => {
    return currentViewSide === 'front' ? textFontFront : textFontBack;
  };

  const getCurrentTextColor = () => {
    return currentViewSide === 'front' ? textColorFront : textColorBack;
  };

  const getCurrentTextStyles = () => {
    return currentViewSide === 'front' ? textStylesFront : textStylesBack;
  };

  const getCurrentTextTransform = () => {
    return currentViewSide === 'front' ? textTransformFront : textTransformBack;
  };

  const getCurrentDesignTransform = () => {
    return currentViewSide === 'front' ? designTransformFront : designTransformBack;
  };

  const getCurrentSelectedSize = () => {
    return currentViewSide === 'front' ? selectedSizeFront : selectedSizeBack;
  };

  const isSvgDesign = () => {
    const currentDesign = getCurrentDesign();
    if (!currentDesign?.image_url) return false;
    
    const url = currentDesign.image_url.toLowerCase();
    return url.includes('.svg') || url.includes('svg') || currentDesign.image_url.includes('data:image/svg');
  };

  const hasTwoSides = mockup?.svg_back_url ? true : false;

  // Wrappers pour ne pas fermer la modal
  const handleSelectDesignWrapper = (design: Design) => {
    onSelectDesign(design);
    // Ne pas fermer la modal - garder open = true
  };

  const handleFileUploadWrapper = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileUpload(event);
    // Ne pas fermer la modal - garder open = true
  };

  const handleAIImageGeneratedWrapper = (imageUrl: string, imageName: string) => {
    onAIImageGenerated(imageUrl, imageName);
    // Ne pas fermer la modal - garder open = true
  };

  // Desktop layout avec proportions ajustées (40% preview / 60% outils)
  const desktopContent = (
    <div className="flex h-full gap-6">
      {/* Colonne de gauche - Preview (40%) */}
      <div className="w-2/5 flex flex-col">
        <ProductPreview
          productName={productName}
          productImageUrl={productImageUrl}
          currentViewSide={currentViewSide}
          onViewSideChange={onViewSideChange}
          mockup={mockup}
          selectedMockupColor={selectedMockupColor}
          mockupColors={mockupColors}
          onColorSelect={onColorSelect}
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
          onDesignMouseDown={onDesignMouseDown}
          onTextMouseDown={onTextMouseDown}
          onTouchMove={onTouchMove}
        />
      </div>

      {/* Colonne de droite - Outils (60%) */}
      <div className="w-3/5 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="designs" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Designs</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">Texte</span>
            </TabsTrigger>
            <TabsTrigger value="svg" className="flex items-center gap-2" disabled={!isSvgDesign()}>
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">SVG</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="designs" className="h-full overflow-y-auto">
              <GalleryDesigns
                onSelectDesign={handleSelectDesignWrapper}
                selectedDesign={getCurrentDesign()}
                currentDesignTransform={getCurrentDesignTransform()}
                selectedSize={getCurrentSelectedSize()}
                onDesignTransformChange={onDesignTransformChange}
                onSizeChange={onSizeChange}
              />
            </TabsContent>

            <TabsContent value="upload" className="h-full overflow-y-auto">
              <UploadDesign
                onFileUpload={handleFileUploadWrapper}
                onAIImageGenerated={handleAIImageGeneratedWrapper}
                onRemoveBackground={onRemoveBackground}
                isRemovingBackground={isRemovingBackground}
                currentDesign={getCurrentDesign()}
              />
            </TabsContent>

            <TabsContent value="text" className="h-full overflow-y-auto">
              <TextCustomizer
                textContent={getCurrentTextContent()}
                textFont={getCurrentTextFont()}
                textColor={getCurrentTextColor()}
                textStyles={getCurrentTextStyles()}
                textTransform={getCurrentTextTransform()}
                onTextContentChange={onTextContentChange}
                onTextFontChange={onTextFontChange}
                onTextColorChange={onTextColorChange}
                onTextStylesChange={onTextStylesChange}
                onTextTransformChange={onTextTransformChange}
              />
            </TabsContent>

            <TabsContent value="svg" className="h-full overflow-y-auto">
              {isSvgDesign() && getCurrentDesign() && (
                <SVGColorEditor
                  imageUrl={getCurrentDesign()!.image_url}
                  onColorChange={onSvgColorChange}
                  onSvgContentChange={onSvgContentChange}
                  defaultColor={getCurrentSvgColor()}
                />
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between pt-4 border-t border-white/10 mt-4">
          <Button variant="outline" onClick={onClose} className="px-6">
            Annuler
          </Button>
          <Button onClick={onClose} className="px-6 bg-gradient-to-r from-winshirt-purple to-winshirt-blue">
            Valider
          </Button>
        </div>
      </div>
    </div>
  );

  // Mobile layout avec onglets
  const mobileContent = (
    <div className="space-y-4">
      <ProductPreview
        productName={productName}
        productImageUrl={productImageUrl}
        currentViewSide={currentViewSide}
        onViewSideChange={onViewSideChange}
        mockup={mockup}
        selectedMockupColor={selectedMockupColor}
        mockupColors={mockupColors}
        onColorSelect={onColorSelect}
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
        onDesignMouseDown={onDesignMouseDown}
        onTextMouseDown={onTextMouseDown}
        onTouchMove={onTouchMove}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="designs" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="text-xs">Designs</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="text-xs">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span className="text-xs">Texte</span>
          </TabsTrigger>
          <TabsTrigger value="svg" className="flex items-center gap-2" disabled={!isSvgDesign()}>
            <Palette className="h-4 w-4" />
            <span className="text-xs">SVG</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="designs" className="space-y-4">
          <GalleryDesigns
            onSelectDesign={handleSelectDesignWrapper}
            selectedDesign={getCurrentDesign()}
            currentDesignTransform={getCurrentDesignTransform()}
            selectedSize={getCurrentSelectedSize()}
            onDesignTransformChange={onDesignTransformChange}
            onSizeChange={onSizeChange}
          />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <UploadDesign
            onFileUpload={handleFileUploadWrapper}
            onAIImageGenerated={handleAIImageGeneratedWrapper}
            onRemoveBackground={onRemoveBackground}
            isRemovingBackground={isRemovingBackground}
            currentDesign={getCurrentDesign()}
          />
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <TextCustomizer
            textContent={getCurrentTextContent()}
            textFont={getCurrentTextFont()}
            textColor={getCurrentTextColor()}
            textStyles={getCurrentTextStyles()}
            textTransform={getCurrentTextTransform()}
            onTextContentChange={onTextContentChange}
            onTextFontChange={onTextFontChange}
            onTextColorChange={onTextColorChange}
            onTextStylesChange={onTextStylesChange}
            onTextTransformChange={onTextTransformChange}
          />
        </TabsContent>

        <TabsContent value="svg" className="space-y-4">
          {isSvgDesign() && getCurrentDesign() && (
            <SVGColorEditor
              imageUrl={getCurrentDesign()!.image_url}
              onColorChange={onSvgColorChange}
              onSvgContentChange={onSvgContentChange}
              defaultColor={getCurrentSvgColor()}
            />
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4 border-t border-white/10">
        <Button variant="outline" onClick={onClose} className="px-6">
          Annuler
        </Button>
        <Button onClick={onClose} className="px-6 bg-gradient-to-r from-winshirt-purple to-winshirt-blue">
          Valider
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="bg-black/90 backdrop-blur-lg border-white/20 max-h-[95vh]">
          <DrawerHeader className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-xl font-semibold">
                🎨 Personnalisation
              </DrawerTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto">
            {mobileContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-lg border-white/20 max-w-[95vw] w-[95vw] h-[95vh] overflow-hidden">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold">
              🎨 Personnalisation - {currentViewSide === 'front' ? 'Avant' : 'Arrière'}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        <div className="pt-4 h-full overflow-hidden">
          {desktopContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};
