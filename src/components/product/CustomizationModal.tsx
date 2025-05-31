
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Palette, X } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import DesignGallery from './DesignGallery';
import CustomImageUpload from './CustomImageUpload';
import { SVGColorEditor } from './SVGColorEditor';

interface CustomizationModalProps {
  designs: Design[];
  selectedDesign: Design | null;
  onDesignSelect: (design: Design) => void;
  customImageUrl: string;
  onImageUpload: (url: string) => void;
  onImageUrlChange: (url: string) => void;
  onSvgColorChange: (color: string) => void;
  onSvgContentChange: (content: string) => void;
  children: React.ReactNode;
}

export default function CustomizationModal({
  designs,
  selectedDesign,
  onDesignSelect,
  customImageUrl,
  onImageUpload,
  onImageUrlChange,
  onSvgColorChange,
  onSvgContentChange,
  children
}: CustomizationModalProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'designs' | 'upload' | 'colors'>('designs');

  const isSvgDesign = (imageUrl: string): boolean => {
    if (!imageUrl) return false;
    return imageUrl.toLowerCase().endsWith('.svg') || 
           imageUrl.includes('data:image/svg+xml');
  };

  const showColorTab = selectedDesign && isSvgDesign(selectedDesign.image_url);

  const renderContent = () => (
    <div className="flex flex-col h-full">
      {/* Header avec navigation */}
      <div className="border-b border-white/10 pb-4 mb-4">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'designs' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('designs')}
          >
            Designs
          </Button>
          <Button
            variant={activeTab === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </Button>
          {showColorTab && (
            <Button
              variant={activeTab === 'colors' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('colors')}
            >
              <Palette className="h-4 w-4 mr-2" />
              Couleurs
            </Button>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'designs' && (
          <DesignGallery
            designs={designs}
            selectedDesign={selectedDesign}
            onDesignSelect={onDesignSelect}
          />
        )}
        
        {activeTab === 'upload' && (
          <CustomImageUpload
            customImageUrl={customImageUrl}
            onImageUpload={onImageUpload}
            onImageUrlChange={onImageUrlChange}
          />
        )}
        
        {activeTab === 'colors' && showColorTab && (
          <div className="space-y-4">
            <SVGColorEditor
              imageUrl={selectedDesign.image_url}
              onColorChange={onSvgColorChange}
              onSvgContentChange={onSvgContentChange}
            />
          </div>
        )}
      </div>

      {/* Footer avec boutons d'action */}
      <div className="border-t border-white/10 pt-4 mt-4">
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
          <Button onClick={() => setOpen(false)}>
            Appliquer
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
        <DrawerContent className="h-[85vh] bg-black/95 backdrop-blur-xl border-white/20">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-white">Personnaliser votre produit</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 flex-1">
            {renderContent()}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] bg-black/95 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Personnaliser votre produit</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
