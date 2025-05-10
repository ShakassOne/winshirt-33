
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductHeaderProps {
  name: string;
  price: number;
  isNew?: boolean;
}

const ProductHeader = ({ name, price, isNew }: ProductHeaderProps) => {
  return (
    <>
      {/* Bouton retour */}
      <Link to="/products" className="flex items-center gap-2 font-medium mb-8">
        <ArrowLeft className="h-5 w-5" />
        Retour aux produits
      </Link>

      {/* Product info */}
      <div>
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-xl font-semibold mt-2">
          {price.toFixed(2)}€
        </p>

        {isNew && (
          <Badge className="mt-2 bg-green-500 hover:bg-green-600">Nouveau</Badge>
        )}
      </div>
    </>
  );
};

export default ProductHeader;
