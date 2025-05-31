
import React, { useState } from 'react';
import { UploadImageField } from '@/components/ui/upload-image-field';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, Sparkles, Info, CheckCircle } from 'lucide-react';
import { AIImageGenerator } from './AIImageGenerator';

interface CustomImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  productId: string;
}

export const CustomImageUpload: React.FC<CustomImageUploadProps> = ({
  value,
  onChange,
  productId,
}) => {
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const tips = [
    "Utilisez des images haute résolution (minimum 300 DPI)",
    "Formats recommandés : PNG, JPG, SVG",
    "Évitez les images trop sombres ou trop claires",
    "Les SVG permettent la personnalisation des couleurs"
  ];

  const handleAIImageGenerated = (imageUrl: string) => {
    onChange(imageUrl);
    setShowAIGenerator(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Upload d'image personnalisée</h3>
        <p className="text-sm text-white/70">
          Uploadez votre propre design ou générez-en un avec l'IA
        </p>
      </div>

      {/* Section Upload */}
      <div className="space-y-4">
        <UploadImageField
          label="Votre image"
          value={value}
          onChange={onChange}
          placeholder="URL de votre image ou uploadez un fichier"
          showPreview={true}
          className="space-y-2"
        />

        {value && (
          <div className="flex items-center gap-2 text-sm text-green-400">
            <CheckCircle className="h-4 w-4" />
            Image sélectionnée avec succès
          </div>
        )}
      </div>

      <Separator className="bg-white/10" />

      {/* Section Génération IA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-winshirt-purple" />
              Génération IA
            </h4>
            <p className="text-sm text-white/70">Créez un design unique avec l'intelligence artificielle</p>
          </div>
          <Badge variant="outline" className="text-xs">
            Nouveau
          </Badge>
        </div>

        <Button
          onClick={() => setShowAIGenerator(true)}
          variant="outline"
          className="w-full border-winshirt-purple/50 text-winshirt-purple hover:bg-winshirt-purple/10"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Générer avec l'IA
        </Button>

        {showAIGenerator && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <AIImageGenerator
              onImageGenerated={handleAIImageGenerated}
              onClose={() => setShowAIGenerator(false)}
            />
          </div>
        )}
      </div>

      <Separator className="bg-white/10" />

      {/* Conseils */}
      <div className="space-y-3">
        <h4 className="font-medium text-white flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-400" />
          Conseils pour de meilleurs résultats
        </h4>
        <div className="space-y-2">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 text-sm text-white/70">
              <div className="w-1.5 h-1.5 bg-winshirt-purple rounded-full mt-2 flex-shrink-0" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formats supportés */}
      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">Formats supportés</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['PNG', 'JPG', 'JPEG', 'SVG', 'WEBP'].map((format) => (
            <Badge key={format} variant="outline" className="text-xs border-blue-400/30 text-blue-300">
              {format}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
