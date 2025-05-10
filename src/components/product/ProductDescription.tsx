
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProductDescriptionProps {
  product: any;
}

const ProductDescription = ({ product }: ProductDescriptionProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  // Get a shorter description for collapsed view
  const shortDescription = product.description?.slice(0, 150) + (product.description?.length > 150 ? '...' : '');
  
  return (
    <div className="space-y-4 mt-4">
      {/* Description */}
      <div>
        <h3 className="text-lg font-medium mb-2">Description du produit</h3>
        <p className="text-gray-700">
          {showFullDescription ? product.description : shortDescription}
        </p>
        
        {product.description && product.description.length > 150 && (
          <button 
            className="flex items-center text-sm font-medium text-blue-600 mt-2"
            onClick={() => setShowFullDescription(prev => !prev)}
          >
            {showFullDescription ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Voir moins
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Voir plus
              </>
            )}
          </button>
        )}
      </div>

      <Separator />
      
      {/* Accordion with additional details */}
      <Accordion type="single" collapsible className="w-full">
        {product.details && (
          <AccordionItem value="details">
            <AccordionTrigger>Détails</AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm max-w-none" 
                dangerouslySetInnerHTML={{ __html: product.details }} 
              />
            </AccordionContent>
          </AccordionItem>
        )}
        
        <AccordionItem value="shipping">
          <AccordionTrigger>Livraison</AccordionTrigger>
          <AccordionContent>
            <p>Livraison standard en 3-5 jours ouvrés.</p>
            <p className="mt-2">Livraison express disponible à un coût supplémentaire.</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="returns">
          <AccordionTrigger>Retours</AccordionTrigger>
          <AccordionContent>
            <p>Les retours sont acceptés sous 14 jours pour les produits non personnalisés.</p>
            <p className="mt-2">Les produits personnalisés ne peuvent pas être retournés sauf en cas de défaut de fabrication.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductDescription;
