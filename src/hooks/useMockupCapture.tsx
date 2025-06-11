
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

      const response = await axios.post('https://media.winshirt.fr/upload-visuel.php', formData, {
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
      
      // Vérifier que l'élément a du contenu
      const hasContent = element.children.length > 0 || element.textContent?.trim() || element.innerHTML.includes('svg') || element.innerHTML.includes('img');
      if (!hasContent) {
        console.warn(`⚠️ [HDCapture] Élément ${elementId} semble vide, pas de capture`);
        return null;
      }
      
      // Attendre un moment pour que l'élément soit bien rendu
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Configuration optimisée pour éviter document.write
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: 'transparent',
        scale: 1,
        width: 2400, // Résolution HD adaptée DTF
        height: 3200,
        allowTaint: false,
        foreignObjectRendering: false,
        logging: false,
        imageTimeout: 5000,
        removeContainer: true
      });
      
      console.log(`✅ [HDCapture] Canvas créé - Taille: ${canvas.width}x${canvas.height}`);
      
      const blob = await new Promise<Blob>((resolve) => 
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.95)
      );
      
      const file = new File([blob], `hd-${side}-${Date.now()}.png`, { type: 'image/png' });
      const formData = new FormData();
      formData.append('image', file);

      console.log(`📤 [HDCapture] Upload fichier HD ${side} - Taille: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);

      // Upload avec timeout réduit et gestion d'erreur simplifiée
      const response = await axios.post('https://media.winshirt.fr/upload-visuel.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 15000,
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
      
      // Rechercher dynamiquement les éléments de personnalisation
      const rectoElement = document.getElementById('customization-recto') || 
                          document.querySelector('[data-side="front"]') ||
                          document.querySelector('.customization-front');
      
      const versoElement = document.getElementById('customization-verso') || 
                          document.querySelector('[data-side="back"]') ||
                          document.querySelector('.customization-back');
      
      if (!rectoElement && !versoElement) {
        console.warn('⚠️ [HDCapture] Aucun élément de personnalisation trouvé');
        return {};
      }
      
      const captures = await Promise.allSettled([
        rectoElement ? captureHDVisual(rectoElement.id || 'customization-recto', 'recto') : Promise.resolve(null),
        versoElement ? captureHDVisual(versoElement.id || 'customization-verso', 'verso') : Promise.resolve(null)
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
