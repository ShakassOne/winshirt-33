
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

  // Handlers optimisés pour les transformations
  const handleDesignMove = optimizedCallback((deltaX: number, deltaY: number) => {
    throttledDrag(() => {
      logger.log(`[OptimizedTransforms] Design move - ${currentSide}: ${deltaX}, ${deltaY}`);
      handlers.onDesignTransformChange('position', { x: deltaX, y: deltaY });
    }, deltaX, deltaY);
  });

  const handleDesignScale = optimizedCallback((scale: number) => {
    logger.log(`[OptimizedTransforms] Design scale - ${currentSide}: ${scale}`);
    handlers.onDesignTransformChange('scale', Math.max(0.5, Math.min(2, scale)));
  });

  const handleDesignRotate = optimizedCallback((rotation: number) => {
    logger.log(`[OptimizedTransforms] Design rotate - ${currentSide}: ${rotation}`);
    handlers.onDesignTransformChange('rotation', rotation);
  });

  const handleTextMove = optimizedCallback((deltaX: number, deltaY: number) => {
    throttledDrag(() => {
      logger.log(`[OptimizedTransforms] Text move - ${currentSide}: ${deltaX}, ${deltaY}`);
      handlers.onTextTransformChange('position', { x: deltaX, y: deltaY });
    }, deltaX, deltaY);
  });

  const handleTextScale = optimizedCallback((scale: number) => {
    logger.log(`[OptimizedTransforms] Text scale - ${currentSide}: ${scale}`);
    handlers.onTextTransformChange('scale', Math.max(0.5, Math.min(2, scale)));
  });

  const handleTextRotate = optimizedCallback((rotation: number) => {
    logger.log(`[OptimizedTransforms] Text rotate - ${currentSide}: ${rotation}`);
    handlers.onTextTransformChange('rotation', rotation);
  });

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
