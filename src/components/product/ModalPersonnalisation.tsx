
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Eye, Palette, Type, Upload, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProductColorSelector } from './ProductColorSelector';
import { GalleryDesigns } from './GalleryDesigns';
import { SVGDesigns } from './SVGDesigns';
import { TextCustomizer } from './TextCustomizer';
import { UploadDesign } from './UploadDesign';
import AIImageGenerator from './AIImageGenerator';
import { Product, Design } from '@/types/supabase.types';

interface ModalPersonnalisationProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onDesignSelect: (design: Design | null) => void;
  selectedDesign: Design | null;
  onCustomTextChange: (text: string) => void;
  customText: string;
  onTextColorChange: (color: string) => void;
  selectedTextColor: string;
  onTextFontChange: (font: string) => void;
  selectedTextFont: string;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIImageSelect: (imageUrl: string) => void;
  onSvgColorChange: (color: string) => void;
  onSvgContentChange: (content: string) => void;
  defaultSvgColor: string;
  selectedProductColor: string | null;
  onProductColorSelect: (color: string) => void;
  // Propriétés additionnelles pour GalleryDesigns
  currentDesignTransform?: { position: { x: number; y: number }; scale: number; rotation: number };
  selectedSize?: string;
  onDesignTransformChange?: (property: string, value: any) => void;
  onSizeChange?: (size: string) => void;
}

