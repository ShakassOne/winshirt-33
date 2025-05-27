
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

interface SimpleQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: any[];
  queryFn: () => Promise<T>;
  debugName?: string;
}

export function useSimpleQuery<T>({
  queryKey,
  queryFn,
  debugName,
  ...options
}: SimpleQueryOptions<T>): UseQueryResult<T> {
  
  console.log(`[SimpleQuery:${debugName || 'Unknown'}] Starting query with key:`, queryKey);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await queryFn();
        console.log(`[SimpleQuery:${debugName}] Success:`, Array.isArray(result) ? `${result.length} items` : 'data received');
        return result;
      } catch (error) {
        console.error(`[SimpleQuery:${debugName}] Error:`, error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
    ...options,
  });
}
