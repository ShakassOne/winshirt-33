
import logger from '@/utils/logger';

import { useCallback } from 'react';
import { useProductionCapture } from './useProductionCapture';
import { enrichCustomizationWithProductionFiles, validateUnifiedCustomization } from '@/services/unifiedCapture.service';

export const useHDCaptureOnAddToCart = () => {
  const { captureForProduction, isCapturing } = useProductionCapture();

  const captureForProductionCart = useCallback(async (customization: any): Promise<any> => {
    try {
      logger.log('🎬 [HDCaptureOnAddToCart] Début capture optimisée pour production');
      logger.log('📋 [HDCaptureOnAddToCart] Données reçues:', customization);
      
      // Valider la personnalisation
      if (!validateUnifiedCustomization(customization)) {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucune personnalisation valide détectée');
        return customization;
      }

      logger.log('✅ [HDCaptureOnAddToCart] Personnalisation valide, lancement capture optimisée...');

      // Utiliser le service de capture optimisé
      const productionFiles = await captureForProduction(customization);
      
      logger.log('📤 [HDCaptureOnAddToCart] Résultat capture optimisée:', productionFiles);

      // Vérifier si au moins un fichier a été généré
      const hasAnyFile = productionFiles.frontUrl || productionFiles.backUrl;
      
      if (hasAnyFile) {
        logger.log('🎉 [HDCaptureOnAddToCart] Au moins un fichier HD généré');
        
        // Enrichir la customization avec les nouvelles URLs
        const enrichedCustomization = {
          ...customization,
          visual_front_url: productionFiles.frontUrl || customization.visual_front_url,
          visual_back_url: productionFiles.backUrl || customization.visual_back_url,
          // Garder les URLs existantes pour compatibilité
          hdRectoUrl: productionFiles.frontUrl || customization.hdRectoUrl,
          hdVersoUrl: productionFiles.backUrl || customization.hdVersoUrl
        };
        
        logger.log('📦 [HDCaptureOnAddToCart] Customization enrichie:', enrichedCustomization);
        
        return enrichedCustomization;
      } else {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucun fichier généré');
        return customization;
      }
    } catch (error) {
      console.error('❌ [HDCaptureOnAddToCart] Erreur durant la capture optimisée:', error);
      // En cas d'erreur, retourner la customization originale sans bloquer l'ajout au panier
      return customization;
    }
  }, [captureForProduction]);

  return {
    captureForProduction: captureForProductionCart,
    isCapturing
  };
};
