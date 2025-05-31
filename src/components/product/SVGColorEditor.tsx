
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
  const [error, setError] = useState<string | null>(null);

  const isSvg = imageUrl.toLowerCase().endsWith('.svg');

  useEffect(() => {
    if (isSvg && imageUrl) {
      setIsLoading(true);
      setError(null);
      
      console.log('🎨 [SVGColorEditor] Chargement du SVG:', imageUrl);
      
      fetch(imageUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
          }
          return res.text();
        })
        .then((text) => {
          console.log('✅ [SVGColorEditor] SVG chargé avec succès');
          setOriginalSvg(text);
          const coloredSvg = text.replace(/fill="[^"]*"/g, `fill="${color}"`);
          setSvgContent(coloredSvg);
          onSvgContentChange(coloredSvg);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('❌ [SVGColorEditor] Erreur lors du chargement du SVG:', error);
          setError(`Impossible de charger le SVG: ${error.message}`);
          setIsLoading(false);
        });
    }
  }, [imageUrl, isSvg]);

  useEffect(() => {
    if (originalSvg && color) {
      try {
        const coloredSvg = originalSvg.replace(/fill="[^"]*"/g, `fill="${color}"`);
        setSvgContent(coloredSvg);
        onSvgContentChange(coloredSvg);
        onColorChange(color);
        console.log('🎨 [SVGColorEditor] Couleur appliquée:', color);
      } catch (error) {
        console.error('❌ [SVGColorEditor] Erreur lors du changement de couleur:', error);
        setError('Erreur lors du changement de couleur');
      }
    }
  }, [color, originalSvg, onColorChange, onSvgContentChange]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    setError(null);
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
            disabled={isLoading || !!error}
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
      
      {error && (
        <div className="text-xs text-red-400 p-2 bg-red-900/20 rounded">
          ⚠️ {error}
        </div>
      )}
      
      {svgContent && !error && (
        <div className="mt-2 p-2 bg-white/5 rounded border border-white/20">
          <div 
            className="max-w-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{ maxHeight: '100px', overflow: 'hidden' }}
          />
        </div>
      )}
    </div>
  );
};
