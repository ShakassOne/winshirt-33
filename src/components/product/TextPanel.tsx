import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { TextCustomizer } from './TextCustomizer';

interface TextPanelProps {
  textContent: string;
  textFont: string;
  textColor: string;
  textStyles: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  textTransform: {
    position: { x: number; y: number; };
    scale: number;
    rotation: number;
  };
  onTextContentChange: (content: string) => void;
  onTextFontChange: (font: string) => void;
  onTextColorChange: (color: string) => void;
  onTextStylesChange: (styles: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }) => void;
  onTextTransformChange: (property: string, value: any) => void;
  onRemoveText: () => void;
}

export const TextPanel: React.FC<TextPanelProps> = ({
  textContent,
  textFont,
  textColor,
  textStyles,
  textTransform,
  onTextContentChange,
  onTextFontChange,
  onTextColorChange,
  onTextStylesChange,
  onTextTransformChange,
  onRemoveText
}) => {
  const [currentLevel, setCurrentLevel] = useState<'editor' | 'advanced'>('editor');

  const handleBackToEditor = () => {
    setCurrentLevel('editor');
  };

  if (currentLevel === 'advanced') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToEditor}
            className="p-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-sm font-medium">Options Avancées</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveText}
            disabled={!textContent}
          >
            Supprimer
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* Advanced text options will be added here later */}
          <p className="text-sm text-muted-foreground text-center py-4">
            Options avancées de style à venir...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Texte</h3>
        <div className="flex gap-2">
          {textContent && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentLevel('advanced')}
            >
              <Settings className="w-4 h-4 mr-1" />
              Style
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onRemoveText}
            disabled={!textContent}
          >
            Réinitialiser
          </Button>
        </div>
      </div>
      
      <TextCustomizer
        textContent={textContent}
        textFont={textFont}
        textColor={textColor}
        textStyles={textStyles}
        textTransform={textTransform}
        onTextContentChange={onTextContentChange}
        onTextFontChange={onTextFontChange}
        onTextColorChange={onTextColorChange}
        onTextStylesChange={onTextStylesChange}
        onTextTransformChange={onTextTransformChange}
      />
    </div>
  );
};