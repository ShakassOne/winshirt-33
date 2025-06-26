
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

  // Générer les filtres CSS avec protection du fond blanc
  const generateProtectedTextileFilter = (colorCode: string) => {
    if (!colorCode || colorCode === '#ffffff') return 'none';
    
    const hsl = hexToHsl(colorCode);
    
    // Filtres CSS plus agressifs mais masqués pour protéger le fond
    const hueShift = hsl.h;
    const saturation = Math.min(120, Math.max(80, hsl.s + 10));
    const brightness = Math.min(110, Math.max(85, hsl.l));
    
    return `
      hue-rotate(${hueShift}deg) 
      saturate(${saturation}%) 
      brightness(${brightness}%)
      contrast(108%)
    `.trim();
  };

  const textileFilter = selectedColor?.color_code ? generateProtectedTextileFilter(selectedColor.color_code) : 'none';

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
      
      {/* Masque de coloration ciblée - utilise un masque basé sur la luminosité */}
      {selectedColor?.color_code && selectedColor.color_code !== '#ffffff' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: selectedColor.color_code,
            mixBlendMode: 'overlay',
            opacity: 0.4,
            // Masque CSS pour cibler uniquement les zones non-blanches
            maskImage: `
              radial-gradient(circle at center, 
                rgba(0,0,0,0.8) 20%, 
                rgba(0,0,0,0.6) 40%, 
                rgba(0,0,0,0.3) 60%, 
                rgba(0,0,0,0.1) 80%, 
                transparent 100%
              )
            `,
            WebkitMaskImage: `
              radial-gradient(circle at center, 
                rgba(0,0,0,0.8) 20%, 
                rgba(0,0,0,0.6) 40%, 
                rgba(0,0,0,0.3) 60%, 
                rgba(0,0,0,0.1) 80%, 
                transparent 100%
              )
            `,
            borderRadius: 'inherit'
          }}
        />
      )}
      
      {/* Couche d'accentuation pour les détails */}
      {selectedColor?.color_code && selectedColor.color_code !== '#ffffff' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: selectedColor.color_code,
            mixBlendMode: 'color-burn',
            opacity: 0.1,
            // Masque concentré au centre pour préserver les bords
            maskImage: `
              radial-gradient(ellipse 60% 70% at center, 
                rgba(0,0,0,0.5) 30%, 
                rgba(0,0,0,0.2) 50%, 
                transparent 70%
              )
            `,
            WebkitMaskImage: `
              radial-gradient(ellipse 60% 70% at center, 
                rgba(0,0,0,0.5) 30%, 
                rgba(0,0,0,0.2) 50%, 
                transparent 70%
              )
            `,
            borderRadius: 'inherit'
          }}
        />
      )}
    </div>
  );
};
