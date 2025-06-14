
import { useQuery, UseQueryOptions, UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

interface SimpleQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: any[];
  queryFn: () => Promise<T>;
  debugName?: string;
  enableForceRefresh?: boolean;
}

export function useSimpleQuery<T>({
  queryKey,
  queryFn,
  debugName,
  enableForceRefresh = true,
  ...options
}: SimpleQueryOptions<T>): UseQueryResult<T> & { forceRefresh: () => void } {
  
  const queryClient = useQueryClient();
  
  const forceRefresh = useCallback(() => {
    console.log(`🔄 [${debugName}] Force refresh triggered`);
    queryClient.invalidateQueries({ queryKey });
    queryClient.refetchQueries({ queryKey });
  }, [queryClient, queryKey, debugName]);
  
  const result = useQuery({
    queryKey,
    queryFn: async () => {
      console.log(`⬇️ [${debugName}] Starting fetch...`);
      try {
        const startTime = Date.now();
        const result = await queryFn();
        const duration = Date.now() - startTime;
        console.log(`✅ [${debugName}] Success in ${duration}ms:`, Array.isArray(result) ? `${result.length} items` : 'data received');
        return result;
      } catch (error) {
        console.error(`❌ [${debugName}] Error:`, error);
        throw error;
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true, // TOUJOURS refetch
    retry: (failureCount, error) => {
      console.log(`🔄 [${debugName}] Retry attempt ${failureCount}:`, error?.message);
      if (failureCount >= 2) return false;
      return true;
    },
    retryDelay: (attemptIndex) => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 2000);
      console.log(`⏱️ [${debugName}] Retry delay: ${delay}ms`);
      return delay;
    },
    ...options,
  });

  return {
    ...result,
    forceRefresh: enableForceRefresh ? forceRefresh : () => {},
  };
}
