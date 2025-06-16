
import { useQuery, UseQueryOptions, UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

interface PaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface PaginatedQueryOptions<T> extends Omit<UseQueryOptions<PaginatedData<T>>, 'queryKey' | 'queryFn'> {
  queryKey: any[];
  queryFn: (page: number, limit: number) => Promise<{ data: T[]; total: number }>;
  debugName?: string;
  initialLimit?: number;
}

export function usePaginatedQuery<T>({
  queryKey,
  queryFn,
  debugName,
  initialLimit = 20,
  ...options
}: PaginatedQueryOptions<T>): UseQueryResult<PaginatedData<T>> & { 
  forceRefresh: () => void;
  loadMore: () => void;
  page: number;
  limit: number;
  setLimit: (limit: number) => void;
} {
  
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  
  const forceRefresh = useCallback(() => {
    console.log(`🔄 [${debugName}] Force refresh triggered`);
    setPage(1);
    queryClient.invalidateQueries({ queryKey: [...queryKey, page, limit] });
  }, [queryClient, queryKey, debugName, page, limit]);
  
  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);
  
  const result = useQuery({
    queryKey: [...queryKey, page, limit],
    queryFn: async () => {
      console.log(`⬇️ [${debugName}] Starting paginated fetch - Page ${page}, Limit ${limit}`);
      try {
        const startTime = Date.now();
        const response = await queryFn(page, limit);
        const duration = Date.now() - startTime;
        
        const paginatedData: PaginatedData<T> = {
          data: response.data,
          total: response.total,
          page,
          limit,
          hasMore: response.data.length === limit && (page * limit) < response.total
        };
        
        console.log(`✅ [${debugName}] Success in ${duration}ms: Page ${page}/${Math.ceil(response.total / limit)}, ${response.data.length} items`);
        return paginatedData;
      } catch (error) {
        console.error(`❌ [${debugName}] Error:`, error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      console.log(`🔄 [${debugName}] Retry attempt ${failureCount}:`, error?.message);
      if (failureCount >= 2) return false;
      return true;
    },
    ...options,
  });

  return {
    ...result,
    forceRefresh,
    loadMore,
    page,
    limit,
    setLimit: (newLimit: number) => {
      setLimit(newLimit);
      setPage(1); // Reset to first page when changing limit
    },
  };
}
