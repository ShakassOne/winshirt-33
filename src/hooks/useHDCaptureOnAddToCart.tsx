
import { useCallback } from 'react';
import { useUnifiedCapture } from './useUnifiedCapture';
import { enrichCustomizationWithCaptures, validateUnifiedCustomization } from '@/services/unifiedCapture.service';

export const useHDCaptureOnAddToCart = () => {
  const { captureUnified, isCapturing } = useUnifiedCapture();

  const captureForProduction = useCallback(async (customization: any): Promise<any> => {
    try {
      console.log('🎬 [HDCaptureOnAddToCart] Début capture pour production');
      
      // Valider la personnalisation
      if (!validateUnifiedCustomization(customization)) {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucune personnalisation valide');
        return customization;
      }

      // Attendre que les éléments soient bien rendus
      await new Promise(resolve => setTimeout(resolve, 500));

      const captureResult = await captureUnified(customization);
      
      if (captureResult.front.mockupUrl || captureResult.back.mockupUrl || 
          captureResult.front.hdUrl || captureResult.back.hdUrl) {
        
        console.log('🎉 [HDCaptureOnAddToCart] Capture réussie:', captureResult);
        
        return enrichCustomizationWithCaptures(customization, captureResult);
      } else {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucun fichier généré - éléments DOM manquants');
        return customization;
      }
    } catch (error) {
      console.error('❌ [HDCaptureOnAddToCart] Erreur:', error);
      return customization;
    }
  }, [captureUnified]);

  return {
    captureForProduction,
    isCapturing
  };
};
