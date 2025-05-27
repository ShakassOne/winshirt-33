
import { useStableQuery } from './useStableQuery';
import { fetchAllProducts } from '@/services/api.service';

export const useOptimizedProductsQuery = () => {
  return useStableQuery({
    queryKey: ['products-optimized'],
    queryFn: async () => {
      try {
        const products = await fetchAllProducts();
        return products || [];
      } catch (error) {
        console.error("[Optimized Products Query] Failed to fetch products:", error);
        throw error;
      }
    },
    debugName: 'ProductsQuery',
    staleTime: 5 * 60 * 1000, // 5 minutes pour les produits
    gcTime: 8 * 60 * 1000, // 8 minutes en cache
  });
};
