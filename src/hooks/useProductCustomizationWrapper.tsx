
import logger from '@/utils/logger';
import { useCallback } from 'react';
import { useProductCustomization } from './useProductCustomization';
import { usePerformanceOptimization } from './usePerformanceOptimization';

export const useProductCustomizationWrapper = () => {
  const customization = useProductCustomization();
  const { optimizedCallback } = usePerformanceOptimization();

  const handleRemoveDesign = optimizedCallback(() => {
    logger.log('Remove design - optimized implementation');
    // Utiliser les handlers du hook de customisation
    customization.handleRemoveDesign('front');
  });

  const handleRemoveText = optimizedCallback(() => {
    logger.log('Remove text - optimized implementation');
    customization.handleRemoveText('front');
  });

  return {
    ...customization,
    handleRemoveDesign,
    handleRemoveText
  };
};
