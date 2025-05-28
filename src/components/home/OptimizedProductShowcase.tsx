
import React from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from '../ui/ProductCard';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useProductsQuery } from '@/hooks/useProductsQuery';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedProductShowcaseProps {
  className?: string;
}

// Produits statiques pour éviter le blocage du LCP
const FEATURED_PRODUCTS = [
  {
    id: "89f13ece-92b9-4bcc-84e7-f57e12b1a2ab",
    name: "T-Shirt 3D",
    category: "T-shirts",
    price: 19.00,
    image_url: "https://winshirt.fr/wp-content/uploads/2025/05/White-Tshirt-Recto.png",
    is_customizable: true,
    tickets_offered: 1,
    color: "Blanc"
  },
  {
    id: "624dd85d-1531-461a-9a2b-724ec6b432be",
    name: "T-Shirt Custom",
    category: "T-shirts", 
    price: 19.00,
    image_url: "https://winshirt.fr/wp-content/uploads/2025/04/White-Male-Tshirt.H01.2k.png",
    is_customizable: true,
    tickets_offered: 1,
    color: "Blanc"
  },
  {
    id: "ced28168-ac21-47a9-aab6-c09bdb0d1550",
    name: "Sweat Shirt",
    category: "Sweatshirt",
    price: 39.00,
    image_url: "https://winshirt.fr/wp-content/uploads/2025/05/Hoodies-Shakass-Com.png",
    is_customizable: false,
    tickets_offered: 1,
    color: "gray"
  },
  {
    id: "29e3d753-fc6e-4f67-a394-f214a2ea65cc",
    name: "BodyWarmer",
    category: "BodyWarmer",
    price: 49.00,
    image_url: "https://winshirt.fr/images/ia-68341e6c3facd-BodyWarmer Recto.png",
    is_customizable: true,
    tickets_offered: 2,
    color: "Blanc"
  }
];

const ProductSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-48 w-full rounded-lg bg-white/5" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4 bg-white/5" />
      <Skeleton className="h-4 w-1/2 bg-white/5" />
    </div>
  </div>
);

const OptimizedProductShowcase: React.FC<OptimizedProductShowcaseProps> = ({ className }) => {
  const { data: liveProducts, isLoading } = useProductsQuery();

  // Utiliser les produits en direct s'ils sont disponibles, sinon les produits statiques
  const productsToShow = liveProducts?.length ? liveProducts.slice(0, 4) : FEATURED_PRODUCTS;

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
          {isLoading ? (
            // Skeleton loader pendant le chargement
            Array.from({ length: 4 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : (
            productsToShow.map((product) => (
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
            ))
          )}
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

export default OptimizedProductShowcase;
