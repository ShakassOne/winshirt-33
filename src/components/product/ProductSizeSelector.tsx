
import React from 'react';

interface ProductSizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
}

const ProductSizeSelector = ({ sizes, selectedSize, onSizeSelect }: ProductSizeSelectorProps) => {
  if (!sizes || sizes.length === 0) return null;
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Taille</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            className={`px-4 py-2 rounded border ${
              selectedSize === size
                ? 'bg-black text-white'
                : 'border-gray-300'
            }`}
            onClick={() => onSizeSelect(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSizeSelector;
