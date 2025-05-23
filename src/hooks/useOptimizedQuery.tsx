
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: any[];
  queryFn: () => Promise<T>;
  dependencies?: any[];
}

export function useOptimizedQuery<T>({
  queryKey,
  queryFn,
  dependencies = [],
  ...options
}: OptimizedQueryOptions<T>) {
  return useQuery({
    queryKey: [...queryKey, ...dependencies],
    queryFn: async () => {
      try {
        console.log(`[Query] Starting query for key: ${JSON.stringify(queryKey)}`);
        const result = await queryFn();
        console.log(`[Query] Completed query for key: ${JSON.stringify(queryKey)}`);
        return result;
      } catch (error) {
        console.error(`[Query] Error in query ${JSON.stringify(queryKey)}:`, error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      console.log(`[Query] Retry attempt ${failureCount} for key: ${JSON.stringify(queryKey)}`);
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}
