import logger from '@/utils/logger';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Loader2, Sparkles, AlertTriangle, Zap, Recycle } from 'lucide-react';
import { toast } from 'sonner';
import { generateImage, getGenerationStats, GenerationStats } from '@/services/aiImages.service';
import AIImageGallery from './AIImageGallery';

interface AIImageGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string, imageName: string) => void;
}

const AIImageGenerator = ({ isOpen, onClose, onImageGenerated }: AIImageGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [stats, setStats] = useState<GenerationStats>({ totalGenerations: 0, remainingGenerations: 3 });
  const [lastMessage, setLastMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    const generationStats = await getGenerationStats();
    setStats(generationStats);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Veuillez entrer une description pour générer une image');
      return;
    }

    if (stats.remainingGenerations <= 0) {
      toast.error('Limite de générations atteinte. Utilisez les images de la galerie.');
      return;
    }

    setIsGenerating(true);
    try {
      logger.log('Génération d\'image avec prompt:', prompt);
      
      const result = await generateImage(prompt);
      
      if (result.error) {
        if (result.limitReached) {
          toast.error(result.error);
          await loadStats(); // Refresh stats
          return;
        }
        throw new Error(result.error);
      }

      logger.log('Image générée avec succès');
      setGeneratedImage(result.imageUrl);
      setLastMessage(result.message || '');
      
      if (result.recycled) {
        toast.success(`Image recyclée trouvée ! (Gratuite)`);
      } else {
        toast.success(`Image générée avec succès !`);
      }
      
      // Refresh stats
      await loadStats();
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

  const handleImageSelect = (imageUrl: string, imageName: string) => {
    onImageGenerated(imageUrl, imageName);
    handleClose();
  };

  const handleClose = () => {
    setPrompt('');
    setGeneratedImage(null);
    setIsGenerating(false);
    setLastMessage('');
    onClose();
  };

  const canGenerate = stats.remainingGenerations > 0 && !isGenerating;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black/70 backdrop-blur-lg border-white/20 max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-winshirt-purple" />
            Générateur d'images IA
          </DialogTitle>
          <DialogDescription className="text-sm">
            Générez des images uniques avec l'IA ou parcourez les images déjà créées.
          </DialogDescription>
        </DialogHeader>

        {/* Stats Section - Plus compact */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-white/5 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Zap className="h-3 w-3" />
              Générations restantes
            </div>
            <div className="text-xl font-bold text-winshirt-purple">
              {stats.remainingGenerations}/3
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Sparkles className="h-3 w-3" />
              Total généré
            </div>
            <div className="text-xl font-bold text-blue-400">
              {stats.totalGenerations}
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4" />
              Générer
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2 text-sm">
              <Recycle className="h-4 w-4" />
              Galerie
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-sm">Description de l'image</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: un logo moderne minimaliste, un paysage coloré..."
                className="w-full"
                disabled={!canGenerate}
              />
              <div className="flex items-start gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200">
                  Évitez les descriptions controversées, violentes ou inappropriées.
                </p>
              </div>
              {stats.remainingGenerations <= 0 && (
                <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-200">
                    Limite atteinte. Utilisez la galerie.
                  </p>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || !prompt.trim()}
              className="w-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Générer ({stats.remainingGenerations} restantes)
                </>
              )}
            </Button>
            
            {generatedImage && (
              <div className="space-y-3">
                <div className="border border-white/20 rounded-lg p-3">
                  <img
                    src={generatedImage}
                    alt="Image générée"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {lastMessage && (
                    <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                      <Recycle className="h-3 w-3" />
                      {lastMessage}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setGeneratedImage(null)}
                    className="flex-1"
                    disabled={!canGenerate}
                    size="sm"
                  >
                    Nouvelle image
                  </Button>
                  <Button
                    onClick={handleUseImage}
                    className="flex-1 bg-gradient-to-r from-winshirt-purple to-winshirt-blue"
                    size="sm"
                  >
                    Utiliser cette image
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-4">
            <AIImageGallery onImageSelect={handleImageSelect} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AIImageGenerator;
