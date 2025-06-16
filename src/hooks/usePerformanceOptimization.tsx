
import { useMemo, useCallback } from 'react';
import { throttle, debounce } from 'lodash';

export const usePerformanceOptimization = () => {
  // Throttle pour les événements de déplacement (drag)
  const throttledDrag = useMemo(
    () => throttle((callback: () => void, ...args: any[]) => {
      callback();
    }, 16), // 60 FPS
    []
  );

  // Debounce pour les mises à jour de texte
  const debouncedTextUpdate = useMemo(
    () => debounce((callback: () => void, ...args: any[]) => {
      callback();
    }, 300),
    []
  );

  // Optimisation des re-renders avec useCallback - maintenant retourne la fonction telle quelle
  const optimizedCallback = useCallback(<T extends (...args: any[]) => any>(callback: T): T => {
    return useCallback(callback, []) as T;
  }, []);

  // Memoization helper
  const memoizeValue = useCallback((value: any, deps: any[]) => {
    return useMemo(() => value, deps);
  }, []);

  return {
    throttledDrag,
    debouncedTextUpdate,
    optimizedCallback,
    memoizeValue
  };
};
