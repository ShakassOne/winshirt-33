
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
      
      toast({
        title: "Génération des fichiers de production...",
        description: "Création des visuels haute résolution",
      });

      const hdResult = await captureAllHDVisuals();
      
      if (hdResult.hdRectoUrl || hdResult.hdVersoUrl) {
        console.log('🎉 [HDCaptureOnAddToCart] Capture HD réussie:', hdResult);
        
        toast({
          title: "Fichiers de production créés",
          description: "Les visuels haute résolution sont prêts",
        });
        
        return hdResult;
      } else {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucun fichier HD généré');
        
        toast({
          variant: "destructive",
          title: "Erreur de génération",
          description: "Impossible de créer les fichiers de production",
        });
        
        return {};
      }
    } catch (error) {
      console.error('❌ [HDCaptureOnAddToCart] Erreur:', error);
      
      toast({
        variant: "destructive",
        title: "Erreur de capture",
        description: "Impossible de générer les fichiers HD",
      });
      
      return {};
    }
  }, [captureAllHDVisuals]);

  return {
    captureForProduction,
    isCapturing
  };
};
