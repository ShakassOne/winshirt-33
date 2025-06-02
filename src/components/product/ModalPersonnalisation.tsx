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
import { SVGDesigns } from './SVGDesigns';
import { ProductPreview } from './ProductPreview';
import { ProductColorSelector } from './ProductColorSelector';
import { MobileToolbar } from './MobileToolbar';
import { MobileDesignsModal } from './MobileDesignsModal';
import { MobileTextModal } from './MobileTextModal';
import { MobileUploadModal } from './MobileUploadModal';
import { MobileColorsModal } from './MobileColorsModal';

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
  onSizeChange,
  onDesignMouseDown,
  onTextMouseDown,
  onTouchMove
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('designs');
  
  // Mobile modals state
  const [mobileDesignsOpen, setMobileDesignsOpen] = useState(false);
  const [mobileTextOpen, setMobileTextOpen] = useState(false);
  const [mobileUploadOpen, setMobileUploadOpen] = useState(false);
  const [mobileColorsOpen, setMobileColorsOpen] = useState(false);

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
  const hasDesign = getCurrentDesign() !== null;

  // Gestionnaire STRICT pour la sélection de design - NE FERME JAMAIS LA MODAL
  const handleDesignSelection = (design: Design) => {
    console.log('🎨 [ModalPersonnalisation] Sélection du design:', design.name);
    console.log('🔒 Modal restera OUVERTE après sélection');
    
    // Appeler uniquement la fonction de sélection, SANS FERMER LA MODAL
    onSelectDesign(design);
    
    // En mode mobile, fermer uniquement la sous-modal des designs
    if (isMobile && mobileDesignsOpen) {
      console.log('📱 Fermeture uniquement de la sous-modal mobile des designs');
      setMobileDesignsOpen(false);
    }
    
    console.log('✅ Design sélectionné, modal principale reste ouverte');
  };

  // Desktop layout avec 4 onglets maintenant
  const desktopContent = (
    <div className="flex h-full gap-6">
      {/* Colonne de gauche - Preview */}
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

      {/* Colonne de droite - Outils */}
      <div className="w-1/2 flex flex-col">
        {mockup?.colors && mockup.colors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Couleur du produit</h3>
            <ProductColorSelector
              colors={mockup.colors}
              selectedColor={selectedMockupColor}
              onColorSelect={onMockupColorChange}
            />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="designs" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Designs</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">Texte</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="svg" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">SVG</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="designs" className="h-full overflow-y-auto">
              <GalleryDesigns
                onSelectDesign={handleDesignSelection}
                selectedDesign={getCurrentDesign()}
                currentDesignTransform={getCurrentDesignTransform()}
                selectedSize={getCurrentSelectedSize()}
                onDesignTransformChange={onDesignTransformChange}
                onSizeChange={onSizeChange}
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

            <TabsContent value="upload" className="h-full overflow-y-auto">
              <UploadDesign
                onFileUpload={onFileUpload}
                onAIImageGenerated={onAIImageGenerated}
                onRemoveBackground={onRemoveBackground}
                isRemovingBackground={isRemovingBackground}
                currentDesign={getCurrentDesign()}
              />
            </TabsContent>

            <TabsContent value="svg" className="h-full overflow-y-auto">
              <SVGDesigns
                onSelectDesign={handleDesignSelection}
                selectedDesign={getCurrentDesign()}
                onFileUpload={onFileUpload}
                onSvgColorChange={onSvgColorChange}
                onSvgContentChange={onSvgContentChange}
                defaultSvgColor={getCurrentSvgColor()}
              />
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

  // Nouveau layout mobile optimisé
  const mobileContent = (
    <div className="flex flex-col h-full pb-20">
      {/* Preview pleine largeur */}
      <div className="flex-1 px-4 pt-4">
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

      {/* Barre d'outils mobile fixe en bas */}
      <MobileToolbar
        onDesignsClick={() => setMobileDesignsOpen(true)}
        onTextClick={() => setMobileTextOpen(true)}
        onUploadClick={() => setMobileUploadOpen(true)}
        onAIClick={() => setMobileUploadOpen(true)}
        onColorsClick={() => setMobileColorsOpen(true)}
        isSvgDesign={isSvgDesign()}
        hasDesign={hasDesign}
      />

      {/* Modales spécialisées */}
      <MobileDesignsModal
        open={mobileDesignsOpen}
        onClose={() => setMobileDesignsOpen(false)}
        onSelectDesign={handleDesignSelection}
        selectedDesign={getCurrentDesign()}
        currentDesignTransform={getCurrentDesignTransform()}
        selectedSize={getCurrentSelectedSize()}
        onDesignTransformChange={onDesignTransformChange}
        onSizeChange={onSizeChange}
      />

      <MobileTextModal
        open={mobileTextOpen}
        onClose={() => setMobileTextOpen(false)}
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

      <MobileUploadModal
        open={mobileUploadOpen}
        onClose={() => setMobileUploadOpen(false)}
        onFileUpload={onFileUpload}
        onAIImageGenerated={onAIImageGenerated}
        onRemoveBackground={onRemoveBackground}
        isRemovingBackground={isRemovingBackground}
        currentDesign={getCurrentDesign()}
      />

      <MobileColorsModal
        open={mobileColorsOpen}
        onClose={() => setMobileColorsOpen(false)}
        isSvgDesign={isSvgDesign()}
        currentDesign={getCurrentDesign()}
        onSvgColorChange={onSvgColorChange}
        onSvgContentChange={onSvgContentChange}
        defaultSvgColor={getCurrentSvgColor()}
        mockupColors={mockup?.colors}
        selectedMockupColor={selectedMockupColor}
        onMockupColorChange={onMockupColorChange}
      />

      {/* Boutons de validation en overlay pour mobile */}
      <div className="absolute bottom-20 left-4 right-4 flex justify-between bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <Button variant="outline" onClick={onClose} className="px-4">
          Annuler
        </Button>
        <Button onClick={onClose} className="px-4 bg-gradient-to-r from-winshirt-purple to-winshirt-blue">
          Valider
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="bg-black/90 backdrop-blur-lg border-white/20 h-[100vh]">
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
          <div className="flex-1 overflow-hidden">
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
          <DialogTitle className="text-2xl font-semibold">
            🎨 Personnalisation - {currentViewSide === 'front' ? 'Avant' : 'Arrière'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        <div className="pt-4 h-full overflow-hidden">
          {desktopContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};
