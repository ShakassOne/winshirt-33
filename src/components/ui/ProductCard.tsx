
import React from 'react';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating?: number;
  isCustomizable?: boolean;
  tickets?: number;
  color?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  category,
  price,
  image,
  rating = 5,
  isCustomizable = false,
  tickets = 0,
  color,
}) => {
  return (
    <Link to={`/products/${id}`} className="block">
      <GlassCard hover3D shine className="group relative overflow-hidden hover:shadow-lg glow-card">
        <div className="relative rounded-t-xl overflow-hidden">
          <AspectRatio ratio={1} className="w-full">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          {isCustomizable && (
            <div className="absolute top-2 left-2 bg-winshirt-purple/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
              Personnalisable
            </div>
          )}
          {tickets > 0 && (
            <div className="absolute top-2 right-2 bg-winshirt-blue/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
              {tickets} {tickets > 1 ? 'tickets' : 'ticket'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button size="sm" variant="secondary" className="flex items-center gap-1" asChild>
              <Link to={`/products/${id}`} onClick={(e) => e.stopPropagation()}>
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline-block">Ajouter</span>
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
              <Link to={`/products/${id}`} onClick={(e) => e.stopPropagation()}>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline-block">Détails</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-muted-foreground">{category}</p>
          <h3 className="font-medium mt-1 hover:text-winshirt-blue transition-colors">
            {name}
          </h3>
          
          <div className="mt-2 flex justify-between items-center">
            <p className="font-bold text-lg">{price.toFixed(2)} €</p>
            <div className="flex items-center">
              {Array(5).fill(0).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn(
                    "h-4 w-4",
                    i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  )}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          {color && (
            <div className="mt-2 flex items-center gap-1">
              <div 
                className="h-4 w-4 rounded-full border border-white/30" 
                style={{ backgroundColor: color }}
              />
              <div className="h-4 w-4 rounded-full bg-white border border-white/30" />
            </div>
          )}
        </div>
      </GlassCard>
    </Link>
  );
};

export default ProductCard;
