
import React from 'react';
import { UnifiedCustomizationRenderer } from './UnifiedCustomizationRenderer';

interface CaptureElementsProps {
  customization: any;
  selectedMockupColor: any;
  mockup: any;
}

export const CaptureElements: React.FC<CaptureElementsProps> = ({
  customization,
  selectedMockupColor,
  mockup
}) => {
  const getFrontImageUrl = () => {
    return selectedMockupColor ? selectedMockupColor.front_image_url : mockup?.svg_front_url;
  };

  const getBackImageUrl = () => {
    return selectedMockupColor ? selectedMockupColor.back_image_url : mockup?.svg_back_url;
  };

  return (
    <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none">
      {/* Éléments de capture pour mockup avec produit (preview basse def) */}
      <div id="preview-front-complete" className="w-[400px] h-[500px] bg-white">
        <UnifiedCustomizationRenderer
          customization={customization}
          side="front"
          withBackground={true}
          backgroundUrl={getFrontImageUrl()}
          className="w-full h-full"
        />
      </div>

      <div id="preview-back-complete" className="w-[400px] h-[500px] bg-white">
        <UnifiedCustomizationRenderer
          customization={customization}
          side="back"
          withBackground={true}
          backgroundUrl={getBackImageUrl()}
          className="w-full h-full"
        />
      </div>

      {/* Éléments de capture pour production HD sans produit */}
      <div id="production-front-only" className="w-[800px] h-[1000px] bg-transparent">
        <UnifiedCustomizationRenderer
          customization={customization}
          side="front"
          withBackground={false}
          className="w-full h-full"
          scale={2}
        />
      </div>

      <div id="production-back-only" className="w-[800px] h-[1000px] bg-transparent">
        <UnifiedCustomizationRenderer
          customization={customization}
          side="back"
          withBackground={false}
          className="w-full h-full"
          scale={2}
        />
      </div>
    </div>
  );
};
