
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { MockupColor } from '@/types/mockup.types';

interface ProductColorSelectorProps {
  mockupColors: MockupColor[];
  selectedMockupColor: MockupColor | null;
  onColorSelect: (color: MockupColor) => void;
}

export const ProductColorSelector: React.FC<ProductColorSelectorProps> = ({
  mockupColors,
  selectedMockupColor,
  onColorSelect
}) => {
  if (!mockupColors || mockupColors.length <= 1) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Couleurs disponibles</Label>
      <div className="flex flex-wrap gap-2">
        {mockupColors.map((color) => (
          <Button
            key={color.id}
            variant="outline"
            className={`relative p-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
              selectedMockupColor?.id === color.id 
                ? 'border-winshirt-purple ring-2 ring-winshirt-purple/50' 
                : 'border-white/20 hover:border-winshirt-purple/50'
            }`}
            onClick={() => onColorSelect(color)}
          >
            <img
              src={color.front_image_url}
              alt={color.color_name}
              className="w-full h-full object-cover"
            />
            {selectedMockupColor?.id === color.id && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
