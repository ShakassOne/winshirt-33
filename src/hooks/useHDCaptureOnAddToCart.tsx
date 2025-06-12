
import { useCallback } from 'react';
import { useUnifiedCapture } from './useUnifiedCapture';
import { enrichCustomizationWithCaptures, validateUnifiedCustomization } from '@/services/unifiedCapture.service';

export const useHDCaptureOnAddToCart = () => {
  const { captureUnified, isCapturing } = useUnifiedCapture();

  const captureForProduction = useCallback(async (customization: any): Promise<any> => {
    try {
      console.log('🎬 [HDCaptureOnAddToCart] Début capture pour production');
      console.log('📋 [HDCaptureOnAddToCart] Données reçues:', customization);
      
      // Valider la personnalisation
      if (!validateUnifiedCustomization(customization)) {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucune personnalisation valide détectée');
        return customization;
      }

      console.log('✅ [HDCaptureOnAddToCart] Personnalisation valide, lancement capture...');

      // Attendre que les éléments soient bien rendus dans le DOM
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('🚀 [HDCaptureOnAddToCart] Démarrage de la capture unifiée...');
      const captureResult = await captureUnified(customization);
      
      console.log('📤 [HDCaptureOnAddToCart] Résultat capture:', captureResult);

      // Vérifier si au moins une capture a réussi
      const hasAnyCapture = 
        captureResult.front.mockupUrl || captureResult.back.mockupUrl || 
        captureResult.front.hdUrl || captureResult.back.hdUrl;
      
      if (hasAnyCapture) {
        console.log('🎉 [HDCaptureOnAddToCart] Au moins une capture réussie');
        
        const enrichedCustomization = enrichCustomizationWithCaptures(customization, captureResult);
        console.log('📦 [HDCaptureOnAddToCart] Customization enrichie:', enrichedCustomization);
        
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
