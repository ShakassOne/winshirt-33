
import React from 'react';
import { ExtendedOrderItem } from '@/types/supabase.types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProductionFiles } from '@/components/dtf/ProductionFiles';

interface OrderItemDetailsProps {
  item: ExtendedOrderItem & {
    visual_front_url?: string;
    visual_back_url?: string;
    mockup_url?: string;
    mockup_recto_url?: string;
    mockup_verso_url?: string;
  };
}

export const OrderItemDetails: React.FC<OrderItemDetailsProps> = ({ item }) => {
  const hasRectoMockup = item.mockup_recto_url || item.visual_front_url;
  const hasVersoMockup = item.mockup_verso_url || item.visual_back_url;
  const customization = typeof item.customization === 'string' 
    ? JSON.parse(item.customization) 
    : item.customization;

  return (
    <Card className="glass-card mb-6">
      <CardContent className="p-6">
        {/* Visuels des mockups */}
        {(hasRectoMockup || hasVersoMockup) && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Visuels du produit</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasRectoMockup && (
                <div className="text-center">
                  <h5 className="text-sm font-medium mb-2">Recto</h5>
                  <img
                    src={item.visual_front_url || item.mockup_recto_url}
                    alt="Mockup Recto"
                    className="w-full max-w-[600px] h-auto rounded-lg border border-gray-700"
                  />
                </div>
              )}
              {hasVersoMockup && (
                <div className="text-center">
                  <h5 className="text-sm font-medium mb-2">Verso</h5>
                  <img
                    src={item.visual_back_url || item.mockup_verso_url}
                    alt="Mockup Verso"
                    className="w-full max-w-[600px] h-auto rounded-lg border border-gray-700"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Détails du produit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Détails du produit</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Produit:</span>
                <span className="font-medium">{item.products?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quantité:</span>
                <span>{item.quantity}x</span>
              </div>
              {item.selected_size && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Taille:</span>
                  <Badge variant="outline">{item.selected_size}</Badge>
                </div>
              )}
              {item.selected_color && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Couleur:</span>
                  <Badge variant="outline">{item.selected_color}</Badge>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Prix unitaire:</span>
                <span>{parseFloat(item.price as any).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{(parseFloat(item.price as any) * item.quantity).toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Personnalisation */}
          <div>
            <h4 className="font-semibold mb-3">Personnalisation</h4>
            <div className="space-y-2">
              {customization?.customText && (
                <div>
                  <span className="text-gray-400 block">Texte recto:</span>
                  <span className="text-sm bg-gray-800 p-2 rounded block mt-1">
                    {customization.customText}
                  </span>
                </div>
              )}
              
              {customization?.designName && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Design:</span>
                  <Badge variant="outline">{customization.designName}</Badge>
                </div>
              )}
              
              {customization?.textColor && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Couleur texte:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border border-gray-600"
                      style={{ backgroundColor: customization.textColor }}
                    />
                    <span className="text-sm">{customization.textColor}</span>
                  </div>
                </div>
              )}
              
              {customization?.textFont && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Police:</span>
                  <Badge variant="outline">{customization.textFont}</Badge>
                </div>
              )}
              
              {item.lottery_name && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Loterie:</span>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                    {item.lottery_name}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fichiers de production */}
        <ProductionFiles item={item} />
      </CardContent>
    </Card>
  );
};
