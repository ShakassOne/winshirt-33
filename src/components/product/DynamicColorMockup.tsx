
import React from 'react';
import { MockupColor } from '@/types/mockup.types';

interface DynamicColorMockupProps {
  baseImageUrl: string;
  selectedColor?: MockupColor | null;
  alt: string;
  className?: string;
}

export const DynamicColorMockup: React.FC<DynamicColorMockupProps> = ({
  baseImageUrl,
  selectedColor,
  alt,
  className = ''
}) => {
  // Fonction pour convertir HEX vers HSL pour les filtres CSS
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l;

    l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Générer les filtres CSS pour appliquer la couleur
  const generateColorFilter = (colorCode: string) => {
    if (!colorCode || colorCode === '#ffffff') return 'none';
    
    const hsl = hexToHsl(colorCode);
    
    // Filtres CSS pour simuler la couleur du textile
    return `
      hue-rotate(${hsl.h}deg) 
      saturate(${Math.max(0.8, hsl.s / 100)}%) 
      brightness(${Math.max(0.7, hsl.l / 100)}%)
      contrast(1.1)
    `.trim();
  };

  const colorFilter = selectedColor?.color_code ? generateColorFilter(selectedColor.color_code) : 'none';

  return (
    <div className={`relative ${className}`}>
      {/* Image de base (neutre) */}
      <img
        src={baseImageUrl}
        alt={alt}
        className="w-full h-full object-contain"
        style={{
          filter: colorFilter,
          transition: 'filter 0.3s ease'
        }}
      />
      
      {/* Overlay couleur supplémentaire pour les couleurs très foncées */}
      {selectedColor?.color_code && selectedColor.color_code !== '#ffffff' && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20"
          style={{
            backgroundColor: selectedColor.color_code,
            borderRadius: 'inherit'
          }}
        />
      )}
    </div>
  );
};
