
import { QueryClient } from '@tanstack/react-query';

export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1 * 60 * 1000, // 1 minute seulement
        gcTime: 3 * 60 * 1000, // 3 minutes seulement  
        refetchOnWindowFocus: true, // Réactiver pour forcer refresh
        refetchOnReconnect: true, // Réactiver pour forcer refresh
        refetchOnMount: true, // IMPORTANT: toujours refetch au mount
        retry: (failureCount, error) => {
          // Retry intelligent basé sur le type d'erreur
          if (failureCount >= 3) return false;
          if (error?.message?.includes('AbortError')) return false;
          return true;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
};