const ModalPersonnalisation: React.FC<ModalPersonnalisationProps> = ({
  open,
  onClose,
  product,
  onDesignSelect,
  selectedDesign,
  onCustomTextChange,
  customText,
  onTextColorChange,
  selectedTextColor,
  onTextFontChange,
  selectedTextFont,
  onFileUpload,
  onAIImageSelect,
  onSvgColorChange,
  onSvgContentChange,
  defaultSvgColor,
  selectedProductColor,
  onProductColorSelect,
  currentDesignTransform = { position: { x: 0, y: 0 }, scale: 1, rotation: 0 },
  selectedSize = 'A4',
  onDesignTransformChange = () => {},
  onSizeChange = () => {}
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'gallery' | 'svg' | 'text' | 'upload' | 'ai'>('gallery');

  const handleTabChange = (tab: 'gallery' | 'svg' | 'text' | 'upload' | 'ai') => {
    console.log(`[ModalPersonnalisation] Changement d'onglet vers: ${tab}`);
    setActiveTab(tab);
  };

  const handleClose = () => {
    console.log("Fermeture du modal de personnalisation");
    onClose();
  };

  // Props simplifiées pour TextCustomizer
  const textCustomizerProps = {
    customText,
    selectedTextColor,
    selectedTextFont,
    onTextChange: onCustomTextChange,
    onColorChange: onTextColorChange,
    onFontChange: onTextFontChange
  };

  // Props simplifiées pour UploadDesign
  const uploadDesignProps = {
    onFileUpload,
    onAIImageGenerated: () => {},
    onRemoveBackground: () => {},
    isRemovingBackground: false,
    currentDesign: null
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="h-[90vh] bg-black/90 backdrop-blur-lg border-white/20">
          <DrawerHeader>
            <DrawerTitle>
              Personnalisation du produit
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col h-full">
            <div className="flex justify-around mb-4">
              <Button
                variant={activeTab === 'gallery' ? 'default' : 'outline'}
                onClick={() => handleTabChange('gallery')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Galerie
              </Button>
              <Button
                variant={activeTab === 'svg' ? 'default' : 'outline'}
                onClick={() => handleTabChange('svg')}
              >
                <Palette className="h-4 w-4 mr-2" />
                SVG
              </Button>
              <Button
                variant={activeTab === 'text' ? 'default' : 'outline'}
                onClick={() => handleTabChange('text')}
              >
                <Type className="h-4 w-4 mr-2" />
                Texte
              </Button>
              <Button
                variant={activeTab === 'upload' ? 'default' : 'outline'}
                onClick={() => handleTabChange('upload')}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button
                variant={activeTab === 'ai' ? 'default' : 'outline'}
                onClick={() => handleTabChange('ai')}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                IA
              </Button>
            </div>

            <div className="p-4 flex-grow overflow-y-auto">
              {activeTab === 'gallery' && (
                <GalleryDesigns
                  onSelectDesign={onDesignSelect}
                  selectedDesign={selectedDesign}
                  currentDesignTransform={currentDesignTransform}
                  selectedSize={selectedSize}
                  onDesignTransformChange={onDesignTransformChange}
                  onSizeChange={onSizeChange}
                />
              )}
              {activeTab === 'svg' && (
                <SVGDesigns
                  onSelectDesign={onDesignSelect}
                  selectedDesign={selectedDesign}
                  onFileUpload={onFileUpload}
                  onSvgColorChange={onSvgColorChange}
                  onSvgContentChange={onSvgContentChange}
                  defaultSvgColor={defaultSvgColor}
                />
              )}
              {activeTab === 'text' && (
                <TextCustomizer {...textCustomizerProps} />
              )}
              {activeTab === 'upload' && (
                <UploadDesign {...uploadDesignProps} />
              )}
              {activeTab === 'ai' && (
                <AIImageGenerator
                  onAIImageSelect={onAIImageSelect}
                />
              )}
            </div>

            <div className="p-4 border-t border-white/20">
              <ProductColorSelector
                availableColors={product.available_colors}
                selectedColor={selectedProductColor || ''}
                onColorSelect={onProductColorSelect}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          console.log("🛑 Tentative de fermeture, validation requise");
          onClose();
        }
      }}
    >
      <DialogContent className="bg-black/90 backdrop-blur-lg border-white/20 max-w-[95vw] w-[95vw] h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Personnalisation du produit
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          <div className="w-1/4 p-4 border-r border-white/20">
            <div className="space-y-3">
              <Button
                variant={activeTab === 'gallery' ? 'default' : 'outline'}
                className="w-full justify-start gap-3"
                onClick={() => handleTabChange('gallery')}
              >
                <Eye className="h-4 w-4" />
                Galerie
              </Button>
              <Button
                variant={activeTab === 'svg' ? 'default' : 'outline'}
                className="w-full justify-start gap-3"
                onClick={() => handleTabChange('svg')}
              >
                <Palette className="h-4 w-4" />
                SVG
              </Button>
              <Button
                variant={activeTab === 'text' ? 'default' : 'outline'}
                className="w-full justify-start gap-3"
                onClick={() => handleTabChange('text')}
              >
                <Type className="h-4 w-4" />
                Texte
              </Button>
              <Button
                variant={activeTab === 'upload' ? 'default' : 'outline'}
                className="w-full justify-start gap-3"
                onClick={() => handleTabChange('upload')}
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              <Button
                variant={activeTab === 'ai' ? 'default' : 'outline'}
                className="w-full justify-start gap-3"
                onClick={() => handleTabChange('ai')}
              >
                <Sparkles className="h-4 w-4" />
                IA
              </Button>
            </div>
          </div>

          <div className="w-3/4 p-4 overflow-y-auto">
            {activeTab === 'gallery' && (
              <GalleryDesigns
                onSelectDesign={onDesignSelect}
                selectedDesign={selectedDesign}
                currentDesignTransform={currentDesignTransform}
                selectedSize={selectedSize}
                onDesignTransformChange={onDesignTransformChange}
                onSizeChange={onSizeChange}
              />
            )}
            {activeTab === 'svg' && (
              <SVGDesigns
                onSelectDesign={onDesignSelect}
                selectedDesign={selectedDesign}
                onFileUpload={onFileUpload}
                onSvgColorChange={onSvgColorChange}
                onSvgContentChange={onSvgContentChange}
                defaultSvgColor={defaultSvgColor}
              />
            )}
            {activeTab === 'text' && (
              <TextCustomizer {...textCustomizerProps} />
            )}
            {activeTab === 'upload' && (
              <UploadDesign {...uploadDesignProps} />
            )}
            {activeTab === 'ai' && (
              <AIImageGenerator
                onAIImageSelect={onAIImageSelect}
              />
            )}
          </div>
        </div>

        <div className="p-4 border-t border-white/20">
          <ProductColorSelector
            availableColors={product.available_colors}
            selectedColor={selectedProductColor || ''}
            onColorSelect={onProductColorSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPersonnalisation;
