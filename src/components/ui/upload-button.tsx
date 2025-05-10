
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadFileToStorage } from '@/services/api.service';

interface UploadButtonProps {
  onUpload: (url: string) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  targetFolder?: string;
  acceptTypes?: string;
  className?: string;
}

export function UploadButton({
  onUpload,
  variant = 'default',
  size = 'default',
  targetFolder = 'uploads',
  acceptTypes = 'image/*',
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
      const url = await uploadFileToStorage(file, targetFolder);
      onUpload(typeof url === 'string' ? url : url.toString());
      toast({
        title: "Téléchargement réussi",
        description: "Le fichier a été téléchargé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive",
      });
      console.error("Upload error:", error);
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
