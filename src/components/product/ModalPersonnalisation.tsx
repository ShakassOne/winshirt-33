import logger from '@/utils/logger';

import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, Palette, Type, Image as ImageIcon, Upload, Sparkles, Paintbrush, QrCode, Shirt, Layers } from 'lucide-react';
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
import { QRCodeTab } from './QRCodeTab';
import { LayersPanel } from './LayersPanel';
import { ProductPanel } from './ProductPanel';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import html2canvas from 'html2canvas';

interface ModalPersonnalisationProps {
  open: boolean;
  onClose: () => void;
  onValidate?: () => void;
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
  onSelectDesign: (design: Design | null) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIImageGenerated: (imageUrl: string, imageName: string) => void;
  setSelectedDesignFront: (design: Design | null) => void;
  setSelectedDesignBack: (design: Design | null) => void;
  onRemoveBackground: (tolerance?: number) => void;
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
  onValidate,
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
  const [activeTab, setActiveTab] = useState('product'); // Start with product tab
  const [activeTool, setActiveTool] = useState('product'); // Start with product tool
  const [drawerTab, setDrawerTab] = useState<string | null>(null);
  const { isAdmin } = useAdminCheck();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Fonctions pour les boutons de validation et test capture
  const handleValidate = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Nettoyer tous les event listeners tactiles potentiellement conflictuels
    const elements = document.querySelectorAll('[data-draggable]');
    elements.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.pointerEvents = 'auto';
    });
    
    onValidate?.();
    onClose();
  };

  const handleTestCapture = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const previewElement = document.querySelector('[data-capture-element]');
    if (previewElement) {
      try {
        const canvas = await html2canvas(previewElement as HTMLElement, {
          backgroundColor: null,
          useCORS: true,
          allowTaint: true,
          scale: 2
        });
        
        // Convertir en blob et télécharger
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `test-capture-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
        
        console.log('✅ Test capture terminé avec succès');
      } catch (error) {
        console.error('❌ Erreur lors du test capture:', error);
      }
    } else {
      console.error('❌ Element de capture non trouvé');
    }
  };

  // Debug pour tracer la transmission des props
  console.log('🔍 [ModalPersonnalisation] Props debug:', {
    productName,
    productImageUrl,
    mockup: mockup?.name,
    selectedMockupColor: selectedMockupColor?.name,
    currentViewSide,
    isMobile
  });

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
      designCategory: selectedDesignFront.category,
      printSize: selectedSizeFront || 'A4',
      transform: designTransformFront
    } : null;

    const backDesign = selectedDesignBack ? {
      designId: selectedDesignBack.id,
      designUrl: selectedDesignBack.image_url,
      designName: selectedDesignBack.name,
      designCategory: selectedDesignBack.category,
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

  const handleDesignSelection = (design: Design | null) => {
    onSelectDesign(design);

    if (design?.image_url?.toLowerCase().includes('.svg') || design?.image_url?.includes('data:image/svg')) {
      if (design.image_url.startsWith('http') && !design.image_url.startsWith('blob:')) {
        fetch(design.image_url)
          .then(response => response.text())
          .then(svgText => {
            console.log('SVG content loaded:', svgText.substring(0, 100) + '...');
            onSvgContentChange(svgText);
          })
          .catch(error => {
            console.error('Error loading SVG content:', error);
            onSvgContentChange(`\x3csvg viewBox="0 0 200 200"\x3e<image href="${design.image_url}" width="200" height="200"/>\x3c/svg\x3e`);
          });
      } else {
        console.log('SVG blob URL detected, skipping fetch');
      }
    } else {
      onSvgContentChange('');
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

    const url = currentData.design?.image_url?.toLowerCase() || '';
    if (url.includes('.svg') || url.startsWith('data:image/svg')) {
      onSvgContentChange('');
    }
  };

  const handleRemoveText = () => {
    onTextContentChange('');
  };

  // Enhanced background removal with tolerance support
  const handleManualRemoveBackground = (tolerance?: number) => {
    const currentDesign = currentData.design;
    if (!currentDesign) return;

    try {
      console.log('Starting simple background removal with tolerance:', tolerance || 32);
      onRemoveBackground(tolerance);
    } catch (error) {
      console.error('Error in simple background removal:', error);
    }
  };

  // Wrapper function for mobile button click
  const handleMobileRemoveBackground = () => {
    handleManualRemoveBackground(32); // Use default tolerance of 32
  };

  // Tools configuration for left sidebar - New order as requested
  const tools = [
    { id: 'product', icon: Shirt, label: 'Produit', tab: 'product' },
    { id: 'layers', icon: Layers, label: 'Calques', tab: 'layers' },
    { id: 'images', icon: ImageIcon, label: 'Images', tab: 'designs' },
    { id: 'text', icon: Type, label: 'Texte', tab: 'text' },
    { id: 'qrcode', icon: QrCode, label: 'QR Code', tab: 'qrcode' },
    { id: 'ai', icon: Sparkles, label: 'IA', tab: 'ai' }
  ];

  const handleToolClick = (toolId: string, tabId: string) => {
    setActiveTool(toolId);
    setActiveTab(tabId);
  };

  const desktopContent = (
    <div className="flex h-full bg-white">
      {/* Left Sidebar - Tools */}
      <div className="w-20 bg-white flex flex-col items-center py-5 gap-4 shadow-[2px_0_15px_rgba(0,0,0,0.1)] relative z-10">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <div
              key={tool.id}
              className={`w-10 h-10 bg-white rounded-[10px] flex items-center justify-center cursor-pointer transition-all duration-300 text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-black/5 ${
                isActive 
                  ? 'transform -translate-y-1 shadow-[0_5px_20px_rgba(0,0,0,0.2)] border-black/10' 
                  : 'hover:transform hover:-translate-y-1 hover:shadow-[0_5px_20px_rgba(0,0,0,0.15)] hover:text-black'
              }`}
              onClick={() => handleToolClick(tool.id, tool.tab)}
              title={tool.label}
            >
              <Icon className="w-5 h-5" />
            </div>
          );
        })}
      </div>

      {/* Central Area - T-shirt Preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 bg-white overflow-auto">
        {/* View Controls */}
        <div className="flex gap-5 mb-8">
          <button
            className={`px-5 py-2 border-2 rounded-[25px] cursor-pointer transition-all duration-300 ${
              currentViewSide === 'front'
                ? 'bg-black text-white border-black'
                : 'bg-white border-gray-300 hover:bg-gray-50 text-black'
            }`}
            onClick={() => onViewSideChange('front')}
          >
            Front
          </button>
          <button
            className={`px-5 py-2 border-2 rounded-[25px] cursor-pointer transition-all duration-300 ${
              currentViewSide === 'back'
                ? 'bg-black text-white border-black'
                : 'bg-white border-gray-300 hover:bg-gray-50 text-black'
            }`}
            onClick={() => onViewSideChange('back')}
          >
            Back
          </button>
        </div>

        {/* T-shirt Container */}
        <div className="relative mb-8">
          <div className="w-[700px] h-[800px] bg-white rounded-[25px] shadow-[0_15px_40px_rgba(0,0,0,0.15)] flex items-center justify-center relative transition-transform duration-300 hover:scale-[1.005]">
            <div className="w-full h-full relative">
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
          </div>
        </div>

        {/* Size Controls */}
        <div className="flex gap-4 flex-wrap justify-center">
          {['A4', 'A3', 'Cœur', 'Poche', 'Full'].map((size) => (
            <button
              key={size}
              className={`px-4 py-2 border border-gray-300 bg-white rounded-[20px] cursor-pointer transition-all duration-300 text-xs ${
                currentData.selectedSize === size
                  ? 'bg-gray-100 border-blue-500'
                  : 'hover:bg-gray-50 hover:border-blue-500'
              }`}
              onClick={() => onSizeChange(size)}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Color Selector */}
        {filteredMockupColors.length > 0 && (
          <div className="mt-6">
            <ProductColorSelector
              colors={filteredMockupColors}
              selectedColor={selectedMockupColor}
              onColorSelect={onMockupColorChange}
            />
          </div>
        )}

        {/* Unified Editing Controls */}
        {(currentData.design || currentData.textContent) && (
          <div className="mt-6 w-full max-w-md">
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
        )}
      </div>

      {/* Right Sidebar - Dynamic Content */}
      <div className="w-[350px] bg-gray-50 flex flex-col border-l border-gray-200">
        {/* Sidebar Header */}
        <div className="p-5 bg-white border-b border-gray-200">
          <h2 className="text-base font-semibold mb-4 text-gray-800">
            {activeTool === 'product' && 'Configuration du produit'}
            {activeTool === 'layers' && 'Gestion des calques'}
            {activeTool === 'images' && 'Galerie de designs'}
            {activeTool === 'text' && 'Options de texte'}
            {activeTool === 'qrcode' && 'Générateur QR Code'}
            {activeTool === 'ai' && 'Génération IA'}
          </h2>
          
          {/* Filter tabs for images */}
          {activeTool === 'images' && (
            <div className="flex flex-wrap gap-2">
              {['Tous', 'Animaux', 'Nature', 'Humour', 'Abstrait', 'Sport', 'Vintage'].map((filter) => (
                <div
                  key={filter}
                  className="px-3 py-1.5 bg-gray-100 rounded-xl text-xs cursor-pointer transition-all duration-300 text-gray-600 hover:bg-gray-800 hover:text-white"
                >
                  {filter}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Content based on active tool */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeTool === 'product' && (
            <ProductPanel
              productName={productName}
              productImageUrl={productImageUrl}
              mockup={mockup}
              selectedMockupColor={selectedMockupColor}
              onMockupColorChange={onMockupColorChange}
              filteredMockupColors={filteredMockupColors}
              currentViewSide={currentViewSide}
              onViewSideChange={onViewSideChange}
              hasTwoSides={hasTwoSides}
            />
          )}

          {activeTool === 'layers' && (
            <LayersPanel
              currentViewSide={currentViewSide}
              selectedDesignFront={selectedDesignFront}
              selectedDesignBack={selectedDesignBack}  
              textContentFront={textContentFront}
              textContentBack={textContentBack}
              onRemoveDesign={handleRemoveDesign}
              onRemoveText={handleRemoveText}
            />
          )}

          {(activeTool === 'images' || activeTool === 'text' || activeTool === 'qrcode' || activeTool === 'ai') && (
            <div className="p-5">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                {/* Upload Button */}
                {activeTool === 'images' && (
                  <div className="mb-5">
                    <CompactUpload
                      onFileUpload={onFileUpload}
                      onRemoveBackground={handleManualRemoveBackground}
                      isRemovingBackground={isRemovingBackground}
                      currentDesign={currentData.design}
                    />
                  </div>
                )}

                <TabsContent value="designs" className="h-full">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDesignSelection(null)}
                        disabled={!currentData.design}
                        className="mb-4"
                      >
                        Réinitialiser
                      </Button>
                    </div>
                    <GalleryDesigns
                      onSelectDesign={handleDesignSelection}
                      selectedDesign={currentData.design}
                      currentDesignTransform={currentData.designTransform}
                      selectedSize={currentData.selectedSize}
                      onDesignTransformChange={() => {}}
                      onSizeChange={() => {}}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="text" className="h-full">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveText}
                        disabled={!currentData.textContent}
                        className="mb-4"
                      >
                        Réinitialiser
                      </Button>
                    </div>
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
                  </div>
                </TabsContent>

                <TabsContent value="qrcode" className="h-full">
                  <QRCodeTab
                    onQRCodeGenerated={(qrCodeUrl: string) => {
                      const qrDesign: Design = {
                        id: `qr-${Date.now()}`,
                        name: 'QR Code généré',
                        image_url: qrCodeUrl,
                        category: 'QR Code',
                        is_active: true
                      };
                      handleDesignSelection(qrDesign);
                    }}
                    onRemoveDesign={() => handleDesignSelection(null)}
                    selectedDesign={currentData.design}
                  />
                </TabsContent>

                <TabsContent value="ai" className="h-full">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDesignSelection(null)}
                        disabled={!currentData.design}
                        className="mb-4"
                      >
                        Réinitialiser
                      </Button>
                    </div>
                    <CompactAIGenerator onImageGenerated={handleAIImageGenerated} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
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

        {/* Debug info pour mobile */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-0 left-0 bg-black/80 text-white text-xs p-2 max-w-xs">
            <div>Product: {productName}</div>
            <div>Image: {productImageUrl ? '✅' : '❌'}</div>
            <div>Mockup: {mockup?.name || '❌'}</div>
            <div>Color: {selectedMockupColor?.name || '❌'}</div>
            <div>Side: {currentViewSide}</div>
          </div>
        )}

        <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 pointer-events-auto">
          <Button
            variant="outline"
            className="text-lg min-w-[48px] min-h-[48px] pointer-events-auto"
            onClick={handleMobileRemoveBackground}
          >
            Supprimer fond
          </Button>
          {currentData.design && (
            <Button
              variant="outline"
              className="text-lg min-w-[48px] min-h-[48px] pointer-events-auto"
              onClick={handleRemoveDesign}
            >
              Supprimer
            </Button>
          )}
          
          {/* Boutons de validation et test pour mobile */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleTestCapture}
                className="text-xs"
              >
                Test Capture
              </Button>
            )}
            <Button 
              variant="default" 
              size="sm"
              onClick={handleValidate}
              className="bg-green-600 hover:bg-green-700"
            >
              Valider
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-around p-4 bg-black/70 z-50">
        <Button
          variant="ghost"
          className="text-lg min-w-[48px] min-h-[48px] pointer-events-auto"
          onClick={() => openDrawer('designs')}
        >
          <ImageIcon className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          className="text-lg min-w-[48px] min-h-[48px] pointer-events-auto"
          onClick={() => openDrawer('text')}
        >
          <Type className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          className="text-lg min-w-[48px] min-h-[48px] pointer-events-auto"
          onClick={() => openDrawer('qrcode')}
        >
          <QrCode className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          className="text-lg min-w-[48px] min-h-[48px] pointer-events-auto"
          onClick={() => openDrawer('upload')}
        >
          <Upload className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          className="text-lg min-w-[48px] min-h-[48px] pointer-events-auto"
          onClick={() => openDrawer('ai')}
        >
          <Sparkles className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          className="text-lg min-w-[48px] min-h-[48px] pointer-events-auto"
          onClick={() => openDrawer('svg')}
        >
          <Paintbrush className="h-5 w-5" />
        </Button>
      </div>

      <Drawer open={drawerTab !== null} onOpenChange={(o) => !o && closeDrawer()}>
        <DrawerContent className="bg-black/90 max-h-[65vh]">
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
                onRemoveBackground={handleManualRemoveBackground}
              isRemovingBackground={isRemovingBackground}
              panelHeight={400}
            />
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );

  // Add/remove modal-open class to body when modal opens/closes
  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [open]);

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
      <DialogContent className="w-screen h-screen max-w-none max-h-none p-0 bg-white border-none fixed inset-0 m-0" style={{zIndex: 9999}}>
        {/* Simple white header delimiter */}
        <div className="h-px w-full bg-white" />
        
        <div className="h-full overflow-hidden relative">
          {desktopContent}
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-lg text-black hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {isAdmin && (
            <button
              onClick={handleTestCapture}
              className="px-4 py-2 border border-gray-300 bg-white text-black rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Test Capture
            </button>
          )}
          <button
            onClick={handleValidate}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Valider
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
