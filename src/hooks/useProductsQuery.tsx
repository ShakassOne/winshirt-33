
import { useOptimizedQuery } from './useOptimizedQuery';
import { fetchAllProducts } from '@/services/api.service';

export const useProductsQuery = () => {
  return useOptimizedQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};
