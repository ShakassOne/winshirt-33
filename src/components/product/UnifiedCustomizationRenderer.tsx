
import React from 'react';
import { decodeSVGBase64, isBase64SVG, processSVGContent } from '@/utils/svgDecoder';

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
  className?: string;
  scale?: number;
}

export const UnifiedCustomizationRenderer: React.FC<UnifiedCustomizationRendererProps> = ({
  customization,
  side,
  withBackground = true,
  backgroundUrl,
  className = '',
  scale = 1
}) => {
  const design = side === 'front' ? customization.frontDesign : customization.backDesign;
  const text = side === 'front' ? customization.frontText : customization.backText;

  const renderDesign = () => {
    if (!design) return null;

    const { designUrl, transform } = design;
    
    // Gérer les SVG base64
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
              zIndex: 10
            }}
            dangerouslySetInnerHTML={{ __html: processedSVG }}
          />
        );
      }
    }

    // Gérer les images classiques (PNG, JPG, etc.)
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
          className="max-w-[200px] max-h-[200px] object-contain"
          style={{
            width: 'auto',
            height: 'auto'
          }}
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
      textShadow = `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.color}`;
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

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Background (T-shirt) */}
      {withBackground && backgroundUrl && (
        <img
          src={backgroundUrl}
          alt={`T-shirt ${side}`}
          className="w-full h-full object-contain"
        />
      )}
      
      {/* Design Layer */}
      {renderDesign()}
      
      {/* Text Layer */}
      {renderText()}
    </div>
  );
};
