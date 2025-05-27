
import { QueryClient } from '@tanstack/react-query';

export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        retry: 1,
        retryDelay: 1000,
      },
      mutations: {
        retry: 0,
      },
    },
  });
};

console.log('[QueryClient] Optimized configuration loaded');
