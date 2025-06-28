
import { useState, useCallback } from 'react';
import { productionCaptureService } from '@/services/productionCapture.service';
import logger from '@/utils/logger';

interface ProductionCaptureResult {
  frontUrl?: string;
  backUrl?: string;
}

export const useProductionCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureForProduction = useCallback(async (customization: any): Promise<ProductionCaptureResult> => {
    if (isCapturing) {
      logger.log('⚠️ [useProductionCapture] Capture already in progress');
      return {};
    }

    setIsCapturing(true);

    try {
      logger.log('🎬 [useProductionCapture] Starting production capture process');
      
      // Utiliser le service optimisé
      const result = await productionCaptureService.captureForProduction(customization);
      
      logger.log('🎯 [useProductionCapture] Production capture completed:', result);
      return result;
    } catch (error) {
      console.error('❌ [useProductionCapture] Error during production capture:', error);
      return {};
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  return {
    captureForProduction,
    isCapturing
  };
};
