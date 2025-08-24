import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import { CompactAIGenerator } from './CompactAIGenerator';

interface AIPanelProps {
  onAIImageGenerated: (imageUrl: string, imageName: string) => void;
  onRemoveDesign: () => void;
  selectedDesign: Design | null;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  onAIImageGenerated,
  onRemoveDesign,
  selectedDesign
}) => {
  const [currentLevel, setCurrentLevel] = useState<'generator' | 'advanced'>('generator');

  const handleBackToGenerator = () => {
    setCurrentLevel('generator');
  };

  const handleAIGenerated = (imageUrl: string, imageName: string) => {
    onAIImageGenerated(imageUrl, imageName);
    // Stay on generator level to allow further generation
  };

  if (currentLevel === 'advanced') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToGenerator}
            className="p-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-sm font-medium">Options IA Avancées</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveDesign}
            disabled={!selectedDesign}
          >
            Supprimer
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* Advanced AI options will be added here later */}
          <p className="text-sm text-muted-foreground text-center py-4">
            Options IA avancées à venir...
            <br />
            (Styles, modèles, paramètres)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Générateur IA</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentLevel('advanced')}
          >
            <Settings className="w-4 h-4 mr-1" />
            Options
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveDesign}
            disabled={!selectedDesign}
          >
            Réinitialiser
          </Button>
        </div>
      </div>
      
      <CompactAIGenerator
        onImageGenerated={handleAIGenerated}
      />
    </div>
  );
};