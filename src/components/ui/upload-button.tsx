
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadFileToStorage, uploadToExternalScript } from '@/services/api.service';

interface UploadButtonProps {
  onUpload: (url: string) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  targetFolder?: string;
  acceptTypes?: string;
  className?: string;
  useExternalUpload?: boolean;
}

export function UploadButton({
  onUpload,
  variant = 'default',
  size = 'default',
  targetFolder = 'uploads',
  acceptTypes = 'image/*',
  className,
  useExternalUpload = true
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
      let url: string;
      
      if (useExternalUpload) {
        try {
          console.log('[UploadButton] Tentative upload externe...');
          url = await uploadToExternalScript(file);
          toast({
            title: "Upload réussi",
            description: "Le fichier a été téléchargé vers le serveur externe",
          });
        } catch (externalError) {
          console.error('[UploadButton] Upload externe échoué, fallback vers Supabase...', externalError);
          
          // Fallback vers Supabase avec message informatif
          url = await uploadFileToStorage(file, targetFolder);
          toast({
            title: "Upload réussi (fallback)",
            description: "Le fichier a été téléchargé vers Supabase Storage",
          });
        }
      } else {
        url = await uploadFileToStorage(file, targetFolder);
        toast({
          title: "Upload réussi",
          description: "Le fichier a été téléchargé vers Supabase Storage",
        });
      }
      
      onUpload(url);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur d'upload",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors du téléchargement",
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
