import logger from '@/utils/logger';

import { useCallback } from 'react';
import { useUnifiedCapture } from './useUnifiedCapture';
import { enrichCustomizationWithCaptures, validateUnifiedCustomization } from '@/services/unifiedCapture.service';

export const useHDCaptureOnAddToCart = () => {
  const { captureUnified, isCapturing } = useUnifiedCapture();

  const captureForProduction = useCallback(async (customization: any): Promise<any> => {
    try {
      logger.log('🎬 [HDCaptureOnAddToCart] Début capture pour production');
      logger.log('📋 [HDCaptureOnAddToCart] Données reçues:', customization);
      
      // Valider la personnalisation
      if (!validateUnifiedCustomization(customization)) {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucune personnalisation valide détectée');
        return customization;
      }

      logger.log('✅ [HDCaptureOnAddToCart] Personnalisation valide, lancement capture...');

      // Attendre que les éléments soient bien rendus dans le DOM
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.log('🚀 [HDCaptureOnAddToCart] Démarrage de la capture unifiée...');
      const captureResult = await captureUnified(customization);
      
      logger.log('📤 [HDCaptureOnAddToCart] Résultat capture:', captureResult);

      // Vérifier si au moins une capture a réussi
      const hasAnyCapture = 
        captureResult.front.mockupUrl || captureResult.back.mockupUrl || 
        captureResult.front.hdUrl || captureResult.back.hdUrl;
      
      if (hasAnyCapture) {
        logger.log('🎉 [HDCaptureOnAddToCart] Au moins une capture réussie');
        
        const enrichedCustomization = enrichCustomizationWithCaptures(customization, captureResult);
        logger.log('📦 [HDCaptureOnAddToCart] Customization enrichie:', enrichedCustomization);
        
        return enrichedCustomization;
      } else {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucune capture générée - problème de rendu DOM');
        return customization;
      }
    } catch (error) {
      console.error('❌ [HDCaptureOnAddToCart] Erreur durant la capture:', error);
      // En cas d'erreur, retourner la customization originale sans bloquer l'ajout au panier
      return customization;
    }
  }, [captureUnified]);

  return {
    captureForProduction,
    isCapturing
  };
};
