
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';
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
      setTimeout(() => {
        onImageGenerated('/placeholder.svg', `IA: ${prompt.substring(0, 30)}...`);
        setIsGenerating(false);
        setPrompt('');
      }, 2000);
    } catch (error) {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-3">
      <div>
        <Label className="text-white text-sm">Génération rapide</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Décrivez votre image..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            disabled={isGenerating}
          />
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90 shrink-0"
            size="sm"
          >
            {isGenerating ? (
              <div className="animate-spin h-4 w-4 border border-white border-t-transparent rounded-full" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <Label className="text-white text-sm">Images IA disponibles</Label>
        <div className="mt-2 h-full overflow-y-auto border border-white/20 rounded bg-black/20">
          <AIImageGallery onImageSelect={onImageGenerated} />
        </div>
      </div>
    </div>
  );
};
