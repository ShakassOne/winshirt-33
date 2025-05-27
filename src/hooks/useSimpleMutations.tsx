
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useSimpleMutations = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = useCallback(() => {
    console.log('[SimpleMutations] Invalidating products');
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['products-optimized'] });
    queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
  }, [queryClient]);

  const invalidateLotteries = useCallback(() => {
    console.log('[SimpleMutations] Invalidating lotteries');
    queryClient.invalidateQueries({ queryKey: ['lotteries'] });
    queryClient.invalidateQueries({ queryKey: ['lotteries-optimized'] });
    queryClient.invalidateQueries({ queryKey: ['adminLotteries'] });
    queryClient.invalidateQueries({ queryKey: ['featuredLotteries'] });
  }, [queryClient]);

  const invalidateDesigns = useCallback(() => {
    console.log('[SimpleMutations] Invalidating designs');
    queryClient.invalidateQueries({ queryKey: ['designs'] });
  }, [queryClient]);

  const invalidateMockups = useCallback(() => {
    console.log('[SimpleMutations] Invalidating mockups');
    queryClient.invalidateQueries({ queryKey: ['adminMockups'] });
  }, [queryClient]);

  return {
    invalidateProducts,
    invalidateLotteries, 
    invalidateDesigns,
    invalidateMockups
  };
};
