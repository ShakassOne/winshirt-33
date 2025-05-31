
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Type, Upload, Sparkles, Palette } from 'lucide-react';

interface MobileToolbarProps {
  onDesignsClick: () => void;
  onTextClick: () => void;
  onUploadClick: () => void;
  onAIClick: () => void;
  onColorsClick: () => void;
  isSvgDesign: boolean;
  hasDesign: boolean;
}

export const MobileToolbar: React.FC<MobileToolbarProps> = ({
  onDesignsClick,
  onTextClick,
  onUploadClick,
  onAIClick,
  onColorsClick,
  isSvgDesign,
  hasDesign
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/20 p-4">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Button
          variant="ghost"
          size="lg"
          className="flex flex-col items-center gap-1 h-auto py-2"
          onClick={onDesignsClick}
        >
          <ImageIcon className="h-6 w-6" />
          <span className="text-xs">Designs</span>
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          className="flex flex-col items-center gap-1 h-auto py-2"
          onClick={onTextClick}
        >
          <Type className="h-6 w-6" />
          <span className="text-xs">Texte</span>
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          className="flex flex-col items-center gap-1 h-auto py-2"
          onClick={onUploadClick}
        >
          <Upload className="h-6 w-6" />
          <span className="text-xs">Upload</span>
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          className="flex flex-col items-center gap-1 h-auto py-2"
          onClick={onAIClick}
        >
          <Sparkles className="h-6 w-6" />
          <span className="text-xs">IA</span>
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          className="flex flex-col items-center gap-1 h-auto py-2"
          onClick={onColorsClick}
          disabled={!isSvgDesign && !hasDesign}
        >
          <Palette className="h-6 w-6" />
          <span className="text-xs">Couleurs</span>
        </Button>
      </div>
    </div>
  );
};
