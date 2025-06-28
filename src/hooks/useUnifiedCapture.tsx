
import logger from '@/utils/logger';

import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { productionCaptureService } from '@/services/productionCapture.service';

interface UnifiedCaptureResult {
  mockupUrl?: string;
  hdUrl?: string;
}

interface UnifiedCaptureAllResult {
  front: UnifiedCaptureResult;
  back: UnifiedCaptureResult;
}

export const useUnifiedCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const uploadImage = async (blob: Blob, filename: string): Promise<string | null> => {
    try {
      const file = new File([blob], filename, { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('https://media.winshirt.fr/upload-visuel.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      
      return response.data?.url || null;
    } catch (error) {
      console.error('Erreur upload:', error);
      return null;
    }
  };

  const waitForElement = async (
    elementId: string,
    maxAttempts: number = 15
  ): Promise<HTMLElement | null> => {
    for (let i = 0; i < maxAttempts; i++) {
      const element = document.getElementById(elementId);
      if (element) {
        const hasContent =
          element.children.length > 0 || element.textContent?.trim();
        const isVisible = element.offsetWidth > 0 && element.offsetHeight > 0;

        if (hasContent && isVisible) {
          logger.log(
            `✅ [UnifiedCapture] Élément ${elementId} trouvé et prêt à la tentative ${i + 1}`
          );
          return element;
        }

        logger.log(
          `🚧 [UnifiedCapture] ${elementId} trouvé mais pas prêt (tentative ${i +
            1})`
        );
      } else {
        logger.log(
          `⏳ [UnifiedCapture] Tentative ${i + 1}/${maxAttempts} pour ${elementId} - non trouvé`
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    console.warn(
      `❌ [UnifiedCapture] Élément ${elementId} non trouvé après ${maxAttempts} tentatives`
    );
    return null;
  };

  const captureElement = async (elementId: string, isHD: boolean = false): Promise<string | null> => {
    logger.log(`🔍 [UnifiedCapture] Recherche de l'élément ${elementId}...`);

    const element = await waitForElement(elementId);
    if (!element) {
      console.error(`❌ [UnifiedCapture] Élément manquant: ${elementId}`);
      return null;
    }

    try {
      logger.log(`📸 [UnifiedCapture] Capture de ${elementId} (HD: ${isHD})`);

      // Attendre un peu pour s'assurer que le rendu est complet
      await new Promise(resolve => setTimeout(resolve, 200));

      if (!document.contains(element)) {
        console.error(`❌ [UnifiedCapture] Élément ${elementId} a disparu avant la capture`);
        return null;
      }

      const childCount = element.children.length;
      const width = (element as HTMLElement).offsetWidth;
      const height = (element as HTMLElement).offsetHeight;
      logger.log(
        `[UnifiedCapture DEBUG] DOM final pour ${elementId} - enfants: ${childCount}, taille: ${width}x${height}`
      );

      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: isHD ? 'transparent' : '#ffffff',
        // Paramètres optimisés selon le type de capture
        width: isHD ? 4000 : 400,
        height: isHD ? 4000 : 500,
        scale: 1,
        allowTaint: false,
        foreignObjectRendering: false,
        logging: false,
        imageTimeout: 10000,
        removeContainer: false
      });
      
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.95)
      );
      
      const timestamp = Date.now();
      const filename = `${isHD ? 'hd' : 'mockup'}-${elementId}-${timestamp}.png`;
      const uploadUrl = await uploadImage(blob, filename);
      
      if (uploadUrl) {
        logger.log(`✅ [UnifiedCapture] Upload réussi: ${filename} -> ${uploadUrl}`);
        logger.log(`🎯 [UnifiedCapture] Capture terminée pour ${elementId}`);
      } else {
        console.error(`❌ [UnifiedCapture] Échec upload pour ${filename}`);
      }
      
      return uploadUrl;
    } catch (error) {
      console.error(`❌ [UnifiedCapture] Erreur capture ${elementId}:`, error);
      return null;
    }
  };

  const captureUnified = useCallback(async (customization: any): Promise<UnifiedCaptureAllResult> => {
    setIsCapturing(true);

    try {
      logger.log('🎬 [UnifiedCapture] Début capture unifiée');
      logger.log('📋 [UnifiedCapture] Customization:', customization);

      const results: UnifiedCaptureAllResult = {
        front: {},
        back: {}
      };

      // Vérifier s'il existe du contenu sur chaque côté
      const hasFrontContent = customization?.frontDesign || customization?.frontText;
      const hasBackContent = customization?.backDesign || customization?.backText;

      logger.log(`📊 [UnifiedCapture] Contenu - Front: ${!!hasFrontContent}, Back: ${!!hasBackContent}`);

      // Capturer les mockups (preview avec fond)
      logger.log('📸 [UnifiedCapture] Capture mockups en cours...');
      const [mockupFront, mockupBack] = await Promise.allSettled([
        captureElement('preview-front-complete', false),
        captureElement('preview-back-complete', false)
      ]);

      if (mockupFront.status === 'fulfilled' && mockupFront.value) {
        results.front.mockupUrl = mockupFront.value;
        logger.log('✅ [UnifiedCapture] Mockup front capturé:', mockupFront.value);
      }
      if (mockupBack.status === 'fulfilled' && mockupBack.value) {
        results.back.mockupUrl = mockupBack.value;
        logger.log('✅ [UnifiedCapture] Mockup back capturé:', mockupBack.value);
      }

      // Utiliser le service de production optimisé pour les fichiers HD
      logger.log('🚀 [UnifiedCapture] Utilisation du service de production optimisé...');
      const productionFiles = await productionCaptureService.captureForProduction(customization);
      
      if (productionFiles.frontUrl) {
        results.front.hdUrl = productionFiles.frontUrl;
        logger.log('✅ [UnifiedCapture] Production front capturé:', productionFiles.frontUrl);
      }
      if (productionFiles.backUrl) {
        results.back.hdUrl = productionFiles.backUrl;
        logger.log('✅ [UnifiedCapture] Production back capturé:', productionFiles.backUrl);
      }

      logger.log('🎉 [UnifiedCapture] Capture terminée:', results);
      return results;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  return {
    captureUnified,
    isCapturing
  };
};
