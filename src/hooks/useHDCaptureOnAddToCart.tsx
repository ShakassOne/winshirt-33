
import { useCallback } from 'react';
import { useUnifiedCapture } from './useUnifiedCapture';
import { toast } from '@/components/ui/use-toast';
import { enrichCustomizationWithCaptures, validateUnifiedCustomization } from '@/services/unifiedCapture.service';

interface HDCaptureData {
  mockupRectoUrl?: string;
  mockupVersoUrl?: string;
  hdRectoUrl?: string;
  hdVersoUrl?: string;
}

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
        
        // Pas d'alerte utilisateur pour les problèmes techniques de production
        return customization;
      }
    } catch (error) {
      console.error('❌ [HDCaptureOnAddToCart] Erreur:', error);
      
      // Pas d'alerte utilisateur pour les erreurs techniques
      return customization;
    }
  }, [captureUnified]);

  return {
    captureForProduction,
    isCapturing
  };
};
