
import React from 'react';
import { Check } from 'lucide-react';
import { getContrastColor } from '@/hooks/useProductDetail';

interface ProductColorSelectorProps {
  title: string;
  colors: string[] | { id?: string; name: string; color_code?: string; hex_code: string }[];
  selectedColor: string | { id?: string; name: string; color_code?: string; hex_code: string };
  onColorSelect: (color: any) => void;
  isMockupColor?: boolean;
}

const ProductColorSelector = ({
  title,
  colors,
  selectedColor,
  onColorSelect,
  isMockupColor = false
}: ProductColorSelectorProps) => {
  
  const getColorHexCode = (colorName: string) => {
    // Convertir les noms de couleurs en codes hex
    const colorMap: {[key: string]: string} = {
      'white': '#ffffff',
      'black': '#000000',
      'red': '#ff0000',
      'blue': '#0000ff',
      'gray': '#808080',
      'navy': '#000080',
    };
    
    return colorName.startsWith('#') ? colorName : (colorMap[colorName.toLowerCase()] || '#000000');
  };
  
  if (!colors || colors.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {isMockupColor ? (
          // For mockup colors that are objects with hex_code
          colors.map((color: any) => (
            <button
              key={color.id || color.name}
              className={`w-10 h-10 rounded-full border-2 ${
                (selectedColor as any)?.color_code === color.color_code
                  ? 'border-black'
                  : 'border-gray-300'
              }`}
              style={{
                backgroundColor: color.hex_code,
              }}
              onClick={() => onColorSelect(color)}
              aria-label={`Couleur: ${color.name}`}
            >
              {(selectedColor as any)?.color_code === color.color_code && (
                <Check
                  className="w-5 h-5 mx-auto"
                  style={{
                    color: getContrastColor(color.hex_code),
                  }}
                />
              )}
            </button>
          ))
        ) : (
          // For regular product colors that are strings
          colors.map((color: any) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColor === color
                  ? 'border-black'
                  : 'border-gray-300'
              }`}
              style={{
                backgroundColor: getColorHexCode(color),
              }}
              onClick={() => onColorSelect(color)}
              aria-label={`Couleur: ${color}`}
            >
              {selectedColor === color && (
                <Check
                  className="w-4 h-4 mx-auto text-white"
                  style={{
                    color: getContrastColor(getColorHexCode(color)),
                  }}
                />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductColorSelector;
