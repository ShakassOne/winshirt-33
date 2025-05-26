
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
  staleTime = 1 * 60 * 1000, // Default 1 minute
  gcTime = 3 * 60 * 1000, // Default 3 minutes
  ...options
}: OptimizedQueryOptions<T>) {
  return useQuery({
    queryKey: [...queryKey, ...dependencies],
    queryFn: queryFn,
    staleTime,
    gcTime,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true, // Important for connectivity issues
    retry: (failureCount, error) => {
      // Only retry network errors, not 404s etc
      if (failureCount >= 2) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    ...options,
  });
}
