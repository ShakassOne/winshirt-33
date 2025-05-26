
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
    queryFn: queryFn,
    // Use consistent settings with App.tsx queryClient
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1, // Reduced from false to 1 for better error handling
    ...options,
  });
}
