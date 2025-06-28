
import logger from '@/utils/logger';
import html2canvas from 'html2canvas';
import axios from 'axios';

interface ProductionCaptureResult {
  frontUrl?: string;
  backUrl?: string;
}

class ProductionCaptureService {
  private async uploadToMedia(blob: Blob, filename: string): Promise<string | null> {
    try {
      const file = new File([blob], filename, { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('https://media.winshirt.fr/upload-visuel.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 45000, // Timeout plus long pour les fichiers HD
      });
      
      return response.data?.url || null;
    } catch (error) {
      console.error('❌ [ProductionCapture] Upload error:', error);
      return null;
    }
  }

  private async waitForElement(elementId: string, maxAttempts: number = 20): Promise<HTMLElement | null> {
    for (let i = 0; i < maxAttempts; i++) {
      const element = document.getElementById(elementId);
      if (element) {
        const hasContent = element.children.length > 0 || element.textContent?.trim();
        const isVisible = element.offsetWidth > 0 && element.offsetHeight > 0;

        if (hasContent && isVisible) {
          logger.log(`✅ [ProductionCapture] Element ${elementId} ready (attempt ${i + 1})`);
          return element;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.warn(`❌ [ProductionCapture] Element ${elementId} not found after ${maxAttempts} attempts`);
    return null;
  }

  private async captureHDElement(elementId: string): Promise<string | null> {
    logger.log(`🎯 [ProductionCapture] Starting HD capture for ${elementId}`);

    const element = await this.waitForElement(elementId);
    if (!element) {
      console.error(`❌ [ProductionCapture] Element missing: ${elementId}`);
      return null;
    }

    try {
      // Attendre un peu pour s'assurer que le rendu est complet
      await new Promise(resolve => setTimeout(resolve, 500));

      // Paramètres optimisés pour la production HD 4K
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: null, // Fond transparent
        width: 4000,  // 4K width
        height: 4000, // 4K height
        scale: 1,
        allowTaint: false,
        foreignObjectRendering: false,
        logging: false,
        imageTimeout: 15000,
        removeContainer: false,
        // Ignorer les éléments de fond du t-shirt
        ignoreElements: (element) => {
          const imgElement = element as HTMLImageElement;
          return element.tagName === 'IMG' && imgElement.alt?.includes('T-shirt');
        }
      });

      // Convertir en PNG avec qualité maximum
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0)
      );

      const timestamp = Date.now();
      const filename = `production-hd-${elementId}-${timestamp}.png`;
      const uploadUrl = await this.uploadToMedia(blob, filename);

      if (uploadUrl) {
        logger.log(`✅ [ProductionCapture] HD capture successful: ${filename} -> ${uploadUrl}`);
      } else {
        console.error(`❌ [ProductionCapture] Upload failed for ${filename}`);
      }

      return uploadUrl;
    } catch (error) {
      console.error(`❌ [ProductionCapture] Capture error for ${elementId}:`, error);
      return null;
    }
  }

  async captureForProduction(customization: any): Promise<ProductionCaptureResult> {
    logger.log('🚀 [ProductionCapture] Starting HD production capture');
    logger.log('📋 [ProductionCapture] Customization data:', customization);

    const results: ProductionCaptureResult = {};

    // Vérifier le contenu sur chaque côté
    const hasFrontContent = customization?.frontDesign || customization?.frontText;
    const hasBackContent = customization?.backDesign || customization?.backText;

    logger.log(`📊 [ProductionCapture] Content check - Front: ${!!hasFrontContent}, Back: ${!!hasBackContent}`);

    // Capturer le front si il y a du contenu
    if (hasFrontContent) {
      logger.log('📸 [ProductionCapture] Capturing front side...');
      results.frontUrl = await this.captureHDElement('production-front-only');
    }

    // Capturer le back si il y a du contenu
    if (hasBackContent) {
      logger.log('📸 [ProductionCapture] Capturing back side...');
      results.backUrl = await this.captureHDElement('production-back-only');
    }

    logger.log('🎉 [ProductionCapture] Production capture completed:', results);
    return results;
  }
}

export const productionCaptureService = new ProductionCaptureService();
