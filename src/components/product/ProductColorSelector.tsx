
import React from 'react';
import { MockupColor } from '@/types/mockup.types';
import { cn } from '@/lib/utils';

interface ProductColorSelectorProps {
  colors: MockupColor[];
  selectedColor: MockupColor | null;
  onColorSelect: (color: MockupColor) => void;
  className?: string;
}

export const ProductColorSelector: React.FC<ProductColorSelectorProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  className = ''
}) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h4 className="text-sm font-medium text-white/80">Couleur du produit</h4>
      
      <div className="grid grid-cols-4 gap-3">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => onColorSelect(color)}
            className={cn(
              "group relative flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-200",
              "hover:bg-white/10 hover:scale-105",
              selectedColor === color
                ? "bg-white/20 ring-2 ring-winshirt-purple shadow-lg"
                : "bg-white/5"
            )}
          >
            {/* Aperçu couleur */}
            <div
              className={cn(
                "w-8 h-8 rounded-full border-2 border-white/20 shadow-md transition-transform duration-200",
                "group-hover:scale-110",
                selectedColor === color && "ring-2 ring-white/50 ring-offset-2 ring-offset-transparent"
              )}
              style={{ backgroundColor: color.color_code }}
            />
            
            {/* Nom de la couleur */}
            <span className={cn(
              "text-xs font-medium transition-colors duration-200",
              selectedColor === color
                ? "text-white"
                : "text-white/70 group-hover:text-white/90"
            )}>
              {color.name}
            </span>
            
            {/* Indicateur de sélection */}
            {selectedColor === color && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-winshirt-purple rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
