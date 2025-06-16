
import { useMemo } from 'react';
import { useProductCustomization } from './useProductCustomization';

export const useOptimizedSelectors = (currentSide: 'front' | 'back') => {
  const customization = useProductCustomization();

  // Sélecteurs mémoisés pour éviter les re-renders
  const currentDesign = useMemo(() => {
    return currentSide === 'front' 
      ? customization.selectedDesignFront 
      : customization.selectedDesignBack;
  }, [currentSide, customization.selectedDesignFront, customization.selectedDesignBack]);

  const currentDesignTransform = useMemo(() => {
    return currentSide === 'front' 
      ? customization.designTransformFront 
      : customization.designTransformBack;
  }, [currentSide, customization.designTransformFront, customization.designTransformBack]);

  const currentTextContent = useMemo(() => {
    return currentSide === 'front' 
      ? customization.textContentFront 
      : customization.textContentBack;
  }, [currentSide, customization.textContentFront, customization.textContentBack]);

  const currentTextTransform = useMemo(() => {
    return currentSide === 'front' 
      ? customization.textTransformFront 
      : customization.textTransformBack;
  }, [currentSide, customization.textTransformFront, customization.textTransformBack]);

  const currentTextFont = useMemo(() => {
    return currentSide === 'front' 
      ? customization.textFontFront 
      : customization.textFontBack;
  }, [currentSide, customization.textFontFront, customization.textFontBack]);

  const currentTextColor = useMemo(() => {
    return currentSide === 'front' 
      ? customization.textColorFront 
      : customization.textColorBack;
  }, [currentSide, customization.textColorFront, customization.textColorBack]);

  const currentTextStyles = useMemo(() => {
    return currentSide === 'front' 
      ? customization.textStylesFront 
      : customization.textStylesBack;
  }, [currentSide, customization.textStylesFront, customization.textStylesBack]);

  const currentSvgColor = useMemo(() => {
    return currentSide === 'front' 
      ? customization.svgColorFront 
      : customization.svgColorBack;
  }, [currentSide, customization.svgColorFront, customization.svgColorBack]);

  const currentSvgContent = useMemo(() => {
    return currentSide === 'front' 
      ? customization.svgContentFront 
      : customization.svgContentBack;
  }, [currentSide, customization.svgContentFront, customization.svgContentBack]);

  return {
    currentDesign,
    currentDesignTransform,
    currentTextContent,
    currentTextTransform,
    currentTextFont,
    currentTextColor,
    currentTextStyles,
    currentSvgColor,
    currentSvgContent,
    hasDesign: !!currentDesign || !!currentSvgContent,
    hasText: !!currentTextContent,
    hasCustomization: !!(currentDesign || currentSvgContent || currentTextContent)
  };
};
