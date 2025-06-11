
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

      // Attendre que les éléments soient bien rendus
      await new Promise(resolve => setTimeout(resolve, 500));

      const hdResult = await captureAllHDVisuals();
      
      if (hdResult.hdRectoUrl || hdResult.hdVersoUrl) {
        console.log('🎉 [HDCaptureOnAddToCart] Capture HD réussie:', hdResult);
        
        toast({
          title: "Fichiers de production créés",
          description: `${hdResult.hdRectoUrl ? 'Recto' : ''}${hdResult.hdRectoUrl && hdResult.hdVersoUrl ? ' et ' : ''}${hdResult.hdVersoUrl ? 'Verso' : ''} capturé(s)`,
        });
        
        return hdResult;
      } else {
        console.warn('⚠️ [HDCaptureOnAddToCart] Aucun fichier HD généré');
        
        toast({
          variant: "default",
          title: "Aucune personnalisation détectée",
          description: "Le produit sera ajouté sans fichiers HD",
        });
        
        return {};
      }
    } catch (error) {
      console.error('❌ [HDCaptureOnAddToCart] Erreur:', error);
      
      toast({
        variant: "destructive",
        title: "Erreur de capture",
        description: "Le produit sera ajouté sans fichiers HD",
      });
      
      return {};
    }
  }, [captureAllHDVisuals]);

  return {
    captureForProduction,
    isCapturing
  };
};
