
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import { UploadDesign } from './UploadDesign';

interface MobileUploadModalProps {
  open: boolean;
  onClose: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIImageGenerated: (imageUrl: string, imageName: string) => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;
  currentDesign: Design | null;
}

export const MobileUploadModal: React.FC<MobileUploadModalProps> = ({
  open,
  onClose,
  onFileUpload,
  onAIImageGenerated,
  onRemoveBackground,
  isRemovingBackground,
  currentDesign
}) => {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="bg-black/90 backdrop-blur-lg border-white/20 max-h-[85vh]">
        <DrawerHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-semibold">
              📤 Télécharger une image
            </DrawerTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">
          <UploadDesign
            onFileUpload={(event) => {
              onFileUpload(event);
              onClose();
            }}
            onAIImageGenerated={(url, name) => {
              onAIImageGenerated(url, name);
              onClose();
            }}
            onRemoveBackground={onRemoveBackground}
            isRemovingBackground={isRemovingBackground}
            currentDesign={currentDesign}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
