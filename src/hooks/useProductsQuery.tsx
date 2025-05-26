
import { useOptimizedQuery } from './useOptimizedQuery';
import { fetchAllProducts } from '@/services/api.service';

export const useProductsQuery = () => {
  return useOptimizedQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        console.log('[Products Query] Fetching products...');
        const products = await fetchAllProducts();
        console.log('[Products Query] Fetched', products?.length || 0, 'products');
        return products || [];
      } catch (error) {
        console.error("[Products Query] Failed to fetch products:", error);
        throw error; // Let React Query handle the error
      }
    },
    staleTime: 30 * 1000, // 30 seconds only
    gcTime: 2 * 60 * 1000, // 2 minutes only
  });
};
