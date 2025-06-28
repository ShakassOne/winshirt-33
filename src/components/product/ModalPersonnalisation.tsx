
import logger from '@/utils/logger';

import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, Palette, Type, Image as ImageIcon, Upload, Sparkles, Paintbrush } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import { GalleryDesigns } from './GalleryDesigns';
import { CompactUpload } from './CompactUpload';
import { TextCustomizer } from './TextCustomizer';
import { SVGDesigns } from './SVGDesigns';
import { ProductPreview } from './ProductPreview';
import { ProductColorSelector } from './ProductColorSelector';
import { EnhancedProductPreview } from './EnhancedProductPreview';
import { MobileToolsPanel } from './MobileToolsPanel';
import { CompactAIGenerator } from './CompactAIGenerator';
import { UnifiedEditingControls } from './UnifiedEditingControls';

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
  setSelectedDesignFront: (design: Design | null) => void;
  setSelectedDesignBack: (design: Design | null) => void;
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
  productAvailableColors,
  mockup,
  selectedMockupColor,
  onMockupColorChange,
  selectedDesignFront,
  selectedDesignBack,
  onSelectDesign,
  onFileUpload,
  onAIImageGenerated,
  setSelectedDesignFront,
  setSelectedDesignBack,
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
  designTransformFront,
  designTransformBack,
  selectedSizeFront,
  selectedSizeBack,
  onTextContentChange,
  onTextFontChange,
  onTextColorChange,
  onTextStylesChange,
  onTextTransformChange,
  onDesignTransformChange,
  onSizeChange,
  onDesignMouseDown,
  onTextMouseDown,
  onTouchMove
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('designs');
  const [drawerTab, setDrawerTab] = useState<string | null>(null);

  const openDrawer = (tab: string) => {
    setActiveTab(tab);
    setDrawerTab(tab);
  };

  const closeDrawer = () => setDrawerTab(null);

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

  // Créer la structure de données unifiée pour le nouveau composant
  const unifiedCustomization = useMemo(() => {
    const frontDesign = selectedDesignFront ? {
      designId: selectedDesignFront.id,
      designUrl: selectedDesignFront.image_url,
      designName: selectedDesignFront.name,
      printSize: selectedSizeFront || 'A4',
      transform: designTransformFront
    } : null;

    const backDesign = selectedDesignBack ? {
      designId: selectedDesignBack.id,
      designUrl: selectedDesignBack.image_url,
      designName: selectedDesignBack.name,
      printSize: selectedSizeBack || 'A4',
      transform: designTransformBack
    } : null;

    const frontText = textContentFront ? {
      content: textContentFront,
      font: textFontFront,
      color: textColorFront,
      styles: textStylesFront,
      transform: textTransformFront
    } : null;

    const backText = textContentBack ? {
      content: textContentBack,
      font: textFontBack,
      color: textColorBack,
      styles: textStylesBack,
      transform: textTransformBack
    } : null;

    return {
      frontDesign,
      backDesign,
      frontText,
      backText
    };
  }, [
    selectedDesignFront, selectedDesignBack,
    selectedSizeFront, selectedSizeBack,
    designTransformFront, designTransformBack,
    textContentFront, textContentBack,
    textFontFront, textFontBack,
    textColorFront, textColorBack,
    textStylesFront, textStylesBack,
    textTransformFront, textTransformBack
  ]);

  const handleDesignSelection = (design: Design) => {
    onSelectDesign(design);
    
    // Check if it's an SVG and handle content appropriately
    if (design.image_url?.toLowerCase().includes('.svg') || design.image_url?.includes('data:image/svg')) {
      // Only fetch if it's a remote SVG URL, not a blob URL
      if (design.image_url.startsWith('http') && !design.image_url.startsWith('blob:')) {
        fetch(design.image_url)
          .then(response => response.text())
          .then(svgText => {
            console.log('SVG content loaded:', svgText.substring(0, 100) + '...');
            onSvgContentChange(svgText);
          })
          .catch(error => {
            console.error('Error loading SVG content:', error);
            // Fallback: try to use the URL directly
            onSvgContentChange(`<svg viewBox="0 0 200 200"><image href="${design.image_url}" width="200" height="200"/></svg>`);
          });
      } else {
        // For blob URLs or data URLs, we assume the content is already processed
        console.log('SVG blob URL detected, skipping fetch');
      }
    }

    closeDrawer();
  };

  const handleAIImageGenerated = (imageUrl: string, imageName: string) => {
    // Create AI design object and select it
    const aiDesign: Design = {
      id: `ai-${Date.now()}`,
      name: imageName,
      image_url: imageUrl,
      category: 'AI Generated',
      is_active: true
    };
    handleDesignSelection(aiDesign);
    
    // Call the original handler for additional logic
    onAIImageGenerated(imageUrl, imageName);
  };

  const handleRemoveDesign = () => {
    if (currentViewSide === 'front') {
      setSelectedDesignFront(null);
    } else {
      setSelectedDesignBack(null);
    }

    const url = currentData.design?.designUrl?.toLowerCase() || '';
    if (url.includes('.svg') || url.startsWith('data:image/svg')) {
      onSvgContentChange('');
    }
  };

  const handleRemoveText = () => {
    onTextContentChange('');
  };

  // Manual background removal - Fixed: removed incorrect await
  const handleManualRemoveBackground = () => {
    const currentDesign = currentData.design;
    if (!currentDesign) return;

    try {
      onRemoveBackground();
    } catch (error) {
      console.error('Error removing background:', error);
    }
  };

  const desktopContent = (
    <div className="flex h-full gap-4">
      {/* Zone de prévisualisation - 45% */}
      <div className="w-[45%] flex flex-col">
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

      {/* Zone d'édition centralisée - 25% */}
      <div className="w-[25%] flex flex-col">
        {filteredMockupColors.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2 text-white">Couleur du produit</h3>
            <ProductColorSelector
              colors={filteredMockupColors}
              selectedColor={selectedMockupColor}
              onColorSelect={onMockupColorChange}
            />
          </div>
        )}

        <UnifiedEditingControls
          selectedDesign={currentData.design}
          currentTransform={currentData.designTransform}
          selectedSize={currentData.selectedSize}
          onTransformChange={onDesignTransformChange}
          onSizeChange={onSizeChange}
          onRemoveBackground={handleManualRemoveBackground}
          isRemovingBackground={isRemovingBackground}
          hasText={!!currentData.textContent}
          textContent={currentData.textContent}
        />
      </div>

      {/* Zone des outils - 30% */}
      <div className="w-[30%] flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className={`grid w-full grid-cols-5 mb-3 ${(currentData.design || currentData.textContent) ? 'opacity-60 scale-95' : ''} transition-all duration-200`}>
            <TabsTrigger value="designs" className="flex items-center gap-1 text-xs">
              <ImageIcon className="h-3 w-3" />
              <span className="hidden sm:inline">Images</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-1 text-xs">
              <Type className="h-3 w-3" />
              <span className="hidden sm:inline">Texte</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-1 text-xs">
              <Upload className="h-3 w-3" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">IA</span>
            </TabsTrigger>
            <TabsTrigger value="svg" className="flex items-center gap-1 text-xs">
              <Paintbrush className="h-3 w-3" />
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
                onDesignTransformChange={() => {}} // Ces contrôles sont maintenant dans UnifiedEditingControls
                onSizeChange={() => {}} // Ces contrôles sont maintenant dans UnifiedEditingControls
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
                onTextTransformChange={() => {}} // Ces contrôles sont maintenant dans UnifiedEditingControls
              />
            </TabsContent>

            <TabsContent value="upload" className="h-full overflow-y-auto">
              <CompactUpload
                onFileUpload={onFileUpload}
                onRemoveBackground={handleManualRemoveBackground}
                isRemovingBackground={isRemovingBackground}
                currentDesign={currentData.design}
              />
            </TabsContent>

            <TabsContent value="ai" className="h-full overflow-y-auto">
              <div className="h-full">
                <CompactAIGenerator onImageGenerated={handleAIImageGenerated} />
              </div>
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

  const mobileContent = (
    <div className="relative flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <EnhancedProductPreview
          productName={productName}
          productImageUrl={productImageUrl}
          currentViewSide={currentViewSide}
          onViewSideChange={onViewSideChange}
          mockup={mockup}
          selectedMockupColor={selectedMockupColor}
          hasTwoSides={hasTwoSides}
          customization={unifiedCustomization}
          onDesignTransformChange={onDesignTransformChange}
          onTextTransformChange={onTextTransformChange}
          onRemoveDesign={handleRemoveDesign}
          onRemoveText={handleRemoveText}
        />

        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 pointer-events-auto">
          <Button size="sm" variant="outline" onClick={handleManualRemoveBackground}>
            Supprimer fond
          </Button>
          {currentData.design && (
            <Button size="sm" variant="outline" onClick={handleRemoveDesign}>
              Supprimer
            </Button>
          )}
        </div>
      </div>

      <div className="h-12 flex items-center justify-around border-t border-white/10 bg-black/80">
        <Button variant="ghost" size="sm" onClick={() => openDrawer('designs')}><ImageIcon className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => openDrawer('upload')}><Upload className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => openDrawer('ai')}><Sparkles className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => openDrawer('text')}><Type className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => openDrawer('svg')}><Paintbrush className="h-4 w-4" /></Button>
      </div>

      <Drawer open={drawerTab !== null} onOpenChange={(o) => !o && closeDrawer()}>
        <DrawerContent className="bg-black/90 max-h-[60vh]">
          {drawerTab && (
            <MobileToolsPanel
              activeTab={drawerTab}
              hideTabs
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
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) { onClose(); closeDrawer(); } }}>
        <DialogContent className="bg-black/90 backdrop-blur-lg border-white/20 w-screen h-screen max-w-none p-0 rounded-none overflow-hidden">
          {mobileContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent className="bg-black/90 backdrop-blur-lg border-white/20 max-w-[98vw] w-[98vw] h-[98vh] overflow-hidden">
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-xl font-semibold">
            🎨 Personnalisation - {currentViewSide === 'front' ? 'Avant' : 'Arrière'}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-3 h-full overflow-hidden">
          {desktopContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};
