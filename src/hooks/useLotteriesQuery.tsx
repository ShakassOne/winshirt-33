
import { useSimpleQuery } from './useSimpleQuery';
import { fetchAllLotteries } from '@/services/api.service';

export const useLotteriesQuery = () => {
  return useSimpleQuery({
    queryKey: ['lotteries'],
    queryFn: async () => {
      const lotteries = await fetchAllLotteries();
      return lotteries || [];
    },
    debugName: 'Lotteries',
    staleTime: 30 * 1000, // 30 seconds only
    gcTime: 2 * 60 * 1000, // 2 minutes only
  });
};
