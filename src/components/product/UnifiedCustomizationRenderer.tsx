import React, { useState } from 'react';
import { decodeSVGBase64, isBase64SVG, processSVGContent } from '@/utils/svgDecoder';
import { sanitizeSvg } from '@/utils/sanitizeSvg';

interface CustomizationData {
  frontDesign?: {
    designUrl: string;
    designName: string;
    transform: {
      scale: number;
      position: { x: number; y: number };
      rotation: number;
    };
  };
  backDesign?: {
    designUrl: string;
    designName: string;
    transform: {
      scale: number;
      position: { x: number; y: number };
      rotation: number;
    };
  };
  frontText?: {
    content: string;
    font: string;
    color: string;
    styles: { bold: boolean; italic: boolean; underline: boolean };
    shadow?: {
      enabled: boolean;
      color: string;
      blur: number;
      offsetX: number;
      offsetY: number;
    };
    transform: {
      scale: number;
      position: { x: number; y: number };
      rotation: number;
    };
  };
  backText?: {
    content: string;
    font: string;
    color: string;
    styles: { bold: boolean; italic: boolean; underline: boolean };
    shadow?: {
      enabled: boolean;
      color: string;
      blur: number;
      offsetX: number;
      offsetY: number;
    };
    transform: {
      scale: number;
      position: { x: number; y: number };
      rotation: number;
    };
  };
}

interface UnifiedCustomizationRendererProps {
  customization: CustomizationData;
  side: 'front' | 'back';
  withBackground?: boolean;
  backgroundUrl?: string;
  productImageUrl?: string;
  className?: string;
  scale?: number;
}

export const UnifiedCustomizationRenderer: React.FC<UnifiedCustomizationRendererProps> = ({
  customization,
  side,
  withBackground = true,
  backgroundUrl,
  productImageUrl,
  className = '',
  scale = 1
}) => {
  const [imageError, setImageError] = useState(false);
  
  const design = side === 'front' ? customization.frontDesign : customization.backDesign;
  const text = side === 'front' ? customization.frontText : customization.backText;

  // Détermine l'URL de l'image de fond avec fallback
  const getBackgroundImageUrl = () => {
    if (!withBackground) return null;
    
    const finalUrl = backgroundUrl || productImageUrl;
    
    console.log('🖼️ [UnifiedCustomizationRenderer] Background URL selection:', {
      side,
      backgroundUrl,
      productImageUrl,
      finalUrl,
      imageError
    });
    
    return finalUrl;
  };

  const handleImageError = () => {
    console.error('🚨 [UnifiedCustomizationRenderer] Image failed to load:', getBackgroundImageUrl());
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('✅ [UnifiedCustomizationRenderer] Image loaded successfully:', getBackgroundImageUrl());
    setImageError(false);
  };

  const renderDesign = () => {
    if (!design) return null;

    const { designUrl, transform } = design;
    
    // Gérer les SVG base64 avec une meilleure qualité pour la production
    if (isBase64SVG(designUrl)) {
      const svgContent = decodeSVGBase64(designUrl);
      if (svgContent) {
        const processedSVG = processSVGContent(svgContent);
        
        return (
          <div
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${transform.position.x * scale}px, ${transform.position.y * scale}px) scale(${transform.scale * scale}) rotate(${transform.rotation}deg)`,
              transformOrigin: 'center',
              zIndex: 10,
              // Optimisation pour la production HD
              imageRendering: scale > 2 ? 'crisp-edges' : 'auto'
            }}
            dangerouslySetInnerHTML={{ __html: sanitizeSvg(processedSVG) }}
          />
        );
      }
    }

    // Gérer les images classiques avec optimisation HD
    return (
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${transform.position.x * scale}px, ${transform.position.y * scale}px) scale(${transform.scale * scale}) rotate(${transform.rotation}deg)`,
          transformOrigin: 'center',
          zIndex: 10
        }}
      >
        <img
          src={designUrl}
          alt={design.designName}
          className="object-contain"
          style={{
            width: `${200 * scale}px`,
            height: `${200 * scale}px`,
            maxWidth: 'none',
            maxHeight: 'none',
            // Optimisation pour la production HD
            imageRendering: scale > 2 ? 'crisp-edges' : 'auto'
          }}
          loading="eager"
          crossOrigin="anonymous"
        />
      </div>
    );
  };

  const renderText = () => {
    if (!text || !text.content) return null;

    const { content, font, color, styles, shadow, transform } = text;

    // Calculer l'ombre du texte
    let textShadow = 'none';
    if (shadow?.enabled) {
      textShadow = `${shadow.offsetX * scale}px ${shadow.offsetY * scale}px ${shadow.blur * scale}px ${shadow.color}`;
    }

    return (
      <div
        className="absolute whitespace-nowrap"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${transform.position.x * scale}px, ${transform.position.y * scale}px) scale(${transform.scale * scale}) rotate(${transform.rotation}deg)`,
          transformOrigin: 'center',
          fontFamily: font,
          color: color,
          fontSize: `${24 * scale}px`,
          fontWeight: styles.bold ? 'bold' : 'normal',
          fontStyle: styles.italic ? 'italic' : 'normal',
          textDecoration: styles.underline ? 'underline' : 'none',
          textShadow: textShadow,
          zIndex: 20,
          lineHeight: 1.2
        }}
      >
        {content}
      </div>
    );
  };

  const backgroundImageUrl = getBackgroundImageUrl();

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Background (T-shirt) - avec gestion d'erreur améliorée */}
      {withBackground && backgroundImageUrl && !imageError && (
        <img
          src={backgroundImageUrl}
          alt={`T-shirt ${side}`}
          className="w-full h-full object-contain"
          loading="eager"
          crossOrigin="anonymous"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      
      {/* Placeholder si l'image ne charge pas */}
      {withBackground && (!backgroundImageUrl || imageError) && (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">👕</div>
            <div className="text-sm">Image non disponible</div>
            <div className="text-xs mt-1">
              {side === 'front' ? 'Face avant' : 'Face arrière'}
            </div>
          </div>
        </div>
      )}
      
      {/* Design Layer */}
      {renderDesign()}
      
      {/* Text Layer */}
      {renderText()}
    </div>
  );
};
