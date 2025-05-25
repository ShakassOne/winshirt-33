
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
import { Loader2, Sparkles, AlertTriangle, Zap, Recycle, Coins } from 'lucide-react';
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
  const [stats, setStats] = useState<GenerationStats>({ totalGenerations: 0, remainingGenerations: 3, totalCost: 0 });
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
      console.log('Génération d\'image avec prompt:', prompt);
      
      const result = await generateImage(prompt);
      
      if (result.error) {
        if (result.limitReached) {
          toast.error(result.error);
          await loadStats(); // Refresh stats
          return;
        }
        throw new Error(result.error);
      }

      console.log('Image générée avec succès');
      setGeneratedImage(result.imageUrl);
      setLastMessage(result.message || '');
      
      if (result.recycled) {
        toast.success(`Image recyclée trouvée ! Économie : 0,037€`);
      } else {
        toast.success(`Image générée avec succès ! Coût : ${result.cost}€`);
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
      <DialogContent className="bg-black/70 backdrop-blur-lg border-white/20 max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-winshirt-purple" />
            Générateur d'images IA
          </DialogTitle>
          <DialogDescription>
            Générez des images uniques avec l'IA ou parcourez les images déjà créées.
          </DialogDescription>
        </DialogHeader>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <Zap className="h-4 w-4" />
              Générations restantes
            </div>
            <div className="text-2xl font-bold text-winshirt-purple">
              {stats.remainingGenerations}/3
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <Sparkles className="h-4 w-4" />
              Total généré
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {stats.totalGenerations}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <Coins className="h-4 w-4" />
              Coût total
            </div>
            <div className="text-2xl font-bold text-green-400">
              {stats.totalCost.toFixed(3)}€
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Générer nouvelle image
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Recycle className="h-4 w-4" />
              Galerie IA
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Description de l'image</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: un logo moderne minimaliste, un paysage coloré..."
                className="w-full"
                disabled={!canGenerate}
              />
              <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200">
                  Évitez les descriptions controversées, violentes ou inappropriées. L'IA peut refuser certaines demandes.
                </p>
              </div>
              {stats.remainingGenerations <= 0 && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">
                    Limite de 3 générations atteinte. Utilisez les images de la galerie ou recyclez une image existante.
                  </p>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || !prompt.trim()}
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
                  Générer l'image ({stats.remainingGenerations} restantes)
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
                  {lastMessage && (
                    <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                      <Recycle className="h-4 w-4" />
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
          </TabsContent>
          
          <TabsContent value="gallery">
            <AIImageGallery onImageSelect={handleImageSelect} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AIImageGenerator;
