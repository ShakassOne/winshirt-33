
import { useSimpleQuery } from './useSimpleQuery';
import { fetchAllProducts } from '@/services/api.service';

export const useOptimizedProductsQuery = () => {
  return useSimpleQuery({
    queryKey: ['products-optimized'],
    queryFn: fetchAllProducts,
    debugName: 'ProductsOptimized',
    staleTime: 5 * 60 * 1000,
    gcTime: 8 * 60 * 1000,
  });
};
