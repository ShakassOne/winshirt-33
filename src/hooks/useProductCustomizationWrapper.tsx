
import { useCallback } from 'react';

export const useProductCustomizationWrapper = () => {
  const handleRemoveDesign = useCallback(() => {
    console.log('Remove design - implementation needed');
    // Cette fonction devra être implémentée selon la logique métier
  }, []);

  return {
    handleRemoveDesign
  };
};
