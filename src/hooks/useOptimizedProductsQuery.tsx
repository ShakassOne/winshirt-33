
import { useSimpleQuery } from './useSimpleQuery';
import { fetchAllProducts } from '@/services/api.service';

export const useOptimizedProductsQuery = () => {
  return useSimpleQuery({
    queryKey: ['products-optimized'],
    queryFn: async () => {
      const products = await fetchAllProducts();
      if (!products) {
        console.warn('[ProductsOptimized] No products returned, returning empty array');
        return [];
      }
      return products;
    },
    debugName: 'ProductsOptimized',
    staleTime: 30 * 1000, // 30 secondes seulement
    gcTime: 2 * 60 * 1000, // 2 minutes seulement
    refetchOnMount: true, // TOUJOURS refetch
    enableForceRefresh: true,
  });
};
