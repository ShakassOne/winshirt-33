
import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SVGColorEditor } from './SVGColorEditor';

interface FloatingColorPickerProps {
  imageUrl: string;
  onColorChange: (color: string) => void;
  onSvgContentChange: (svgContent: string) => void;
  className?: string;
}

export const FloatingColorPicker: React.FC<FloatingColorPickerProps> = ({
  imageUrl,
  onColorChange,
  onSvgContentChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Vérification stricte que c'est bien un SVG
  const isSvg = imageUrl && (
    imageUrl.toLowerCase().endsWith('.svg') ||
    imageUrl.includes('data:image/svg+xml')
  );

  if (!isSvg) {
    return null;
  }

  return (
    <div className={`absolute ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white text-gray-800 shadow-lg"
      >
        <Palette className="h-4 w-4 mr-2" />
        Couleur
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 min-w-80">
          <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-4 shadow-xl">
            <SVGColorEditor
              imageUrl={imageUrl}
              onColorChange={onColorChange}
              onSvgContentChange={onSvgContentChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
