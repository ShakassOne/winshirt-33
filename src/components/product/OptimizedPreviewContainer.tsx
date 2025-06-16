
import React from 'react';
import { EnhancedProductPreview } from './EnhancedProductPreview';
import { MockupColor } from '@/types/mockup.types';

interface OptimizedPreviewContainerProps {
  productName: string;
  productImageUrl?: string;
  currentViewSide: 'front' | 'back';
  onViewSideChange: (side: 'front' | 'back') => void;
  mockup?: any;
  selectedMockupColor: MockupColor | null;
  hasTwoSides: boolean;
  customization: any;
  onDesignTransformChange: (property: string, value: any) => void;
  onTextTransformChange: (property: string, value: any) => void;
  onRemoveDesign: () => void;
  onRemoveText: () => void;
}

export const OptimizedPreviewContainer: React.FC<OptimizedPreviewContainerProps> = (props) => {
  return (
    <div className="h-full">
      <EnhancedProductPreview {...props} />
    </div>
  );
};
