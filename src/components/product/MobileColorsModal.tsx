
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import { SVGColorEditor } from './SVGColorEditor';
import { ProductColorSelector } from './ProductColorSelector';
import { MockupColor } from '@/types/mockup.types';

interface MobileColorsModalProps {
  open: boolean;
  onClose: () => void;
  isSvgDesign: boolean;
  currentDesign: Design | null;
  onSvgColorChange: (color: string) => void;
  onSvgContentChange: (content: string) => void;
  defaultSvgColor: string;
  mockupColors?: MockupColor[];
  selectedMockupColor: MockupColor | null;
  onMockupColorChange: (color: MockupColor) => void;
}

export const MobileColorsModal: React.FC<MobileColorsModalProps> = ({
  open,
  onClose,
  isSvgDesign,
  currentDesign,
  onSvgColorChange,
  onSvgContentChange,
  defaultSvgColor,
  mockupColors,
  selectedMockupColor,
  onMockupColorChange
}) => {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="bg-black/90 backdrop-blur-lg border-white/20 max-h-[85vh]">
        <DrawerHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-semibold">
              🎨 Couleurs
            </DrawerTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto space-y-6">
          {mockupColors && mockupColors.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Couleur du produit</h3>
              <ProductColorSelector
                colors={mockupColors}
                selectedColor={selectedMockupColor}
                onColorSelect={onMockupColorChange}
              />
            </div>
          )}
          
          {isSvgDesign && currentDesign && (
            <div>
              <h3 className="text-lg font-medium mb-3">Couleur du design SVG</h3>
              <SVGColorEditor
                imageUrl={currentDesign.image_url}
                onColorChange={onSvgColorChange}
                onSvgContentChange={onSvgContentChange}
                defaultColor={defaultSvgColor}
              />
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
