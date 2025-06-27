
import logger from '@/utils/logger';
import React from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from '../ui/ProductCard';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useProductsUnified } from '@/hooks/useProductsUnified';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import UnlockButton from '@/components/ui/UnlockButton';
import { RefreshCw } from 'lucide-react';

interface ProductShowcaseProps {
  className?: string;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ className }) => {
  const { data: products, isLoading, error, refetch } = useProductsUnified();

  logger.log('[ProductShowcase] Rendering with products count:', products?.length || 0);

  if (isLoading) {
    return (
      <section className={cn('py-20', className)}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <LoadingSpinner size="lg" text="Chargement des produits..." />
            <div className="mt-4 flex gap-2 justify-center">
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
              <UnlockButton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn('py-20', className)}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500 mb-4">Une erreur est survenue lors du chargement des produits.</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
              <UnlockButton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className={cn('py-20', className)}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-4">Aucun produit disponible pour le moment.</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <UnlockButton />
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          {products.slice(0, 4).map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              price={product.price}
              image={product.image_url}
              rating={5}
              isCustomizable={product.is_customizable}
              tickets={product.tickets_offered}
              color={product.color || undefined}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button className="bg-gradient-purple hover:opacity-90" asChild>
            <Link to="/products">
              Voir tous les produits
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
