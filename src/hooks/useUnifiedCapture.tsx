
import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';

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

  const waitForElement = async (elementId: string, maxAttempts: number = 15): Promise<HTMLElement | null> => {
    for (let i = 0; i < maxAttempts; i++) {
      const element = document.getElementById(elementId);
      if (element) {
        // Vérifier que l'élément a du contenu et est visible
        const hasContent = element.children.length > 0 || element.textContent?.trim();
        const isVisible = element.offsetWidth > 0 && element.offsetHeight > 0;
        
        if (hasContent && isVisible) {
          console.log(`✅ [UnifiedCapture] Élément ${elementId} trouvé et prêt à la tentative ${i + 1}`);
          return element;
        }
      }
      console.log(`⏳ [UnifiedCapture] Tentative ${i + 1}/${maxAttempts} pour ${elementId}`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    console.warn(`❌ [UnifiedCapture] Élément ${elementId} non trouvé après ${maxAttempts} tentatives`);
    return null;
  };

  const captureElement = async (elementId: string, isHD: boolean = false): Promise<string | null> => {
    console.log(`🔍 [UnifiedCapture] Recherche de l'élément ${elementId}...`);
    
    const element = await waitForElement(elementId);
    if (!element) {
      return null;
    }

    try {
      console.log(`📸 [UnifiedCapture] Capture de ${elementId} (HD: ${isHD})`);
      
      // Attendre un peu pour s'assurer que le rendu est complet
      await new Promise(resolve => setTimeout(resolve, 200));

      // DEBUG CAPTURE
      console.log("[UnifiedCapture DEBUG] ID demandé :", elementId);
      console.log("[UnifiedCapture DEBUG] Elément trouvé :", element);
      if (element) {
        console.log(
          "[UnifiedCapture DEBUG] Taille élément :",
          (element as HTMLElement).offsetWidth,
          "x",
          (element as HTMLElement).offsetHeight
        );
        // Ajoute un contour rouge temporaire pendant 2s pour voir la div
        const oldOutline = (element as HTMLElement).style.outline;
        (element as HTMLElement).style.outline = "4px solid red";
        setTimeout(() => {
          (element as HTMLElement).style.outline = oldOutline || "";
        }, 2000);
      } else {
        console.warn("[UnifiedCapture DEBUG] Élément DOM NON TROUVÉ pour l’ID demandé !");
      }
      console.log("[UnifiedCapture DEBUG] html2canvas va être appelé avec isHD =", isHD);

      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: isHD ? 'transparent' : '#ffffff',
        scale: isHD ? 2 : 1,
        width: isHD ? 800 : 400,
        height: isHD ? 1000 : 500,
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
        console.log(`✅ [UnifiedCapture] Upload réussi: ${filename} -> ${uploadUrl}`);
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
      console.log('🎬 [UnifiedCapture] Début capture unifiée');
      console.log('📋 [UnifiedCapture] Customization:', customization);

      const results: UnifiedCaptureAllResult = {
        front: {},
        back: {}
      };

      // Analyser le contenu disponible
      const hasFrontContent = customization?.frontDesign || customization?.frontText;
      const hasBackContent = customization?.backDesign || customization?.backText;

      console.log(`📊 [UnifiedCapture] Contenu - Front: ${!!hasFrontContent}, Back: ${!!hasBackContent}`);

      // Capturer le front si du contenu existe
      if (hasFrontContent) {
        console.log('📸 [UnifiedCapture] Capture front en cours...');
        
        const [mockupFront, hdFront] = await Promise.allSettled([
          captureElement('preview-front-complete', false),
          captureElement('production-front-only', true)
        ]);

        if (mockupFront.status === 'fulfilled' && mockupFront.value) {
          results.front.mockupUrl = mockupFront.value;
          console.log('✅ [UnifiedCapture] Mockup front capturé:', mockupFront.value);
        }
        if (hdFront.status === 'fulfilled' && hdFront.value) {
          results.front.hdUrl = hdFront.value;
          console.log('✅ [UnifiedCapture] HD front capturé:', hdFront.value);
        }
      }

      // Capturer le back si du contenu existe
      if (hasBackContent) {
        console.log('📸 [UnifiedCapture] Capture back en cours...');
        
        const [mockupBack, hdBack] = await Promise.allSettled([
          captureElement('preview-back-complete', false),
          captureElement('production-back-only', true)
        ]);

        if (mockupBack.status === 'fulfilled' && mockupBack.value) {
          results.back.mockupUrl = mockupBack.value;
          console.log('✅ [UnifiedCapture] Mockup back capturé:', mockupBack.value);
        }
        if (hdBack.status === 'fulfilled' && hdBack.value) {
          results.back.hdUrl = hdBack.value;
          console.log('✅ [UnifiedCapture] HD back capturé:', hdBack.value);
        }
      }

      console.log('🎉 [UnifiedCapture] Capture terminée:', results);
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
