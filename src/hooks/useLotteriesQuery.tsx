
import { useOptimizedQuery } from './useOptimizedQuery';
import { fetchAllLotteries } from '@/services/api.service';

export const useLotteriesQuery = () => {
  return useOptimizedQuery({
    queryKey: ['lotteries'],
    queryFn: async () => {
      try {
        console.log('[Lotteries Query] Fetching lotteries...');
        const lotteries = await fetchAllLotteries();
        console.log('[Lotteries Query] Fetched', lotteries?.length || 0, 'lotteries');
        return lotteries || [];
      } catch (error) {
        console.error("[Lotteries Query] Failed to fetch lotteries:", error);
        throw error; // Let React Query handle the error
      }
    },
    staleTime: 30 * 1000, // 30 seconds only
    gcTime: 2 * 60 * 1000, // 2 minutes only
  });
};
