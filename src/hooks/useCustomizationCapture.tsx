import { useState } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';

export const useCustomizationCapture = () => {
  const { user } = useOptimizedAuth();
  const [isCapturing, setIsCapturing] = useState(false);

  const captureAndSaveCustomization = async (
    productName: string,
    customization: any
  ) => {
    if (!user) {
      toast.error('Vous devez être connecté pour sauvegarder une personnalisation');
      return null;
    }

    setIsCapturing(true);
    try {
      // Capture de la preview avec produit
      const previewElement = document.querySelector('[data-capture-element]');
      let previewUrl = null;
      let hdUrl = null;

      if (previewElement) {
        // Capture preview avec produit
        const previewCanvas = await html2canvas(previewElement as HTMLElement, {
          backgroundColor: null,
          useCORS: true,
          allowTaint: true,
          scale: 1
        });

        // Upload preview
        const previewBlob = await new Promise<Blob>((resolve) => {
          previewCanvas.toBlob((blob) => resolve(blob!), 'image/png');
        });

        const previewFileName = `customization-preview-${Date.now()}.png`;
        const { data: previewData, error: previewError } = await supabase.storage
          .from('public')
          .upload(previewFileName, previewBlob);

        if (previewError) throw previewError;
        
        const { data: { publicUrl: previewPublicUrl } } = supabase.storage
          .from('public')
          .getPublicUrl(previewFileName);
        
        previewUrl = previewPublicUrl;

        // Capture HD sans produit (pour la production)
        // Récupérer les éléments de design uniquement
        const designElements = document.querySelectorAll('.design-element, .text-element');
        if (designElements.length > 0) {
          // Créer un canvas temporaire pour les éléments de design seulement
          const tempDiv = document.createElement('div');
          tempDiv.style.position = 'absolute';
          tempDiv.style.top = '-9999px';
          tempDiv.style.width = '400px';
          tempDiv.style.height = '400px';
          tempDiv.style.backgroundColor = 'transparent';
          
          // Copier les éléments de design
          designElements.forEach(element => {
            tempDiv.appendChild(element.cloneNode(true));
          });
          
          document.body.appendChild(tempDiv);
          
          const hdCanvas = await html2canvas(tempDiv, {
            backgroundColor: null,
            useCORS: true,
            allowTaint: true,
            scale: 2
          });

          document.body.removeChild(tempDiv);

          // Upload HD
          const hdBlob = await new Promise<Blob>((resolve) => {
            hdCanvas.toBlob((blob) => resolve(blob!), 'image/png');
          });

          const hdFileName = `customization-hd-${Date.now()}.png`;
          const { data: hdData, error: hdError } = await supabase.storage
            .from('public')
            .upload(hdFileName, hdBlob);

          if (hdError) throw hdError;
          
          const { data: { publicUrl: hdPublicUrl } } = supabase.storage
            .from('public')
            .getPublicUrl(hdFileName);
          
          hdUrl = hdPublicUrl;
        }
      }

      // Sauvegarder en base de données
      const { data, error } = await supabase
        .from('user_customizations')
        .insert({
          user_id: user.id,
          product_name: productName,
          customization: customization,
          preview_url: previewUrl,
          hd_url: hdUrl
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Personnalisation sauvegardée dans "Mes Custos"');
      return data;

    } catch (error) {
      console.error('Erreur lors de la capture et sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la personnalisation');
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    captureAndSaveCustomization,
    isCapturing
  };
};