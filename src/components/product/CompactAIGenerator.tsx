
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Wand2 } from 'lucide-react';
import AIImageGallery from './AIImageGallery';

interface CompactAIGeneratorProps {
  onImageGenerated: (imageUrl: string, imageName: string) => void;
}

export const CompactAIGenerator: React.FC<CompactAIGeneratorProps> = ({
  onImageGenerated
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulation de génération - à remplacer par l'appel réel à l'API
      setTimeout(() => {
        onImageGenerated('/placeholder.svg', `IA: ${prompt.substring(0, 30)}...`);
        setIsGenerating(false);
        setPrompt('');
      }, 2000);
    } catch (error) {
      console.error('Erreur de génération:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white text-sm">Génération rapide</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Décrivez votre image..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90 shrink-0"
            size="sm"
          >
            {isGenerating ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-white/5 border-white/20 text-white/70"
          onClick={() => setPrompt('Logo moderne minimaliste')}
        >
          Logo moderne
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-white/5 border-white/20 text-white/70"
          onClick={() => setPrompt('Illustration abstraite colorée')}
        >
          Art abstrait
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs bg-white/5 border-white/20 text-white/70"
          onClick={() => setPrompt('Motif géométrique élégant')}
        >
          Géométrique
        </Button>
      </div>

      <div>
        <Label className="text-white text-sm">Images IA disponibles</Label>
        <div className="mt-2 max-h-32 overflow-hidden">
          <AIImageGallery onImageSelect={onImageGenerated} />
        </div>
      </div>
    </div>
  );
};
