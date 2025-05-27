
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

interface StableAdminQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: any[];
  queryFn: () => Promise<T>;
  debugName?: string;
}

export function useStableAdminQuery<T>({
  queryKey,
  queryFn,
  debugName,
  ...options
}: StableAdminQueryOptions<T>): UseQueryResult<T> {
  
  console.log(`🔄 [StableAdmin:${debugName || 'Unknown'}] Query key:`, queryKey);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log(`⬇️ [StableAdmin:${debugName}] Fetching data...`);
      try {
        const result = await queryFn();
        console.log(`✅ [StableAdmin:${debugName}] Success:`, Array.isArray(result) ? `${result.length} items` : 'data received');
        return result;
      } catch (error) {
        console.error(`❌ [StableAdmin:${debugName}] Error:`, error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - très stable
    gcTime: 10 * 60 * 1000, // 10 minutes - cache long
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 1000,
    ...options,
  });
}
