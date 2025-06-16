
import { useQuery, UseQueryOptions, UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

interface UnifiedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: any[];
  queryFn: () => Promise<T>;
  debugName?: string;
}

export function useUnifiedQuery<T>({
  queryKey,
  queryFn,
  debugName,
  ...options
}: UnifiedQueryOptions<T>): UseQueryResult<T> & { forceRefresh: () => void } {
  
  const queryClient = useQueryClient();
  
  const forceRefresh = useCallback(() => {
    console.log(`🔄 [${debugName}] Force refresh triggered`);
    queryClient.invalidateQueries({ queryKey });
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false, // Pas de refetch automatique
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
  };
}
