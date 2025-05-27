
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

interface StableQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: any[];
  queryFn: () => Promise<T>;
  debugName?: string;
}

export function useStableQuery<T>({
  queryKey,
  queryFn,
  debugName,
  ...options
}: StableQueryOptions<T>): UseQueryResult<T> {
  
  // Stabiliser la queryFn pour éviter les re-renders
  const stableQueryFn = useCallback(async () => {
    if (debugName) {
      console.log(`[StableQuery:${debugName}] Starting fetch...`);
    }
    try {
      const result = await queryFn();
      if (debugName) {
        console.log(`[StableQuery:${debugName}] Fetch successful:`, Array.isArray(result) ? `${result.length} items` : 'data received');
      }
      return result;
    } catch (error) {
      if (debugName) {
        console.error(`[StableQuery:${debugName}] Fetch failed:`, error);
      }
      throw error;
    }
  }, [queryFn, debugName]);

  // Stabiliser la queryKey
  const stableQueryKey = useMemo(() => queryKey, [JSON.stringify(queryKey)]);

  return useQuery({
    queryKey: stableQueryKey,
    queryFn: stableQueryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes par défaut
    gcTime: 10 * 60 * 1000, // 10 minutes par défaut
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount, error: any) => {
      if (failureCount >= 2) return false;
      if (error?.status === 404 || error?.status === 403) return false;
      return true;
    },
    ...options,
  });
}
