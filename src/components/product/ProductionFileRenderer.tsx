
import React from 'react';
import { UnifiedCustomizationRenderer } from './UnifiedCustomizationRenderer';

interface ProductionFileRendererProps {
  customization: any;
  side: 'front' | 'back';
  elementId: string;
  width?: number;
  height?: number;
}

export const ProductionFileRenderer: React.FC<ProductionFileRendererProps> = ({
  customization,
  side,
  elementId,
  width = 2400,
  height = 3200
}) => {
  const hasContent = (side === 'front' && (customization.frontDesign || customization.frontText)) ||
                    (side === 'back' && (customization.backDesign || customization.backText));

  if (!hasContent) return null;

  return (
    <div
      id={elementId}
      data-side={side}
      data-has-content={hasContent}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        backgroundColor: 'transparent',
        overflow: 'hidden'
      }}
    >
      <UnifiedCustomizationRenderer
        customization={customization}
        side={side}
        withBackground={false}
        scale={width / 400} // Échelle HD basée sur la taille finale
      />
    </div>
  );
};
