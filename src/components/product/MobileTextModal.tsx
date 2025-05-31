
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TextCustomizer } from './TextCustomizer';

interface MobileTextModalProps {
  open: boolean;
  onClose: () => void;
  textContent: string;
  textFont: string;
  textColor: string;
  textStyles: { bold: boolean; italic: boolean; underline: boolean };
  textTransform: { position: { x: number; y: number }; scale: number; rotation: number };
  onTextContentChange: (content: string) => void;
  onTextFontChange: (font: string) => void;
  onTextColorChange: (color: string) => void;
  onTextStylesChange: (styles: { bold: boolean; italic: boolean; underline: boolean }) => void;
  onTextTransformChange: (property: string, value: any) => void;
}

export const MobileTextModal: React.FC<MobileTextModalProps> = ({
  open,
  onClose,
  textContent,
  textFont,
  textColor,
  textStyles,
  textTransform,
  onTextContentChange,
  onTextFontChange,
  onTextColorChange,
  onTextStylesChange,
  onTextTransformChange
}) => {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="bg-black/90 backdrop-blur-lg border-white/20 max-h-[85vh]">
        <DrawerHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-semibold">
              ✏️ Personnaliser le texte
            </DrawerTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto">
          <TextCustomizer
            textContent={textContent}
            textFont={textFont}
            textColor={textColor}
            textStyles={textStyles}
            textTransform={textTransform}
            onTextContentChange={onTextContentChange}
            onTextFontChange={onTextFontChange}
            onTextColorChange={onTextColorChange}
            onTextStylesChange={onTextStylesChange}
            onTextTransformChange={onTextTransformChange}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
