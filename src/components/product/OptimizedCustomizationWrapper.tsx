
import React, { memo } from 'react';
import { useOptimizedSelectors } from '@/hooks/useOptimizedSelectors';
import { useOptimizedTransforms } from '@/hooks/useOptimizedTransforms';
import { useOptimizedCallbacks } from '@/hooks/useOptimizedCallbacks';
import { useProductCustomization } from '@/hooks/useProductCustomization';
import { Design } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';

interface OptimizedCustomizationWrapperProps {
  currentSide: 'front' | 'back';
  children: (props: {
    // Sélecteurs optimisés
    currentDesign: Design | null;
    currentDesignTransform: any;
    currentTextContent: string;
    currentTextTransform: any;
    currentTextFont: string;
    currentTextColor: string;
    currentTextStyles: { bold: boolean; italic: boolean; underline: boolean };
    currentSvgColor: string;
    currentSvgContent: string;
    hasDesign: boolean;
    hasText: boolean;
    hasCustomization: boolean;
    
    // Handlers optimisés
    handleDesignMove: (deltaX: number, deltaY: number) => void;
    handleDesignScale: (scale: number) => void;
    handleDesignRotate: (rotation: number) => void;
    handleTextMove: (deltaX: number, deltaY: number) => void;
    handleTextScale: (scale: number) => void;
    handleTextRotate: (rotation: number) => void;
    handleDesignSelect: (design: Design) => void;
    handleTextContentChange: (content: string) => void;
    handleTextFontChange: (font: string) => void;
    handleTextColorChange: (color: string) => void;
    handleTextStylesChange: (styles: { bold: boolean; italic: boolean; underline: boolean }) => void;
    handleSvgColorChange: (color: string) => void;
    
    // Actions rapides
    quickActions: {
      scaleUp: () => void;
      scaleDown: () => void;
      rotateLeft: () => void;
      rotateRight: () => void;
      resetTransform: () => void;
    };
  }) => React.ReactNode;
}

export const OptimizedCustomizationWrapper: React.FC<OptimizedCustomizationWrapperProps> = memo(({
  currentSide,
  children
}) => {
  const customization = useProductCustomization();
  const selectors = useOptimizedSelectors(currentSide);

  // Handlers pour les transformations
  const transformHandlers = {
    onDesignTransformChange: (property: string, value: any) => {
      customization.handleDesignTransformChange(currentSide, property, value);
    },
    onTextTransformChange: (property: string, value: any) => {
      customization.handleTextTransformChange(currentSide, property, value);
    }
  };

  const transforms = useOptimizedTransforms(currentSide, transformHandlers);

  // Handlers pour les callbacks
  const callbackHandlers = {
    onSelectDesign: (design: Design) => {
      if (currentSide === 'front') {
        customization.setSelectedDesignFront(design);
      } else {
        customization.setSelectedDesignBack(design);
      }
    },
    onTextContentChange: (content: string) => {
      if (currentSide === 'front') {
        customization.setTextContentFront(content);
      } else {
        customization.setTextContentBack(content);
      }
    },
    onTextFontChange: (font: string) => {
      if (currentSide === 'front') {
        customization.setTextFontFront(font);
      } else {
        customization.setTextFontBack(font);
      }
    },
    onTextColorChange: (color: string) => {
      if (currentSide === 'front') {
        customization.setTextColorFront(color);
      } else {
        customization.setTextColorBack(color);
      }
    },
    onTextStylesChange: (styles: { bold: boolean; italic: boolean; underline: boolean }) => {
      if (currentSide === 'front') {
        customization.setTextStylesFront(styles);
      } else {
        customization.setTextStylesBack(styles);
      }
    },
    onSvgColorChange: (color: string) => {
      if (currentSide === 'front') {
        customization.setSvgColorFront(color);
      } else {
        customization.setSvgColorBack(color);
      }
    }
  };

  const callbacks = useOptimizedCallbacks(currentSide, callbackHandlers);

  return (
    <>
      {children({
        ...selectors,
        ...transforms,
        ...callbacks
      })}
    </>
  );
});

OptimizedCustomizationWrapper.displayName = 'OptimizedCustomizationWrapper';
