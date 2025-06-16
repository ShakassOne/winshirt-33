
import { QueryClient } from '@tanstack/react-query';

export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes au lieu de 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes au lieu de 3 minutes  
        refetchOnWindowFocus: false, // Désactiver pour éviter les refetch inutiles
        refetchOnReconnect: true, 
        refetchOnMount: false, // IMPORTANT: ne pas toujours refetch au mount
        retry: (failureCount, error) => {
          // Retry plus intelligent
          if (failureCount >= 2) return false;
          if (error?.message?.includes('AbortError')) return false;
          if (error?.message?.includes('404')) return false;
          return true;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
};
