
import { useCallback, useMemo } from 'react';
import { usePerformanceOptimization } from './usePerformanceOptimization';
import logger from '@/utils/logger';

interface TransformHandlers {
  onDesignTransformChange: (property: string, value: any) => void;
  onTextTransformChange: (property: string, value: any) => void;
}

export const useOptimizedTransforms = (
  currentSide: 'front' | 'back',
  handlers: TransformHandlers
) => {
  const { throttledDrag, optimizedCallback } = usePerformanceOptimization();

  // Handlers optimisés pour les transformations avec types corrects
  const handleDesignMove = useCallback((deltaX: number, deltaY: number) => {
    throttledDrag(() => {
      logger.log(`[OptimizedTransforms] Design move - ${currentSide}: ${deltaX}, ${deltaY}`);
      handlers.onDesignTransformChange('position', { x: deltaX, y: deltaY });
    }, deltaX, deltaY);
  }, [throttledDrag, handlers, currentSide]);

  const handleDesignScale = useCallback((scale: number) => {
    logger.log(`[OptimizedTransforms] Design scale - ${currentSide}: ${scale}`);
    handlers.onDesignTransformChange('scale', Math.max(0.5, Math.min(2, scale)));
  }, [handlers, currentSide]);

  const handleDesignRotate = useCallback((rotation: number) => {
    logger.log(`[OptimizedTransforms] Design rotate - ${currentSide}: ${rotation}`);
    handlers.onDesignTransformChange('rotation', rotation);
  }, [handlers, currentSide]);

  const handleTextMove = useCallback((deltaX: number, deltaY: number) => {
    throttledDrag(() => {
      logger.log(`[OptimizedTransforms] Text move - ${currentSide}: ${deltaX}, ${deltaY}`);
      handlers.onTextTransformChange('position', { x: deltaX, y: deltaY });
    }, deltaX, deltaY);
  }, [throttledDrag, handlers, currentSide]);

  const handleTextScale = useCallback((scale: number) => {
    logger.log(`[OptimizedTransforms] Text scale - ${currentSide}: ${scale}`);
    handlers.onTextTransformChange('scale', Math.max(0.5, Math.min(2, scale)));
  }, [handlers, currentSide]);

  const handleTextRotate = useCallback((rotation: number) => {
    logger.log(`[OptimizedTransforms] Text rotate - ${currentSide}: ${rotation}`);
    handlers.onTextTransformChange('rotation', rotation);
  }, [handlers, currentSide]);

  // Actions rapides mémoisées
  const quickActions = useMemo(() => ({
    scaleUp: () => handleDesignScale(1.1),
    scaleDown: () => handleDesignScale(0.9),
    rotateLeft: () => handleDesignRotate(-15),
    rotateRight: () => handleDesignRotate(15),
    resetTransform: () => {
      handlers.onDesignTransformChange('position', { x: 0, y: 0 });
      handlers.onDesignTransformChange('scale', 1);
      handlers.onDesignTransformChange('rotation', 0);
    }
  }), [handleDesignScale, handleDesignRotate, handlers]);

  return {
    handleDesignMove,
    handleDesignScale,
    handleDesignRotate,
    handleTextMove,
    handleTextScale,
    handleTextRotate,
    quickActions
  };
};
