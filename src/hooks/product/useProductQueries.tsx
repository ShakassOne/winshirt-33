
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById, fetchMockupById, fetchAllLotteries, fetchAllDesigns } from '@/services/api.service';

export const useProductQueries = () => {
  const { id } = useParams<{ id: string }>();
  
  // Product query
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  // Mockup query
  const { data: mockup, isLoading: isLoadingMockup } = useQuery({
    queryKey: ['mockup', product?.mockup_id],
    queryFn: () => fetchMockupById(product?.mockup_id!),
    enabled: !!product?.mockup_id,
  });

  // Lotteries query
  const { data: lotteries = [], isLoading: isLoadingLotteries } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries,
  });

  // Designs query
  const { data: designs = [], isLoading: isLoadingDesigns } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchAllDesigns,
  });

  // Computed values
  const uniqueCategories = designs ? ['all', ...new Set(designs.map(design => design.category))] : ['all'];
  
  const getFilteredDesigns = (categoryFilter: string) => {
    return designs ?
      categoryFilter === 'all' ?
        designs.filter(design => design.is_active !== false) :
        designs.filter(design => design.is_active !== false && design.category === categoryFilter) :
      [];
  };

  const activeLotteries = lotteries.filter(lottery => lottery.is_active);

  return {
    id,
    product,
    mockup,
    lotteries,
    designs,
    isLoading,
    isLoadingMockup,
    isLoadingLotteries,
    isLoadingDesigns,
    uniqueCategories,
    getFilteredDesigns,
    activeLotteries
  };
};
