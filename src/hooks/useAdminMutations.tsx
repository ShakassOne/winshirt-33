
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useAdminMutations = () => {
  const queryClient = useQueryClient();

  const invalidateData = useCallback((type: 'products' | 'lotteries' | 'all') => {
    console.log('[Admin Mutations] Invalidating', type, 'data');
    
    if (type === 'products' || type === 'all') {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
    
    if (type === 'lotteries' || type === 'all') {
      queryClient.invalidateQueries({ queryKey: ['lotteries'] });
      queryClient.invalidateQueries({ queryKey: ['featuredLotteries'] });
      queryClient.invalidateQueries({ queryKey: ['adminLotteries'] });
    }
    
    // Force a small delay to ensure cache clearing
    setTimeout(() => {
      console.log('[Admin Mutations] Cache invalidation completed');
    }, 100);
  }, [queryClient]);

  const resetCache = useCallback(() => {
    console.log('[Admin Mutations] Resetting entire cache');
    queryClient.clear();
  }, [queryClient]);

  return {
    invalidateData,
    resetCache
  };
};
