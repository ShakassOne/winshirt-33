
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Wand2, Trash2, AlertTriangle, Zap, Recycle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { generateImage, getGenerationStats, getAvailableAIImages, GenerationStats, AIImage } from '@/services/aiImages.service';

interface CompactAIGeneratorProps {
  onImageGenerated: (imageUrl: string, imageName: string) => void;
}

export const CompactAIGenerator: React.FC<CompactAIGeneratorProps> = ({
  onImageGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; name: string }>>([]);
  const [availableImages, setAvailableImages] = useState<AIImage[]>([]);
  const [stats, setStats] = useState<GenerationStats>({ totalGenerations: 0, remainingGenerations: 3 });
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  // Load stats and available images on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [generationStats, availableAIImages] = await Promise.all([
          getGenerationStats(),
          getAvailableAIImages(50)
        ]);
        setStats(generationStats);
        setAvailableImages(availableAIImages);
      } catch (error) {
        console.error('Error loading AI data:', error);
      } finally {
        setIsLoadingGallery(false);
      }
    };

    loadData();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer une description pour générer l'image."
      });
      return;
    }

    if (stats.remainingGenerations <= 0) {
      toast({
        variant: "destructive",
        title: "Limite atteinte",
        description: "Vous avez utilisé toutes vos générations. Parcourez les images disponibles ci-dessous."
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateImage(prompt);
      
      if (result.error) {
        if (result.limitReached) {
          toast({
            variant: "destructive",
            title: "Limite atteinte",
            description: result.error
          });
          // Refresh stats
          const newStats = await getGenerationStats();
          setStats(newStats);
          return;
        }
        throw new Error(result.error);
      }

      const imageName = result.recycled 
        ? `IA (Recyclée): ${prompt.substring(0, 20)}...`
        : `IA: ${prompt.substring(0, 20)}...`;
      
      // Add to local generated images
      const newImage = { url: result.imageUrl, name: imageName };
      setGeneratedImages(prev => [newImage, ...prev]);
      
      // Refresh available images and stats
      const [newStats, newAvailableImages] = await Promise.all([
        getGenerationStats(),
        getAvailableAIImages(50)
      ]);
      setStats(newStats);
      setAvailableImages(newAvailableImages);
      
      toast({
        title: result.recycled ? "Image recyclée trouvée!" : "Image générée",
        description: result.message || `${imageName} créée avec succès.`
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de générer l'image."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSelect = (image: { url: string; name: string }) => {
    onImageGenerated(image.url, image.name);
    toast({
      title: "Image sélectionnée",
      description: `${image.name} a été ajoutée au design.`
    });
  };

  const handleImageDelete = (index: number) => {
    setGeneratedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Combine generated and available images with proper typing
  const allImages = [
    ...generatedImages,
    ...availableImages.map(img => ({
      url: img.image_url,
      name: `IA: ${img.prompt.substring(0, 30)}...`,
      usage_count: img.usage_count || 0
    }))
  ];

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Generation stats */}
      <div className="bg-white/10 rounded-lg p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-green-400">
            <Zap className="h-3 w-3" />
            <span>Restantes: {stats.remainingGenerations}/3</span>
          </div>
          <div className="flex items-center gap-1 text-blue-400">
            <Sparkles className="h-3 w-3" />
            <span>Total: {stats.totalGenerations}</span>
          </div>
        </div>
      </div>

      {/* Generation controls */}
      <div className="space-y-3">
        <div>
          <Label className="text-white text-sm">Description de l'image</Label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Un chat noir avec des lunettes..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 mt-1"
            disabled={isGenerating}
          />
        </div>
        
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || stats.remainingGenerations <= 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isGenerating ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Générer ({stats.remainingGenerations} restantes)
            </>
          )}
        </Button>

        {stats.remainingGenerations <= 0 && (
          <div className="flex items-start gap-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-200">
              Limite atteinte. Parcourez les images disponibles ci-dessous.
            </p>
          </div>
        )}
      </div>

      {/* Images gallery */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-white text-sm">
            Images disponibles ({allImages.length})
          </Label>
          {generatedImages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGeneratedImages([])}
              className="h-6 text-xs border-red-500/30 hover:bg-red-500/20 text-red-400"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Nettoyer
            </Button>
          )}
        </div>
        
        {isLoadingGallery ? (
          <div className="flex-1 flex items-center justify-center text-white/50 text-sm py-8">
            <Sparkles className="h-4 w-4 mr-2 animate-spin" />
            Chargement...
          </div>
        ) : allImages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-white/50 text-sm text-center py-8">
            Aucune image disponible.<br />
            Entrez une description et cliquez sur "Générer".
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-2 -mr-2">
            <div className="grid grid-cols-3 gap-3">
              {allImages.map((image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="group relative bg-black/40 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-[1.02] border border-white/10 hover:border-purple-500/50"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="object-cover w-full h-full"
                      onClick={() => handleImageSelect(image)}
                    />
                  </div>
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleImageSelect(image)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs h-6 px-2"
                      >
                        Utiliser
                      </Button>
                      {index < generatedImages.length && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleImageDelete(index)}
                          className="text-xs h-6 px-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Image info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-1">
                    <p className="text-xs text-white truncate">{image.name}</p>
                    {'usage_count' in image && typeof image.usage_count === 'number' && (
                      <div className="flex items-center gap-1 text-xs text-green-400">
                        <Recycle className="h-2 w-2" />
                        <span>{image.usage_count}x utilisée</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
