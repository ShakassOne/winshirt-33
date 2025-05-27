
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CaptureMockupButtonProps {
  targetId: string;
  side: 'recto' | 'verso';
  onUploadSuccess?: (url: string) => void;
  className?: string;
}

export default function CaptureMockupButton({
  targetId,
  side = 'recto',
  onUploadSuccess,
  className
}: CaptureMockupButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      console.error("Élément introuvable : " + targetId);
      return;
    }

    setLoading(true);
    try {
      const canvas = await html2canvas(element, {
        useCORS: true,
        backgroundColor: null,
        scale: 2, // Meilleure qualité
        width: 600, // Largeur max
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
        console.log(`Upload ${side} réussi:`, response.data.url);
        onUploadSuccess && onUploadSuccess(response.data.url);
      } else {
        console.error("Erreur lors de l'upload:", response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la capture ou l'envoi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={className}
      onClick={handleCapture}
      disabled={loading}
      variant="outline"
      size="sm"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Envoi...
        </>
      ) : (
        `Capturer ${side}`
      )}
    </Button>
  );
}
