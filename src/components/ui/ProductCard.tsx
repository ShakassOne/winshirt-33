
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { CartItem } from '@/types/supabase.types';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  hasTickets?: boolean;
  addToCart?: (product: CartItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  hasTickets = false,
  addToCart,
}) => {
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (addToCart) {
      const product: CartItem = {
        id: uuidv4(),
        productId: id,
        name,
        price,
        quantity: 1,
        image_url: image,
      };
      
      addToCart(product);
      toast.success('Produit ajouté au panier !');
    }
  };

  const handleClick = () => {
    navigate(`/products/${id}`);
  };

  return (
    <Card 
      className="overflow-hidden border-white/10 bg-black/30 backdrop-blur-sm transition-all hover:border-winshirt-purple/40"
      onClick={handleClick}
    >
      <AspectRatio ratio={1 / 1} className="bg-black/20">
        <img 
          src={image} 
          alt={name} 
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </AspectRatio>
      
      <CardContent className="p-4">
        <h3 className="font-medium truncate">{name}</h3>
        <div className="flex justify-between items-center mt-1">
          <p className="font-bold text-winshirt-blue">{price.toFixed(2)} €</p>
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
        {hasTickets && (
          <Badge className="mt-2 bg-gradient-to-r from-winshirt-purple to-winshirt-blue text-white">
            🎫 Tickets inclus
          </Badge>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" /> 
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
