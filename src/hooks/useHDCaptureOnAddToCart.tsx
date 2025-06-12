
import { useCallback } from 'react';
import { useUnifiedCapture } from './useUnifiedCapture';
import { toast } from '@/components/ui/use-toast';
import { enrichCustomizationWithCaptures, validateUnifiedCustomization } from '@/services/unifiedCapture.service';

interface HDCaptureData {
  mockupRectoUrl?: string;
  mockupVersoUrl?: string;
  hdRectoUrl?: string;
  hdVersoUrl?: string;
}

export const useHDCaptureOnAddToCart = () => {
  const { captureUnified, isCapturing } = useUnifiedCapture();

  const captureForProduction = useCallback(async (customization: any): Promise<any> => {
    try {
      console.log('🎬 [HDCaptureOnAddToCart] Début capture pour production');
      
      // Valider la personnalisation
      if (!validateUnifiedCustomization(customization)) {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucune personnalisation valide');
        return customization;
      }
      
      toast({
        title: "Génération des fichiers de production...",
        description: "Création des visuels haute résolution",
      });

      // Attendre que les éléments soient bien rendus
      await new Promise(resolve => setTimeout(resolve, 500));

      const captureResult = await captureUnified(customization);
      
      if (captureResult.front.mockupUrl || captureResult.back.mockupUrl || 
          captureResult.front.hdUrl || captureResult.back.hdUrl) {
        
        console.log('🎉 [HDCaptureOnAddToCart] Capture réussie:', captureResult);
        
        const hasFiles = [
          captureResult.front.mockupUrl && 'Mockup Recto',
          captureResult.back.mockupUrl && 'Mockup Verso',
          captureResult.front.hdUrl && 'HD Recto',
          captureResult.back.hdUrl && 'HD Verso'
        ].filter(Boolean).join(', ');
        
        toast({
          title: "Fichiers de production créés",
          description: `Générés: ${hasFiles}`,
        });
        
        return enrichCustomizationWithCaptures(customization, captureResult);
      } else {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucun fichier généré');
        
        toast({
          variant: "default",
          title: "Aucune capture générée",
          description: "Le produit sera ajouté sans fichiers de production",
        });
        
        return customization;
      }
    } catch (error) {
      console.error('❌ [HDCaptureOnAddToCart] Erreur:', error);
      
      toast({
        variant: "destructive",
        title: "Erreur de capture",
        description: "Le produit sera ajouté sans fichiers de production",
      });
      
      return customization;
    }
  }, [captureUnified]);

  return {
    captureForProduction,
    isCapturing
  };
};
