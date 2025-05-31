
import React from 'react';
import { UploadImageField } from '@/components/ui/upload-image-field';
import { Label } from '@/components/ui/label';

interface CustomImageUploadProps {
  customImageUrl: string;
  onImageUpload: (url: string) => void;
  onImageUrlChange: (url: string) => void;
}

export default function CustomImageUpload({
  customImageUrl,
  onImageUpload,
  onImageUrlChange
}: CustomImageUploadProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-medium text-white mb-4 block">
          Télécharger votre propre image
        </Label>
        
        <UploadImageField
          label="Choisissez votre image"
          value={customImageUrl}
          onChange={onImageUrlChange}
          placeholder="URL de votre image ou téléchargez un fichier"
          showPreview={true}
          className="space-y-3"
        />
      </div>
      
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-400 mb-2">💡 Conseils pour une meilleure qualité</h4>
        <ul className="text-sm text-white/70 space-y-1">
          <li>• Utilisez des images en haute résolution (minimum 1000x1000px)</li>
          <li>• Privilégiez les formats PNG pour la transparence</li>
          <li>• Les fichiers SVG sont parfaits pour les logos et icons</li>
          <li>• Évitez les images trop compressées (JPEG de faible qualité)</li>
        </ul>
      </div>
    </div>
  );
}
