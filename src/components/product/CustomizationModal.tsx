
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, Palette, Upload, Type, Image } from 'lucide-react';
import { DesignGallery } from './DesignGallery';
import { CustomImageUpload } from './CustomImageUpload';
import { TextCustomization } from './TextCustomization';
import { SVGColorEditor } from './SVGColorEditor';

interface CustomizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  currentSide: 'front' | 'back';
  onSideChange: (side: 'front' | 'back') => void;
  selectedDesign: any;
  onDesignSelect: (design: any) => void;
  customImage: string;
  onCustomImageChange: (image: string) => void;
  customText: string;
  onCustomTextChange: (text: string) => void;
  svgColor: string;
  onSvgColorChange: (color: string) => void;
  onSvgContentChange: (content: string) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  open,
  onOpenChange,
  productId,
  productName,
  currentSide,
  onSideChange,
  selectedDesign,
  onDesignSelect,
  customImage,
  onCustomImageChange,
  customText,
  onCustomTextChange,
  svgColor,
  onSvgColorChange,
  onSvgContentChange,
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('designs');

  const handleApply = () => {
    console.log('🎨 Personnalisation appliquée');
    onOpenChange(false);
  };

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Header avec sélection recto/verso */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Personnaliser votre produit</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-white/70 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={currentSide === 'front' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSideChange('front')}
            className="flex-1"
          >
            Recto
          </Button>
          <Button
            variant={currentSide === 'back' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSideChange('back')}
            className="flex-1"
          >
            Verso
          </Button>
        </div>
      </div>

      {/* Onglets de personnalisation */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
            <TabsTrigger value="designs" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
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
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Couleurs</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="designs" className="mt-0 p-4">
              <DesignGallery
                productId={productId}
                selectedDesign={selectedDesign}
                onDesignSelect={onDesignSelect}
                currentSide={currentSide}
              />
            </TabsContent>

            <TabsContent value="upload" className="mt-0 p-4">
              <CustomImageUpload
                value={customImage}
                onChange={onCustomImageChange}
                productId={productId}
              />
            </TabsContent>

            <TabsContent value="text" className="mt-0 p-4">
              <TextCustomization
                value={customText}
                onChange={onCustomTextChange}
                currentSide={currentSide}
              />
            </TabsContent>

            <TabsContent value="colors" className="mt-0 p-4">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Couleurs SVG</h3>
                  <p className="text-sm text-white/70 mb-4">
                    Personnalisez les couleurs de vos designs SVG
                  </p>
                </div>
                
                {selectedDesign?.image_url ? (
                  <SVGColorEditor
                    imageUrl={selectedDesign.image_url}
                    onColorChange={onSvgColorChange}
                    onSvgContentChange={onSvgContentChange}
                    defaultColor={svgColor}
                  />
                ) : (
                  <div className="text-center p-8 bg-white/5 rounded-lg border border-white/10">
                    <Palette className="h-12 w-12 mx-auto text-white/40 mb-4" />
                    <p className="text-white/70">
                      Sélectionnez d'abord un design SVG pour pouvoir modifier ses couleurs
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer avec boutons d'action */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-winshirt-purple/20 to-winshirt-blue/20">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:from-winshirt-purple/90 hover:to-winshirt-blue/90"
          >
            Appliquer
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
          <Content />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-white/20 p-0">
        <Content />
      </DialogContent>
    </Dialog>
  );
};
