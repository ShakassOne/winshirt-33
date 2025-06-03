
import { useCallback } from 'react';
import { useMockupCapture } from './useMockupCapture';
import { toast } from '@/components/ui/use-toast';

interface HDCaptureData {
  hdRectoUrl?: string;
  hdVersoUrl?: string;
}

export const useHDCaptureOnAddToCart = () => {
  const { captureAllHDVisuals, isCapturing } = useMockupCapture();

  const captureForProduction = useCallback(async (): Promise<HDCaptureData> => {
    try {
      console.log('🎬 [HDCaptureOnAddToCart] Début capture pour production');
      
      // Ne pas bloquer avec un toast de loading
      const hdResult = await captureAllHDVisuals();
      
      if (hdResult.hdRectoUrl || hdResult.hdVersoUrl) {
        console.log('🎉 [HDCaptureOnAddToCart] Capture HD réussie:', hdResult);
        
        toast({
          title: "Fichiers de production créés",
          description: "Les visuels haute résolution sont prêts",
        });
        
        return hdResult;
      } else {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucun fichier HD généré, mais on continue');
        
        // Ne pas afficher d'erreur bloquante, juste un avertissement silencieux
        toast({
          title: "Produit ajouté au panier",
          description: "Les fichiers HD seront générés lors de la commande",
          variant: "default",
        });
        
        return {};
      }
    } catch (error) {
      console.error('❌ [HDCaptureOnAddToCart] Erreur capture HD (non bloquante):', error);
      
      // Erreur silencieuse - l'ajout au panier doit continuer
      toast({
        title: "Produit ajouté au panier",
        description: "Les fichiers HD seront générés lors de la commande",
        variant: "default",
      });
      
      return {};
    }
  }, [captureAllHDVisuals]);

  return {
    captureForProduction,
    isCapturing
  };
};
