
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadToExternalScript } from '@/services/api.service';

interface UploadButtonProps {
  onUpload: (url: string) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  acceptTypes?: string;
  className?: string;
}

export function UploadButton({
  onUpload,
  variant = 'default',
  size = 'default',
  acceptTypes = 'image/*,.svg',
  className
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      console.log('[UploadButton] Upload vers winshirt.fr/upload-visuel.php...');
      const url = await uploadToExternalScript(file);
      
      toast({
        title: "Upload réussi",
        description: "Le fichier a été téléchargé avec succès",
      });
      
      onUpload(url);
    } catch (error) {
      console.error("Upload error:", error);
      
      // Amélioration de la gestion d'erreurs
      let errorMessage = "Une erreur est survenue lors du téléchargement";
      
      if (error instanceof Error) {
        if (error.message.includes('Network Error') || error.message.includes('connexion')) {
          errorMessage = "Impossible de se connecter au serveur d'upload. Vérifiez votre connexion internet.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Le téléchargement a pris trop de temps. Réessayez avec un fichier plus petit.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erreur d'upload",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isUploading}
        className={className}
      >
        <Upload className="h-4 w-4 mr-1" />
        {size !== 'icon' && (isUploading ? 'Téléchargement...' : 'Télécharger')}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptTypes}
        style={{ display: 'none' }}
      />
    </>
  );
}
