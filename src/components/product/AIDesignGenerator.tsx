
import React from 'react';
import { CompactAIGenerator } from './CompactAIGenerator';

interface AIDesignGeneratorProps {
  onImageGenerated: (imageUrl: string, imageName: string) => void;
}

export const AIDesignGenerator: React.FC<AIDesignGeneratorProps> = ({
  onImageGenerated
}) => {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ✨ Génération IA
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Créez des designs uniques avec l'intelligence artificielle
        </p>
      </div>

      <div className="flex-grow">
        <CompactAIGenerator onImageGenerated={onImageGenerated} />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-auto">
        <h4 className="font-medium text-blue-800 mb-2">🎨 Conseils IA</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Soyez précis dans vos descriptions</li>
          <li>• Utilisez des mots-clés comme "minimaliste", "coloré", "vintage"</li>
          <li>• Évitez les contenus inappropriés ou controversés</li>
          <li>• Les designs simples donnent souvent de meilleurs résultats</li>
        </ul>
      </div>
    </div>
  );
};
