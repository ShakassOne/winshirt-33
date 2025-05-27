
import { useCallback, useRef } from 'react';

export const useStableRefetch = (refetchFn: () => void) => {
  const lastRefetch = useRef(0);
  const DEBOUNCE_MS = 1000; // 1 seconde entre les refetch
  
  return useCallback(() => {
    const now = Date.now();
    if (now - lastRefetch.current > DEBOUNCE_MS) {
      lastRefetch.current = now;
      refetchFn();
      console.log('[StableRefetch] Refetch triggered');
    } else {
      console.log('[StableRefetch] Refetch debounced');
    }
  }, [refetchFn]);
};
