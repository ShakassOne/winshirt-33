import logger from '@/utils/logger';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useStableAdminMutations = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = useCallback(() => {
    logger.log('🔄 [StableAdmin] Invalidating products only');
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
  }, [queryClient]);

  const invalidateLotteries = useCallback(() => {
    logger.log('🔄 [StableAdmin] Invalidating lotteries only');
    queryClient.invalidateQueries({ queryKey: ['lotteries'] });
    queryClient.invalidateQueries({ queryKey: ['adminLotteries'] });
  }, [queryClient]);

  const invalidateDesigns = useCallback(() => {
    logger.log('🔄 [StableAdmin] Invalidating designs only');
    queryClient.invalidateQueries({ queryKey: ['designs'] });
  }, [queryClient]);

  const invalidateMockups = useCallback(() => {
    logger.log('🔄 [StableAdmin] Invalidating mockups only');
    queryClient.invalidateQueries({ queryKey: ['mockups'] });
    queryClient.invalidateQueries({ queryKey: ['adminMockups'] });
  }, [queryClient]);

  return {
    invalidateProducts,
    invalidateLotteries, 
    invalidateDesigns,
    invalidateMockups
  };
};
