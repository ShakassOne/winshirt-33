
import logger from '@/utils/logger';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useUnifiedMutations = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = useCallback(() => {
    logger.log('[UnifiedMutations] Invalidating products');
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [queryClient]);

  const invalidateLotteries = useCallback(() => {
    logger.log('[UnifiedMutations] Invalidating lotteries');
    queryClient.invalidateQueries({ queryKey: ['lotteries'] });
  }, [queryClient]);

  const invalidateDesigns = useCallback(() => {
    logger.log('[UnifiedMutations] Invalidating designs');
    queryClient.invalidateQueries({ queryKey: ['designs'] });
  }, [queryClient]);

  const invalidateMockups = useCallback(() => {
    logger.log('[UnifiedMutations] Invalidating mockups');
    queryClient.invalidateQueries({ queryKey: ['mockups'] });
  }, [queryClient]);

  return {
    invalidateProducts,
    invalidateLotteries, 
    invalidateDesigns,
    invalidateMockups
  };
};
