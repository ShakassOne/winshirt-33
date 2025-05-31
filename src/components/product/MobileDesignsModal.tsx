
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import { GalleryDesigns } from './GalleryDesigns';

interface MobileDesignsModalProps {
  open: boolean;
  onClose: () => void;
  onSelectDesign: (design: Design) => void;
  selectedDesign: Design | null;
  currentDesignTransform: { position: { x: number; y: number }; scale: number; rotation: number };
  selectedSize: string;
  onDesignTransformChange: (property: string, value: any) => void;
  onSizeChange: (size: string) => void;
}

export const MobileDesignsModal: React.FC<MobileDesignsModalProps> = ({
  open,
  onClose,
  onSelectDesign,
  selectedDesign,
  currentDesignTransform,
  selectedSize,
  onDesignTransformChange,
  onSizeChange
}) => {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="bg-black/90 backdrop-blur-lg border-white/20 max-h-[85vh]">
        <DrawerHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-semibold">
              🎨 Galerie de designs
            </DrawerTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">
          <GalleryDesigns
            onSelectDesign={onSelectDesign}
            selectedDesign={selectedDesign}
            currentDesignTransform={currentDesignTransform}
            selectedSize={selectedSize}
            onDesignTransformChange={onDesignTransformChange}
            onSizeChange={onSizeChange}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
