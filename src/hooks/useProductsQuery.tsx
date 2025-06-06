
import { useSimpleQuery } from './useSimpleQuery';
import { fetchAllProducts } from '@/services/api.service';

export const useProductsQuery = () => {
  return useSimpleQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const products = await fetchAllProducts();
      return products || [];
    },
    debugName: 'Products',
    staleTime: 30 * 1000, // 30 seconds only
    gcTime: 2 * 60 * 1000, // 2 minutes only
  });
};
