
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

  // Générer les filtres CSS optimisés pour les textiles (mode subtil)
  const generateTextileFilter = (colorCode: string) => {
    if (!colorCode || colorCode === '#ffffff') return 'none';
    
    const hsl = hexToHsl(colorCode);
    
    // Filtres CSS très subtils pour préserver l'image de base
    const hueShift = hsl.h;
    const saturation = Math.min(110, Math.max(90, hsl.s)); // Saturation plus douce
    const brightness = Math.min(105, Math.max(95, hsl.l)); // Luminosité très proche de l'original
    
    return `
      hue-rotate(${hueShift}deg) 
      saturate(${saturation}%) 
      brightness(${brightness}%)
      contrast(102%)
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
      
      {/* Couche principale : Mode COLOR (équivalent Photoshop "Produit") */}
      {selectedColor?.color_code && selectedColor.color_code !== '#ffffff' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: selectedColor.color_code,
            mixBlendMode: 'color', // Mode COLOR : change la teinte sans affecter les valeurs
            opacity: 0.7,
            borderRadius: 'inherit'
          }}
        />
      )}
      
      {/* Couche d'ombres : Mode MULTIPLY à très faible opacité */}
      {selectedColor?.color_code && selectedColor.color_code !== '#ffffff' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: selectedColor.color_code,
            mixBlendMode: 'multiply', // Pour renforcer les ombres naturelles
            opacity: 0.1, // Très subtil
            borderRadius: 'inherit'
          }}
        />
      )}
      
      {/* Couche de finition : Mode SOFT-LIGHT pour l'effet textile */}
      {selectedColor?.color_code && selectedColor.color_code !== '#ffffff' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: selectedColor.color_code,
            mixBlendMode: 'soft-light', // Effet doux et naturel
            opacity: 0.2,
            borderRadius: 'inherit'
          }}
        />
      )}
    </div>
  );
};
