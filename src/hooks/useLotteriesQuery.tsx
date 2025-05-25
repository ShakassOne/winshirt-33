
import { useOptimizedQuery } from './useOptimizedQuery';
import { fetchAllLotteries } from '@/services/api.service';

export const useLotteriesQuery = () => {
  return useOptimizedQuery({
    queryKey: ['lotteries'],
    queryFn: async () => {
      try {
        const lotteries = await fetchAllLotteries();
        return lotteries || [];
      } catch (error) {
        console.error("[Lotteries] Failed to fetch lotteries:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};
