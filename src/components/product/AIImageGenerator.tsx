
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AIImageGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string, imageName: string) => void;
}

const AIImageGenerator = ({ isOpen, onClose, onImageGenerated }: AIImageGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez entrer une description pour générer une image');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Appel de la fonction edge generate-image avec prompt:', prompt);
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt }
      });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(error.message || 'Erreur lors de la génération de l\'image');
      }

      if (data?.error) {
        console.error('Erreur dans la réponse:', data.error);
        throw new Error(data.error);
      }

      if (!data?.image) {
        throw new Error('Aucune image reçue dans la réponse');
      }

      console.log('Image générée avec succès:', data.image);
      setGeneratedImage(data.image);
      toast.success('Image générée avec succès !');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la génération de l\'image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onImageGenerated(generatedImage, `IA: ${prompt.substring(0, 30)}...`);
      handleClose();
    }
  };

  const handleClose = () => {
    setPrompt('');
    setGeneratedImage(null);
    setIsGenerating(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black/70 backdrop-blur-lg border-white/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-winshirt-purple" />
            Générateur d'images IA
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Description de l'image</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décrivez l'image que vous voulez générer..."
              className="w-full"
            />
          </div>
          
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Générer l'image
              </>
            )}
          </Button>
          
          {generatedImage && (
            <div className="space-y-4">
              <div className="border border-white/20 rounded-lg p-4">
                <img
                  src={generatedImage}
                  alt="Image générée"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setGeneratedImage(null)}
                  className="flex-1"
                >
                  Générer une nouvelle image
                </Button>
                <Button
                  onClick={handleUseImage}
                  className="flex-1 bg-gradient-to-r from-winshirt-purple to-winshirt-blue"
                >
                  Utiliser cette image
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIImageGenerator;
