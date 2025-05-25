
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
        console.log(`[Lotteries] Fetched ${lotteries?.length || 0} lotteries`);
        return lotteries || [];
      } catch (error) {
        console.error("[Lotteries] Failed to fetch lotteries:", error);
        toast.error("Erreur lors du chargement des loteries");
        // Retourner un tableau vide au lieu de relancer l'erreur
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Réduire les tentatives pour éviter les boucles
  });
};
