
import logger from '@/utils/logger';

import { useCallback } from 'react';
import { useProductionGeneration } from './useProductionGeneration';
import { enrichCustomizationWithProductionFiles, validateUnifiedCustomization } from '@/services/unifiedCapture.service';

export const useHDCaptureOnAddToCart = () => {
  const { generateProductionFiles, isGenerating } = useProductionGeneration();

  const captureForProduction = useCallback(async (customization: any): Promise<any> => {
    try {
      logger.log('🎬 [HDCaptureOnAddToCart] Début capture pour production');
      logger.log('📋 [HDCaptureOnAddToCart] Données reçues:', customization);
      
      // Valider la personnalisation
      if (!validateUnifiedCustomization(customization)) {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucune personnalisation valide détectée');
        return customization;
      }

      logger.log('✅ [HDCaptureOnAddToCart] Personnalisation valide, lancement génération...');

      // Préparer les URLs de mockup
      const mockupUrls = {
        front: undefined, // À adapter selon vos besoins
        back: undefined   // À adapter selon vos besoins
      };
      
      const productInfo = {
        name: 'Produit personnalisé',
        id: 'temp-id'
      };

      logger.log('🚀 [HDCaptureOnAddToCart] Démarrage de la génération de production...');
      const productionFiles = await generateProductionFiles(customization, mockupUrls, productInfo);
      
      logger.log('📤 [HDCaptureOnAddToCart] Résultat génération:', productionFiles);

      // Vérifier si au moins un fichier a été généré
      const hasAnyFile = 
        productionFiles.front.mockupUrl || productionFiles.back.mockupUrl || 
        productionFiles.front.hdUrl || productionFiles.back.hdUrl;
      
      if (hasAnyFile) {
        logger.log('🎉 [HDCaptureOnAddToCart] Au moins un fichier généré');
        
        const enrichedCustomization = enrichCustomizationWithProductionFiles(customization, productionFiles);
        logger.log('📦 [HDCaptureOnAddToCart] Customization enrichie:', enrichedCustomization);
        
        return enrichedCustomization;
      } else {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucun fichier généré');
        return customization;
      }
    } catch (error) {
      console.error('❌ [HDCaptureOnAddToCart] Erreur durant la génération:', error);
      // En cas d'erreur, retourner la customization originale sans bloquer l'ajout au panier
      return customization;
    }
  }, [generateProductionFiles]);

  return {
    captureForProduction,
    isCapturing: isGenerating
  };
};
