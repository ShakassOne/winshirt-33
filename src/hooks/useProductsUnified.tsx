
import { useUnifiedQuery } from './useUnifiedQuery';
import { fetchAllProducts } from '@/services/api.service';

export const useProductsUnified = () => {
  return useUnifiedQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const products = await fetchAllProducts();
      return products || [];
    },
    debugName: 'Products',
  });
};
