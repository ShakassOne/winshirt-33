
import { useState, useCallback } from 'react';
import { retroactiveCaptureService } from '@/services/retroactiveCapture.service';
import logger from '@/utils/logger';

interface RetroactiveCaptureResult {
  orderId: string;
  success: boolean;
  frontUrl?: string;
  backUrl?: string;
  error?: string;
}

export const useRetroactiveCapture = () => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationProgress, setRegenerationProgress] = useState<{
    current: number;
    total: number;
    currentOrderId?: string;
  }>({ current: 0, total: 0 });

  const regenerateSingleOrder = useCallback(async (orderId: string): Promise<RetroactiveCaptureResult> => {
    setIsRegenerating(true);
    
    try {
      logger.log(`🔄 [useRetroactiveCapture] Régénération HD pour commande ${orderId}`);
      const result = await retroactiveCaptureService.regenerateHDFiles(orderId);
      return result;
    } catch (error) {
      console.error('❌ [useRetroactiveCapture] Erreur régénération:', error);
      return {
        orderId,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    } finally {
      setIsRegenerating(false);
    }
  }, []);

  const regenerateMultipleOrders = useCallback(async (orderIds: string[]): Promise<RetroactiveCaptureResult[]> => {
    setIsRegenerating(true);
    setRegenerationProgress({ current: 0, total: orderIds.length });

    try {
      const results: RetroactiveCaptureResult[] = [];
      
      for (let i = 0; i < orderIds.length; i++) {
        const orderId = orderIds[i];
        setRegenerationProgress({ 
          current: i + 1, 
          total: orderIds.length, 
          currentOrderId: orderId 
        });

        const result = await retroactiveCaptureService.regenerateHDFiles(orderId);
        results.push(result);

        // Pause entre chaque traitement
        if (i < orderIds.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      return results;
    } finally {
      setIsRegenerating(false);
      setRegenerationProgress({ current: 0, total: 0 });
    }
  }, []);

  return {
    regenerateSingleOrder,
    regenerateMultipleOrders,
    isRegenerating,
    regenerationProgress
  };
};
