
import { useSimpleQuery } from './useSimpleQuery';
import { fetchAllLotteries } from '@/services/api.service';

export const useOptimizedLotteriesQuery = () => {
  return useSimpleQuery({
    queryKey: ['lotteries-optimized'],
    queryFn: fetchAllLotteries,
    debugName: 'LotteriesOptimized',
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
