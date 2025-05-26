
import { useOptimizedQuery } from './useOptimizedQuery';
import { fetchAllProducts } from '@/services/api.service';

export const useProductsQuery = () => {
  return useOptimizedQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    // Remove conflicting options - use defaults from useOptimizedQuery
  });
};
