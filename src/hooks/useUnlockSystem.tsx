
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useUnlockSystem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const clearAllCache = useCallback(() => {
    console.log('🧹 [UnlockSystem] Clearing all cache...');
    
    // Vider complètement le cache React Query
    queryClient.clear();
    
    // Invalider toutes les requêtes
    queryClient.invalidateQueries();
    
    // Nettoyer le localStorage (au cas où)
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    
    // Nettoyer le sessionStorage
    try {
      sessionStorage.clear();
    } catch (e) {
      console.warn('Could not clear sessionStorage:', e);
    }
    
    toast({
      title: "Cache nettoyé",
      description: "Toutes les données en cache ont été effacées. La page va se recharger.",
    });
    
    // Recharger la page après un délai
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }, [queryClient, toast]);

  const forceRefreshAll = useCallback(() => {
    console.log('🔄 [UnlockSystem] Force refresh all queries...');
    
    // Invalider et refetch toutes les requêtes
    queryClient.invalidateQueries();
    queryClient.refetchQueries();
    
    toast({
      title: "Actualisation forcée",
      description: "Toutes les données sont en cours de rechargement...",
    });
  }, [queryClient, toast]);

  const diagnoseStuckQueries = useCallback(() => {
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();
    
    console.log('🔍 [UnlockSystem] Diagnosing stuck queries...');
    
    queries.forEach(query => {
      const state = query.state;
      console.log(`Query [${query.queryHash}]:`, {
        status: state.status,
        fetchStatus: state.fetchStatus,
        isLoading: state.fetchStatus === 'fetching',
        isError: state.status === 'error',
        error: state.error?.message,
        dataUpdatedAt: new Date(state.dataUpdatedAt),
        errorUpdatedAt: state.errorUpdatedAt ? new Date(state.errorUpdatedAt) : null,
      });
    });
    
    // Forcer le refresh des requêtes bloquées
    const stuckQueries = queries.filter(q => 
      q.state.fetchStatus === 'fetching' && (Date.now() - q.state.dataUpdatedAt > 10000)
    );
    
    if (stuckQueries.length > 0) {
      console.log(`🚨 [UnlockSystem] Found ${stuckQueries.length} stuck queries, forcing refresh...`);
      stuckQueries.forEach(query => {
        queryClient.cancelQueries({ queryKey: query.queryKey });
        queryClient.refetchQueries({ queryKey: query.queryKey });
      });
    }
  }, [queryClient]);

  return {
    clearAllCache,
    forceRefreshAll,
    diagnoseStuckQueries,
  };
};
