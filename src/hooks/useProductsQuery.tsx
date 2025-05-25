
import { useOptimizedQuery } from './useOptimizedQuery';
import { fetchAllProducts } from '@/services/api.service';
import { toast } from 'sonner';

export const useProductsQuery = () => {
  return useOptimizedQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('[Products] Fetching products...');
      try {
        const products = await fetchAllProducts();
        console.log(`[Products] Fetched ${products?.length || 0} products`, products);
        
        if (!products || products.length === 0) {
          console.warn('[Products] No products found in database');
        }
        
        return products;
      } catch (error) {
        console.error('[Products] Error fetching products:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error: Error) => {
        console.error("[Products] Failed to fetch products:", error);
        toast.error("Erreur lors du chargement des produits");
      }
    }
  });
};
