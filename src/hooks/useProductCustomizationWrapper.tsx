
import logger from '@/utils/logger';
import { useCallback } from 'react';
import { useProductCustomization } from './useProductCustomization';
import { usePerformanceOptimization } from './usePerformanceOptimization';
import { useOptimizedSelectors } from './useOptimizedSelectors';

export const useProductCustomizationWrapper = (currentSide: 'front' | 'back' = 'front') => {
  const customization = useProductCustomization();
  const { optimizedCallback } = usePerformanceOptimization();
  const selectors = useOptimizedSelectors(currentSide);

  const handleRemoveDesign = optimizedCallback(() => {
    logger.log('Remove design - optimized implementation');
    customization.handleRemoveDesign(currentSide);
  });

  const handleRemoveText = optimizedCallback(() => {
    logger.log('Remove text - optimized implementation');
    customization.handleRemoveText(currentSide);
  });

  // Handlers optimisés pour les transformations
  const handleDesignTransformChange = optimizedCallback((property: string, value: any) => {
    customization.handleDesignTransformChange(currentSide, property, value);
  });

  const handleTextTransformChange = optimizedCallback((property: string, value: any) => {
    customization.handleTextTransformChange(currentSide, property, value);
  });

  return {
    ...customization,
    ...selectors,
    handleRemoveDesign,
    handleRemoveText,
    handleDesignTransformChange,
    handleTextTransformChange,
    currentSide
  };
};
