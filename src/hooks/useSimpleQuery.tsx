
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
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await queryFn();
        return result;
      } catch (error) {
        console.error(`[Query:${debugName}] Error:`, error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
    ...options,
  });
}
