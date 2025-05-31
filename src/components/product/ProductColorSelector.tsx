
import React from 'react';
import { MockupColor } from '@/types/mockup.types';

interface ProductColorSelectorProps {
  colors: MockupColor[];
  selectedColor: MockupColor | null;
  onColorSelect: (color: MockupColor) => void;
}

export const ProductColorSelector: React.FC<ProductColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color) => (
        <button
          key={color.id || color.name}
          onClick={() => onColorSelect(color)}
          className={`
            relative w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110
            ${selectedColor?.name === color.name 
              ? 'border-white shadow-lg shadow-white/30' 
              : 'border-gray-300 hover:border-gray-200'
            }
          `}
          style={{ backgroundColor: color.color_code }}
          title={color.name}
        >
          {selectedColor?.name === color.name && (
            <div className="absolute inset-0 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
};
