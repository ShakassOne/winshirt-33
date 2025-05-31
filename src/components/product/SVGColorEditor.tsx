
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

interface SVGColorEditorProps {
  imageUrl: string;
  onColorChange: (color: string) => void;
  onSvgContentChange: (svgContent: string) => void;
  defaultColor?: string;
}

export const SVGColorEditor: React.FC<SVGColorEditorProps> = ({
  imageUrl,
  onColorChange,
  onSvgContentChange,
  defaultColor = '#000000'
}) => {
  const [color, setColor] = useState(defaultColor);
  const [svgContent, setSvgContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [originalSvg, setOriginalSvg] = useState('');

  const isSvg = imageUrl.toLowerCase().endsWith('.svg');

  useEffect(() => {
    if (isSvg && imageUrl) {
      setIsLoading(true);
      fetch(imageUrl)
        .then((res) => res.text())
        .then((text) => {
          setOriginalSvg(text);
          const coloredSvg = text.replace(/fill="[^"]*"/g, `fill="${color}"`);
          setSvgContent(coloredSvg);
          onSvgContentChange(coloredSvg);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Erreur lors du chargement du SVG:', error);
          setIsLoading(false);
        });
    }
  }, [imageUrl, isSvg]);

  useEffect(() => {
    if (originalSvg && color) {
      const coloredSvg = originalSvg.replace(/fill="[^"]*"/g, `fill="${color}"`);
      setSvgContent(coloredSvg);
      onSvgContentChange(coloredSvg);
      onColorChange(color);
    }
  }, [color, originalSvg, onColorChange, onSvgContentChange]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  if (!isSvg) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center">
          <Palette className="h-4 w-4 mr-2 text-winshirt-purple" />
          Couleur du SVG
        </Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
            disabled={isLoading}
          />
          <span className="text-xs text-white/60">{color}</span>
        </div>
      </div>
      
      {isLoading && (
        <div className="text-xs text-white/60 flex items-center">
          <div className="animate-spin h-3 w-3 mr-2 border border-white border-t-transparent rounded-full"></div>
          Chargement du SVG...
        </div>
      )}
    </div>
  );
};
