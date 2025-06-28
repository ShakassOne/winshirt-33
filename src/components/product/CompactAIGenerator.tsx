
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Sparkles, Download, Wand2, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CompactAIGeneratorProps {
  onImageGenerated: (imageUrl: string, imageName: string) => void;
}

export const CompactAIGenerator: React.FC<CompactAIGeneratorProps> = ({
  onImageGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{ url: string; name: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer une description pour générer l'image."
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI generation - In real app, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a mock generated image
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a gradient background
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(0.5, '#4ECDC4');
        gradient.addColorStop(1, '#45B7D1');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add some text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('IA', 256, 200);
        ctx.font = '24px Arial';
        ctx.fillText('Généré', 256, 240);
        ctx.font = '16px Arial';
        ctx.fillText(prompt.substring(0, 30), 256, 280);
      }
      
      const imageUrl = canvas.toDataURL('image/png');
      const imageName = `IA_${prompt.substring(0, 20).replace(/\s+/g, '_')}_${Date.now()}`;
      
      const newImage = { url: imageUrl, name: imageName };
      setGeneratedImages(prev => [newImage, ...prev]);
      
      toast({
        title: "Image générée",
        description: `L'image "${imageName}" a été générée avec succès.`
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer l'image. Veuillez réessayer."
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      const imageName = `Upload_${file.name.replace(/\.[^/.]+$/, "")}_${Date.now()}`;
      
      const newImage = { url: imageUrl, name: imageName };
      setGeneratedImages(prev => [newImage, ...prev]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Generation controls - Compact */}
      <div className="space-y-3">
        <div>
          <Label className="text-white text-sm">Description de l'image</Label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Un chat noir avec des lunettes..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 mt-1"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Générer
              </>
            )}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="border-white/30 hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Generated images gallery - Full width grid */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-white text-sm">
            Images générées ({generatedImages.length})
          </Label>
          {generatedImages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGeneratedImages([])}
              className="h-6 text-xs border-red-500/30 hover:bg-red-500/20 text-red-400"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Tout effacer
            </Button>
          )}
        </div>
        
        {generatedImages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-white/50 text-sm text-center py-8">
            Aucune image générée.<br />
            Entrez une description et cliquez sur "Générer".
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-2 -mr-2">
            <div className="grid grid-cols-3 gap-3">
              {generatedImages.map((image, index) => (
                <div
                  key={index}
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
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleImageDelete(index)}
                        className="text-xs h-6 px-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Image name */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-1">
                    <p className="text-xs text-white truncate">{image.name}</p>
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
