
import { QueryClient } from '@tanstack/react-query';

// Configuration unifiée et optimisée pour React Query
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Configuration optimale pour éviter les re-fetches excessifs
        staleTime: 5 * 60 * 1000, // 5 minutes - données considérées comme fraîches
        gcTime: 10 * 60 * 1000, // 10 minutes - garde en cache
        refetchOnWindowFocus: false, // Évite les re-fetches intempestifs
        refetchOnReconnect: true, // Re-fetch seulement lors de reconnexion réseau
        retry: (failureCount, error: any) => {
          // Stratégie de retry intelligente
          if (failureCount >= 2) return false;
          if (error?.status === 404 || error?.status === 403) return false;
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

console.log('[QueryClient] Optimized query client configuration loaded');
