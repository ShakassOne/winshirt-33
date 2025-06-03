
import { useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';

interface MockupCaptureResult {
  rectoUrl?: string;
  versoUrl?: string;
}

interface HDCaptureResult {
  hdRectoUrl?: string;
  hdVersoUrl?: string;
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

  const captureHDVisual = async (elementId: string, side: 'recto' | 'verso'): Promise<string | null> => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Élément ${elementId} introuvable pour capture HD ${side}`);
      return null;
    }

    try {
      console.log(`🎯 [HDCapture] Début capture HD ${side} de l'élément:`, elementId);
      
      // Capture en très haute résolution pour l'impression DTF
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: null, // Fond transparent
        scale: 1,
        width: 3000, // Résolution HD adaptée DTF
        height: 4000,
        allowTaint: true,
        foreignObjectRendering: true,
        logging: false
      });
      
      console.log(`✅ [HDCapture] Canvas créé - Taille: ${canvas.width}x${canvas.height}`);
      
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0) // Qualité maximale
      );
      
      const file = new File([blob], `hd-${side}-${Date.now()}.png`, { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', file);

      console.log(`📤 [HDCapture] Upload fichier HD ${side} - Taille: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);

      const response = await axios.post('https://winshirt.fr/upload-visuel.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data?.url) {
        console.log(`🎉 [HDCapture] Capture HD ${side} réussie:`, response.data.url);
        return response.data.url;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ [HDCapture] Erreur capture HD ${side}:`, error);
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

  const captureAllHDVisuals = useCallback(async (): Promise<HDCaptureResult> => {
    setIsCapturing(true);
    
    try {
      console.log('🚀 [HDCapture] Début capture HD de tous les visuels');
      
      // Capturer les éléments de personnalisation sans le produit
      // On cible les conteneurs de personnalisation plutôt que les mockups complets
      const captures = await Promise.allSettled([
        captureHDVisual('customization-recto', 'recto'),
        captureHDVisual('customization-verso', 'verso')
      ]);

      const result: HDCaptureResult = {};
      
      if (captures[0].status === 'fulfilled' && captures[0].value) {
        result.hdRectoUrl = captures[0].value;
        console.log('✅ [HDCapture] HD Recto URL:', captures[0].value);
      }
      
      if (captures[1].status === 'fulfilled' && captures[1].value) {
        result.hdVersoUrl = captures[1].value;
        console.log('✅ [HDCapture] HD Verso URL:', captures[1].value);
      }

      console.log('🎯 [HDCapture] Capture HD terminée:', result);
      return result;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  return {
    captureAllMockups,
    captureAllHDVisuals,
    captureElement,
    captureHDVisual,
    isCapturing
  };
};
