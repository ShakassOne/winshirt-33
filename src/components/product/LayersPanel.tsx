import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, MoveUp, MoveDown, Trash2, Copy, Move } from 'lucide-react';
import { Design } from '@/types/supabase.types';

interface LayerElement {
  id: string;
  name: string;
  type: 'design' | 'text' | 'qrcode';
  side: 'front' | 'back';
  visible: boolean;
  zIndex: number;
  data?: any;
}

interface LayersPanelProps {
  currentViewSide: 'front' | 'back';
  selectedDesignFront: Design | null;
  selectedDesignBack: Design | null;
  textContentFront: string;
  textContentBack: string;
  onRemoveDesign: () => void;
  onRemoveText: () => void;
  onElementSelect?: (elementId: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  currentViewSide,
  selectedDesignFront,
  selectedDesignBack,
  textContentFront,
  textContentBack,
  onRemoveDesign,
  onRemoveText,
  onElementSelect
}) => {
  // Build layers from current state
  const layers: LayerElement[] = [];

  // Add front elements
  if (selectedDesignFront) {
    layers.push({
      id: `design-front-${selectedDesignFront.id}`,
      name: selectedDesignFront.name,
      type: 'design',
      side: 'front',
      visible: true,
      zIndex: 2,
      data: selectedDesignFront
    });
  }

  if (textContentFront) {
    layers.push({
      id: 'text-front',
      name: `Texte avant: "${textContentFront.substring(0, 20)}${textContentFront.length > 20 ? '...' : ''}"`,
      type: 'text',
      side: 'front',
      visible: true,
      zIndex: 3,
      data: { content: textContentFront }
    });
  }

  // Add back elements
  if (selectedDesignBack) {
    layers.push({
      id: `design-back-${selectedDesignBack.id}`,
      name: selectedDesignBack.name,
      type: 'design',
      side: 'back',
      visible: true,
      zIndex: 2,
      data: selectedDesignBack
    });
  }

  if (textContentBack) {
    layers.push({
      id: 'text-back',
      name: `Texte arrière: "${textContentBack.substring(0, 20)}${textContentBack.length > 20 ? '...' : ''}"`,
      type: 'text',
      side: 'back',
      visible: true,
      zIndex: 3,
      data: { content: textContentBack }
    });
  }

  // Filter layers by current view
  const currentLayers = layers.filter(layer => layer.side === currentViewSide);

  // Sort by z-index (highest first - top of stack)
  const sortedLayers = currentLayers.sort((a, b) => b.zIndex - a.zIndex);

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'design':
        return '🎨';
      case 'text':
        return '📝';
      case 'qrcode':
        return '📱';
      default:
        return '📄';
    }
  };

  const handleDeleteLayer = (layer: LayerElement) => {
    if (layer.type === 'design') {
      onRemoveDesign();
    } else if (layer.type === 'text') {
      onRemoveText();
    }
  };

  const handleSelectLayer = (layer: LayerElement) => {
    onElementSelect?.(layer.id);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black">Calques</h3>
        <span className="text-sm text-gray-500">
          Côté {currentViewSide === 'front' ? 'avant' : 'arrière'}
        </span>
      </div>

      {sortedLayers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun élément sur ce côté</p>
          <p className="text-sm mt-2">Ajoutez du texte ou une image pour voir les calques</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedLayers.map((layer, index) => (
            <div
              key={layer.id}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors cursor-pointer"
              onClick={() => handleSelectLayer(layer)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-lg">{getLayerIcon(layer.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {layer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {layer.type === 'design' ? 'Image' : 'Texte'} • z-index: {layer.zIndex}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle visibility (future feature)
                    }}
                  >
                    {layer.visible ? (
                      <Eye className="h-4 w-4 text-gray-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLayer(layer);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {/* Layer controls */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs hover:bg-gray-100"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Move up (future feature)
                      }}
                    >
                      <MoveUp className="h-3 w-3 mr-1" />
                      Haut
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs hover:bg-gray-100"
                      disabled={index === sortedLayers.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Move down (future feature)
                      }}
                    >
                      <MoveDown className="h-3 w-3 mr-1" />
                      Bas
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Duplicate (future feature)
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Dupliquer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transform controls for selected element */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-black mb-3">Contrôles de transformation</h4>
        <p className="text-xs text-gray-500">
          Utilisez les contrôles tactiles sur l'aperçu pour manipuler les éléments
        </p>
      </div>
    </div>
  );
};