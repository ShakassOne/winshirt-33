
import { usePaginatedQuery } from './usePaginatedQuery';
import { fetchProductsPaginated, fetchFeaturedProducts } from '@/services/optimizedApi.service';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface ProductFilters {
  category?: string;
  search?: string;
  isActive?: boolean;
}

export const useOptimizedProducts = (filters?: ProductFilters, limit: number = 20) => {
  return usePaginatedQuery({
    queryKey: ['products-optimized', filters],
    queryFn: (page, limit) => fetchProductsPaginated(page, limit, filters),
    debugName: 'OptimizedProducts',
    initialLimit: limit,
  });
};

// Hook spécialisé pour l'accueil (sans pagination)
export const useFeaturedProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: ['featured-products', limit],
    queryFn: () => fetchFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes pour les produits en vedette
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
