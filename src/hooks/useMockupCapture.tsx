
import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';

interface MockupCaptureResult {
  rectoUrl?: string;
  versoUrl?: string;
}

export const useMockupCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureElement = async (elementId: string, side: 'recto' | 'verso'): Promise<string | null> => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Élément ${elementId} introuvable pour capture ${side}`);
      return null;
    }

    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
        width: 600,
        height: 600
      });
      
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.9)
      );
      
      const file = new File([blob], `${side}-${Date.now()}.png`, { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('https://winshirt.fr/upload-visuel.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data?.url) {
        console.log(`Capture ${side} réussie:`, response.data.url);
        return response.data.url;
      }
      
      return null;
    } catch (error) {
      console.error(`Erreur capture ${side}:`, error);
      return null;
    }
  };

  const captureAllMockups = useCallback(async (): Promise<MockupCaptureResult> => {
    setIsCapturing(true);
    
    try {
      const captures = await Promise.allSettled([
        captureElement('mockup-recto', 'recto'),
        captureElement('mockup-verso', 'verso')
      ]);

      const result: MockupCaptureResult = {};
      
      if (captures[0].status === 'fulfilled' && captures[0].value) {
        result.rectoUrl = captures[0].value;
      }
      
      if (captures[1].status === 'fulfilled' && captures[1].value) {
        result.versoUrl = captures[1].value;
      }

      return result;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  return {
    captureAllMockups,
    captureElement,
    isCapturing
  };
};
