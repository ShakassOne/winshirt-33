
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Sparkles, Wand2 } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import AIImageGenerator from './AIImageGenerator';

interface UploadDesignProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIImageGenerated: (imageUrl: string, imageName: string) => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;
  currentDesign: Design | null;
}

export const UploadDesign: React.FC<UploadDesignProps> = ({
  onFileUpload,
  onAIImageGenerated,
  onRemoveBackground,
  isRemovingBackground,
  currentDesign
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);

  const canRemoveBackground = currentDesign && 
    (currentDesign.category === 'ai-generated' || currentDesign.category === 'ai-generated-cleaned');

  return (
    <div className="space-y-6">
      {/* Upload fichier */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Importer votre design</Label>
        
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-winshirt-purple/50 transition-colors">
          <Upload className="h-12 w-12 mx-auto mb-4 text-white/40" />
          <p className="text-white/70 mb-4">
            Glissez-déposez votre image ici ou cliquez pour sélectionner
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-winshirt-purple/20 to-winshirt-blue/20"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choisir un fichier
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.svg"
            onChange={onFileUpload}
          />
          <p className="text-xs text-white/50 mt-2">
            Formats supportés : JPG, PNG, SVG (max. 10MB)
          </p>
        </div>
      </div>

      {/* Génération IA */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Génération par IA</Label>
        
        <div className="p-6 bg-gradient-to-r from-winshirt-purple/10 to-winshirt-blue/10 rounded-lg border border-white/20">
          <div className="text-center space-y-4">
            <Sparkles className="h-12 w-12 mx-auto text-winshirt-purple" />
            <div>
              <h3 className="font-medium mb-2">Créez avec l'IA</h3>
              <p className="text-sm text-white/70 mb-4">
                Décrivez votre vision et laissez l'IA créer un design unique pour vous
              </p>
            </div>
            <Button
              onClick={() => setAiGeneratorOpen(true)}
              className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Générer avec l'IA
            </Button>
          </div>
        </div>
      </div>

      {/* Suppression de fond */}
      {canRemoveBackground && (
        <div className="space-y-4">
          <Label className="text-sm font-medium">Amélioration d'image</Label>
          
          <div className="p-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-lg border border-orange-500/20">
            <div className="text-center space-y-4">
              <Wand2 className="h-12 w-12 mx-auto text-orange-400" />
              <div>
                <h3 className="font-medium mb-2">Supprimer le fond</h3>
                <p className="text-sm text-white/70 mb-4">
                  Supprimez automatiquement le fond de votre image IA pour un rendu plus professionnel
                </p>
              </div>
              <Button
                onClick={onRemoveBackground}
                disabled={isRemovingBackground}
                variant="outline"
                className="bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30"
              >
                {isRemovingBackground ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Traitement...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Supprimer le fond
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Composant de génération IA */}
      <AIImageGenerator
        isOpen={aiGeneratorOpen}
        onClose={() => setAiGeneratorOpen(false)}
        onImageGenerated={onAIImageGenerated}
      />
    </div>
  );
};
