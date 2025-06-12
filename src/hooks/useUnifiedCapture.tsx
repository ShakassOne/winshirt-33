
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
        timeout: 15000,
      });
      
      return response.data?.url || null;
    } catch (error) {
      console.error('Erreur upload:', error);
      return null;
    }
  };

  const captureElement = async (elementId: string, isHD: boolean = false): Promise<string | null> => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Élément ${elementId} introuvable`);
      return null;
    }

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: isHD ? 'transparent' : null,
        scale: isHD ? 1 : 2,
        width: isHD ? 2400 : 600,
        height: isHD ? 3200 : 600,
        allowTaint: false,
        foreignObjectRendering: false,
        logging: false,
        imageTimeout: 5000,
      });
      
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.9)
      );
      
      const filename = `${isHD ? 'hd' : 'mockup'}-${elementId}-${Date.now()}.png`;
      return await uploadImage(blob, filename);
    } catch (error) {
      console.error(`Erreur capture ${elementId}:`, error);
      return null;
    }
  };

  const captureUnified = useCallback(async (customization: any): Promise<UnifiedCaptureAllResult> => {
    setIsCapturing(true);

    try {
      console.log('🎬 [UnifiedCapture] Début capture unifiée');

      const results: UnifiedCaptureAllResult = {
        front: {},
        back: {}
      };

      // Capturer le front
      const hasFrontContent = customization.frontDesign || customization.frontText;
      if (hasFrontContent) {
        const [mockupFront, hdFront] = await Promise.allSettled([
          captureElement('mockup-front', false),
          captureElement('production-front', true)
        ]);

        if (mockupFront.status === 'fulfilled' && mockupFront.value) {
          results.front.mockupUrl = mockupFront.value;
        }
        if (hdFront.status === 'fulfilled' && hdFront.value) {
          results.front.hdUrl = hdFront.value;
        }
      }

      // Capturer le back
      const hasBackContent = customization.backDesign || customization.backText;
      if (hasBackContent) {
        const [mockupBack, hdBack] = await Promise.allSettled([
          captureElement('mockup-back', false),
          captureElement('production-back', true)
        ]);

        if (mockupBack.status === 'fulfilled' && mockupBack.value) {
          results.back.mockupUrl = mockupBack.value;
        }
        if (hdBack.status === 'fulfilled' && hdBack.value) {
          results.back.hdUrl = hdBack.value;
        }
      }

      console.log('✅ [UnifiedCapture] Capture terminée:', results);
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
