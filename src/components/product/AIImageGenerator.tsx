
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

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
      
      const response = await fetch('https://gyprtpqgeukcoxbfxtfg.supabase.co/functions/v1/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cHJ0cHFnZXVrY294YmZ4dGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NzY1MDQsImV4cCI6MjA2MjM1MjUwNH0.sm-yWpvwGPvEFHdKomFsE-YKF0BHzry2W4Gma2hpY_4`
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Erreur HTTP ${response.status}`);
      }

      if (!data?.imageUrl) {
        throw new Error('Aucune image reçue dans la réponse');
      }

      console.log('Image générée avec succès');
      setGeneratedImage(data.imageUrl);
      toast.success('Image générée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      
      let errorMessage = 'Erreur lors de la génération de l\'image';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
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
          <DialogDescription>
            Générez des images uniques avec l'intelligence artificielle en décrivant ce que vous voulez.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Description de l'image</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: un logo moderne minimaliste, un paysage coloré..."
              className="w-full"
            />
            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-200">
                Évitez les descriptions controversées, violentes ou inappropriées. L'IA peut refuser certaines demandes.
              </p>
            </div>
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
