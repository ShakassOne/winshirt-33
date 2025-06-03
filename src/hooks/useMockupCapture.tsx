
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
      
      // Attendre un moment pour que l'élément soit bien rendu
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

      // Gestion d'erreur avec retry mais timeout plus court
      let uploadAttempts = 0;
      const maxAttempts = 2; // Réduire le nombre de tentatives
      
      while (uploadAttempts < maxAttempts) {
        try {
          const response = await axios.post('https://winshirt.fr/upload-visuel.php', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 10000, // Timeout réduit à 10 secondes
          });
          
          if (response.data?.url) {
            console.log(`🎉 [HDCapture] Capture HD ${side} réussie:`, response.data.url);
            return response.data.url;
          }
          break;
        } catch (uploadError) {
          uploadAttempts++;
          console.warn(`⚠️ [HDCapture] Tentative ${uploadAttempts}/${maxAttempts} échouée pour ${side}:`, uploadError);
          
          if (uploadAttempts < maxAttempts) {
            // Attendre moins longtemps avant de retenter
            await new Promise(resolve => setTimeout(resolve, 500 * uploadAttempts));
          } else {
            // Ne pas lever l'erreur, juste logger
            console.error(`❌ [HDCapture] Échec définitif upload HD ${side} après ${maxAttempts} tentatives`);
          }
        }
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
      
      // Vérifier que les éléments existent avant de capturer
      const rectoElement = document.getElementById('customization-recto');
      const versoElement = document.getElementById('customization-verso');
      
      if (!rectoElement && !versoElement) {
        console.warn('⚠️ [HDCapture] Aucun élément de personnalisation trouvé');
        return {};
      }
      
      // Capturer les éléments de personnalisation sans le produit avec timeout
      const capturePromises = [
        rectoElement ? captureHDVisual('customization-recto', 'recto') : Promise.resolve(null),
        versoElement ? captureHDVisual('customization-verso', 'verso') : Promise.resolve(null)
      ];
      
      // Ajouter un timeout global pour éviter de bloquer trop longtemps
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout capture HD')), 30000)
      );
      
      const captures = await Promise.race([
        Promise.allSettled(capturePromises),
        timeoutPromise
      ]) as PromiseSettledResult<string | null>[];

      const result: HDCaptureResult = {};
      
      if (captures[0]?.status === 'fulfilled' && captures[0].value) {
        result.hdRectoUrl = captures[0].value;
        console.log('✅ [HDCapture] HD Recto URL:', captures[0].value);
      }
      
      if (captures[1]?.status === 'fulfilled' && captures[1].value) {
        result.hdVersoUrl = captures[1].value;
        console.log('✅ [HDCapture] HD Verso URL:', captures[1].value);
      }

      console.log('🎯 [HDCapture] Capture HD terminée:', result);
      return result;
    } catch (error) {
      console.error('❌ [HDCapture] Erreur globale capture HD:', error);
      return {};
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
