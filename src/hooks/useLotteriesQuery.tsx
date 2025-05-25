
import { useOptimizedQuery } from './useOptimizedQuery';
import { fetchAllLotteries } from '@/services/api.service';
import { toast } from 'sonner';

export const useLotteriesQuery = () => {
  return useOptimizedQuery({
    queryKey: ['lotteries'],
    queryFn: async () => {
      console.log('[Lotteries] Fetching lotteries...');
      try {
        const lotteries = await fetchAllLotteries();
        console.log(`[Lotteries] Fetched ${lotteries?.length || 0} lotteries`, lotteries);
        
        if (!lotteries || lotteries.length === 0) {
          console.warn('[Lotteries] No lotteries found in database');
        }
        
        return lotteries;
      } catch (error) {
        console.error('[Lotteries] Error fetching lotteries:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error: Error) => {
        console.error("[Lotteries] Failed to fetch lotteries:", error);
        toast.error("Erreur lors du chargement des loteries");
      }
    }
  });
};
