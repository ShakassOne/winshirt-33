
import { useMemo, useCallback } from 'react';
import { throttle, debounce } from 'lodash';

export const usePerformanceOptimization = () => {
  // Throttle pour les événements de déplacement (drag)
  const throttledDrag = useMemo(
    () => throttle((callback: Function, ...args: any[]) => {
      callback(...args);
    }, 16), // 60 FPS
    []
  );

  // Debounce pour les mises à jour de texte
  const debouncedTextUpdate = useMemo(
    () => debounce((callback: Function, ...args: any[]) => {
      callback(...args);
    }, 300),
    []
  );

  // Optimisation des re-renders avec useCallback
  const optimizedCallback = useCallback((callback: Function) => {
    return useCallback(callback, []);
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
