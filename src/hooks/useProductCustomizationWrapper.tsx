import logger from '@/utils/logger';

import { useCallback } from 'react';

export const useProductCustomizationWrapper = () => {
  const handleRemoveDesign = useCallback(() => {
    logger.log('Remove design - implementation needed');
    // Cette fonction devra être implémentée selon la logique métier
  }, []);

  return {
    handleRemoveDesign
  };
};
