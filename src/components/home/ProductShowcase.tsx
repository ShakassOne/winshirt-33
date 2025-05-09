
import React from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from '../ui/ProductCard';
import { cn } from '@/lib/utils';

interface ProductShowcaseProps {
  className?: string;
}

// Sample product data
const PRODUCTS = [
  {
    id: 1,
    name: 'T-Shirt 3D Personnalisable',
    category: 'T-shirt',
    price: 19.00,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop',
    rating: 5,
    isCustomizable: true,
    tickets: 2,
    color: 'white'
  },
  {
    id: 2,
    name: 'T-Shirt Kratos',
    category: 'T-shirt',
    price: 19.00,
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=2070&auto=format&fit=crop',
    rating: 5
  },
  {
    id: 3,
    name: 'Sweat Shirt',
    category: 'Sweatshirt',
    price: 39.00,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2187&auto=format&fit=crop',
    rating: 5,
    isCustomizable: true,
    tickets: 1
  },
  {
    id: 4,
    name: 'Casquette Personnalisable',
    category: 'Casquette',
    price: 19.00,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=2070&auto=format&fit=crop',
    rating: 4,
    isCustomizable: true,
    tickets: 1
  }
];

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ className }) => {
  return (
    <section className={cn('py-20', className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Produits populaires</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Des vêtements personnalisables de qualité avec une chance de gagner des prix exceptionnels
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button className="bg-gradient-purple hover:opacity-90">
            Voir tous les produits
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
