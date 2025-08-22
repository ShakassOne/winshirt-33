import React from 'react';
import { MockupColor } from '@/types/mockup.types';
import { ProductColorSelector } from './ProductColorSelector';

interface ProductPanelProps {
  productName: string;
  productImageUrl?: string;
  mockup?: any;
  selectedMockupColor: MockupColor | null;
  onMockupColorChange: (color: MockupColor) => void;
  filteredMockupColors: MockupColor[];
  currentViewSide: 'front' | 'back';
  onViewSideChange: (side: 'front' | 'back') => void;
  hasTwoSides: boolean;
}

export const ProductPanel: React.FC<ProductPanelProps> = ({
  productName,
  productImageUrl,
  mockup,
  selectedMockupColor,
  onMockupColorChange,
  filteredMockupColors,
  currentViewSide,
  onViewSideChange,
  hasTwoSides
}) => {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black mb-2">Produit</h3>
        <p className="text-sm text-gray-600">{productName}</p>
      </div>

      {/* Product Image Preview */}
      {productImageUrl && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-black mb-3">Aperçu du produit</h4>
          <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
            <img 
              src={productImageUrl} 
              alt={productName}
              className="w-32 h-32 object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Mockup Information */}
      {mockup && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-black mb-3">Mockup</h4>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-black">{mockup.name}</p>
            <p className="text-xs text-gray-500 mt-1">Catégorie: {mockup.category}</p>
            {hasTwoSides ? (
              <p className="text-xs text-green-600 mt-1">✓ Recto-verso disponible</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">Recto uniquement</p>
            )}
          </div>
        </div>
      )}

      {/* Side Selection */}
      {hasTwoSides && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-black mb-3">Côté du produit</h4>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                currentViewSide === 'front'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
              onClick={() => onViewSideChange('front')}
            >
              Avant
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                currentViewSide === 'back'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
              onClick={() => onViewSideChange('back')}
            >
              Arrière
            </button>
          </div>
        </div>
      )}

      {/* Color Selection */}
      {filteredMockupColors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-black mb-3">Couleur du produit</h4>
            <ProductColorSelector
              colors={filteredMockupColors}
              selectedColor={selectedMockupColor}
              onColorSelect={onMockupColorChange}
            />
        </div>
      )}

      {/* Product Pricing Info */}
      {mockup && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-black mb-3">Tarifs d'impression</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">A6:</span>
              <span className="text-black font-medium">{mockup.price_a6}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">A5:</span>
              <span className="text-black font-medium">{mockup.price_a5}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">A4:</span>
              <span className="text-black font-medium">{mockup.price_a4}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">A3:</span>
              <span className="text-black font-medium">{mockup.price_a3}€</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Texte avant:</span>
              <span className="text-black font-medium">{mockup.text_price_front}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Texte arrière:</span>
              <span className="text-black font-medium">{mockup.text_price_back}€</span>
            </div>
          </div>
        </div>
      )}

      {/* Product Details */}
      <div className="text-xs text-gray-500">
        <p>Personnalisez votre produit en utilisant les outils disponibles dans les autres onglets.</p>
      </div>
    </div>
  );
};