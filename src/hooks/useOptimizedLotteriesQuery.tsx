
import { useStableQuery } from './useStableQuery';
import { fetchAllLotteries } from '@/services/api.service';

export const useOptimizedLotteriesQuery = () => {
  return useStableQuery({
    queryKey: ['lotteries-optimized'],
    queryFn: async () => {
      try {
        const lotteries = await fetchAllLotteries();
        return lotteries || [];
      } catch (error) {
        console.error("[Optimized Lotteries Query] Failed to fetch lotteries:", error);
        throw error;
      }
    },
    debugName: 'LotteriesQuery',
    staleTime: 3 * 60 * 1000, // 3 minutes pour les loteries
    gcTime: 5 * 60 * 1000, // 5 minutes en cache
  });
};
