
import { usePaginatedQuery } from './usePaginatedQuery';
import { fetchLotteriesPaginated, fetchFeaturedLotteries } from '@/services/optimizedApi.service';
import { useQuery } from '@tanstack/react-query';

interface LotteryFilters {
  isActive?: boolean | null;
  search?: string;
}

export const useOptimizedLotteries = (filters?: LotteryFilters, limit: number = 20) => {
  return usePaginatedQuery({
    queryKey: ['lotteries-optimized', filters],
    queryFn: (page, limit) => fetchLotteriesPaginated(page, limit, filters),
    debugName: 'OptimizedLotteries',
    initialLimit: limit,
  });
};

// Hook spécialisé pour les loteries en vedette
export const useFeaturedLotteries = () => {
  return useQuery({
    queryKey: ['featured-lotteries'],
    queryFn: fetchFeaturedLotteries,
    staleTime: 5 * 60 * 1000, // 5 minutes pour les loteries en vedette
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
