
import { QueryClient } from '@tanstack/react-query';

export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes - plus long pour éviter les refetch
        gcTime: 10 * 60 * 1000, // 10 minutes - plus long pour garder en cache
        refetchOnWindowFocus: false, // Désactiver pour éviter les refetch inutiles
        refetchOnReconnect: true, 
        refetchOnMount: false, // IMPORTANT: ne pas toujours refetch au mount
        retry: (failureCount, error) => {
          // Retry plus intelligent basé sur le type d'erreur
          if (failureCount >= 2) return false; // Réduit de 3 à 2
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
