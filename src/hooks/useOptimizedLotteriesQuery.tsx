
import { useSimpleQuery } from './useSimpleQuery';
import { fetchAllLotteries } from '@/services/api.service';

export const useOptimizedLotteriesQuery = () => {
  return useSimpleQuery({
    queryKey: ['lotteries-optimized'],
    queryFn: async () => {
      const lotteries = await fetchAllLotteries();
      if (!lotteries) {
        console.warn('[LotteriesOptimized] No lotteries returned, returning empty array');
        return [];
      }
      return lotteries;
    },
    debugName: 'LotteriesOptimized',
    staleTime: 30 * 1000, // 30 secondes seulement
    gcTime: 2 * 60 * 1000, // 2 minutes seulement
    refetchOnMount: true, // TOUJOURS refetch
    enableForceRefresh: true,
  });
};
