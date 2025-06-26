
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

  // Générer les filtres CSS optimisés pour les textiles
  const generateTextileFilter = (colorCode: string) => {
    if (!colorCode || colorCode === '#ffffff') return 'none';
    
    const hsl = hexToHsl(colorCode);
    
    // Filtres CSS spécialement conçus pour les textiles
    // Utilise une approche plus douce qui préserve les détails
    const hueShift = hsl.h;
    const saturation = Math.min(150, Math.max(80, hsl.s + 20)); // Ajuste la saturation
    const brightness = Math.min(120, Math.max(70, hsl.l + 10)); // Ajuste la luminosité
    
    return `
      hue-rotate(${hueShift}deg) 
      saturate(${saturation}%) 
      brightness(${brightness}%)
      contrast(105%)
      sepia(15%)
    `.trim();
  };

  const textileFilter = selectedColor?.color_code ? generateTextileFilter(selectedColor.color_code) : 'none';

  return (
    <div className={`relative ${className}`}>
      {/* Image de base (PNG blanc) */}
      <img
        src={baseImageUrl}
        alt={alt}
        className="w-full h-full object-contain"
        style={{
          filter: textileFilter,
          transition: 'filter 0.4s ease'
        }}
      />
      
      {/* Overlay couleur avec mix-blend-mode pour un effet textile réaliste */}
      {selectedColor?.color_code && selectedColor.color_code !== '#ffffff' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: selectedColor.color_code,
            mixBlendMode: 'multiply',
            opacity: 0.3,
            borderRadius: 'inherit'
          }}
        />
      )}
      
      {/* Overlay supplémentaire pour les couleurs très saturées */}
      {selectedColor?.color_code && selectedColor.color_code !== '#ffffff' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: selectedColor.color_code,
            mixBlendMode: 'soft-light',
            opacity: 0.15,
            borderRadius: 'inherit'
          }}
        />
      )}
    </div>
  );
};
