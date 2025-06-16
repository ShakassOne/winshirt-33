import React from 'react';
import { CompactMobileTools } from './CompactMobileTools';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';

interface OptimizedMobileToolsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  
  // Design props
  selectedDesign: Design | null;
  designTransform: { position: { x: number; y: number }; scale: number; rotation: number };
  selectedSize: string;
  onDesignTransformChange: (property: string, value: any) => void;
  onSizeChange: (size: string) => void;
  onSelectDesign: (design: Design) => void;
  
  // Text props
  textContent: string;
  textFont: string;
  textColor: string;
  textStyles: { bold: boolean; italic: boolean; underline: boolean };
  onTextContentChange: (content: string) => void;
  onTextFontChange: (font: string) => void;
  onTextColorChange: (color: string) => void;
  onTextStylesChange: (styles: { bold: boolean; italic: boolean; underline: boolean }) => void;
  
  // SVG props
  svgColor: string;
  onSvgColorChange: (color: string) => void;
  
  // Product color props
  mockupColors?: MockupColor[];
  selectedMockupColor: MockupColor | null;
  onMockupColorChange: (color: MockupColor) => void;
  
  // Other props
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIImageGenerated: (imageUrl: string, imageName: string) => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;
}

export const OptimizedMobileTools: React.FC<OptimizedMobileToolsProps> = (props) => {
  return (
    <div className="h-full">
      <CompactMobileTools {...props} />
    </div>
  );
};
