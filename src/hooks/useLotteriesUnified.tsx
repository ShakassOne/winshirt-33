
import { useUnifiedQuery } from './useUnifiedQuery';
import { fetchAllLotteries } from '@/services/api.service';

export const useLotteriesUnified = () => {
  return useUnifiedQuery({
    queryKey: ['lotteries'],
    queryFn: async () => {
      const lotteries = await fetchAllLotteries();
      return lotteries || [];
    },
    debugName: 'Lotteries',
  });
};
