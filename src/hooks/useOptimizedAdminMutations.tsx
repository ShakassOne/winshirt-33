
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useOptimizedAdminMutations = () => {
  const queryClient = useQueryClient();

  const invalidateData = useCallback(async (type: 'products' | 'lotteries' | 'all') => {
    console.log('[Optimized Admin Mutations] Invalidating', type, 'data');
    
    try {
      if (type === 'products' || type === 'all') {
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        await queryClient.invalidateQueries({ queryKey: ['products-optimized'] });
      }
      
      if (type === 'lotteries' || type === 'all') {
        await queryClient.invalidateQueries({ queryKey: ['lotteries'] });
        await queryClient.invalidateQueries({ queryKey: ['lotteries-optimized'] });
        await queryClient.invalidateQueries({ queryKey: ['featuredLotteries'] });
        await queryClient.invalidateQueries({ queryKey: ['adminLotteries'] });
      }
      
      console.log('[Optimized Admin Mutations] Cache invalidation completed successfully');
    } catch (error) {
      console.error('[Optimized Admin Mutations] Cache invalidation failed:', error);
    }
  }, [queryClient]);

  const resetCache = useCallback(async () => {
    console.log('[Optimized Admin Mutations] Resetting entire cache');
    try {
      await queryClient.clear();
      console.log('[Optimized Admin Mutations] Cache reset completed');
    } catch (error) {
      console.error('[Optimized Admin Mutations] Cache reset failed:', error);
    }
  }, [queryClient]);

  return {
    invalidateData,
    resetCache
  };
};
