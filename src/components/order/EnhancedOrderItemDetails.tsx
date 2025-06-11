
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProductionFiles } from '@/components/dtf/ProductionFiles';
import { extractHDUrlsFromCustomization } from '@/services/hdCapture.service';

interface EnhancedOrderItemDetailsProps {
  item: any; // Type étendu pour supporter différentes structures
}

export const EnhancedOrderItemDetails: React.FC<EnhancedOrderItemDetailsProps> = ({ item }) => {
  // Extraire les URLs HD
  const hdUrls = extractHDUrlsFromCustomization(item.customization);
  const hasRectoMockup = item.mockup_recto_url || item.visual_front_url || hdUrls.hdRectoUrl;
  const hasVersoMockup = item.mockup_verso_url || item.visual_back_url || hdUrls.hdVersoUrl;
  
  const customization = typeof item.customization === 'string' 
    ? JSON.parse(item.customization) 
    : item.customization;

  // Analyser la structure de personnalisation
  const hasNewStructure = customization?.frontDesign || customization?.backDesign || customization?.frontText || customization?.backText;
  const hasOldStructure = customization?.customText || customization?.designName;

  const renderCustomizationDetails = () => {
    if (!customization) return null;

    if (hasNewStructure) {
      return (
        <div className="space-y-4">
          {/* Front Design */}
          {customization.frontDesign && (
            <div>
              <h5 className="text-sm font-medium mb-2 text-blue-400">Design Recto</h5>
              <div className="space-y-2 bg-gray-800/30 p-3 rounded">
                <div className="flex justify-between">
                  <span className="text-gray-400">Nom:</span>
                  <Badge variant="outline">{customization.frontDesign.designName}</Badge>
                </div>
                {customization.frontDesign.printSize && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Taille:</span>
                    <Badge variant="outline">{customization.frontDesign.printSize}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Back Design */}
          {customization.backDesign && (
            <div>
              <h5 className="text-sm font-medium mb-2 text-purple-400">Design Verso</h5>
              <div className="space-y-2 bg-gray-800/30 p-3 rounded">
                <div className="flex justify-between">
                  <span className="text-gray-400">Nom:</span>
                  <Badge variant="outline">{customization.backDesign.designName}</Badge>
                </div>
                {customization.backDesign.printSize && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Taille:</span>
                    <Badge variant="outline">{customization.backDesign.printSize}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Front Text */}
          {customization.frontText && (
            <div>
              <h5 className="text-sm font-medium mb-2 text-green-400">Texte Recto</h5>
              <div className="space-y-2 bg-gray-800/30 p-3 rounded">
                <div>
                  <span className="text-gray-400 block">Contenu:</span>
                  <span className="text-sm bg-gray-700 p-2 rounded block mt-1">
                    {customization.frontText.content}
                  </span>
                </div>
                {customization.frontText.color && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Couleur:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-600"
                        style={{ backgroundColor: customization.frontText.color }}
                      />
                      <span className="text-sm">{customization.frontText.color}</span>
                    </div>
                  </div>
                )}
                {customization.frontText.font && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Police:</span>
                    <Badge variant="outline">{customization.frontText.font}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Back Text */}
          {customization.backText && (
            <div>
              <h5 className="text-sm font-medium mb-2 text-orange-400">Texte Verso</h5>
              <div className="space-y-2 bg-gray-800/30 p-3 rounded">
                <div>
                  <span className="text-gray-400 block">Contenu:</span>
                  <span className="text-sm bg-gray-700 p-2 rounded block mt-1">
                    {customization.backText.content}
                  </span>
                </div>
                {customization.backText.color && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Couleur:</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-600"
                        style={{ backgroundColor: customization.backText.color }}
                      />
                      <span className="text-sm">{customization.backText.color}</span>
                    </div>
                  </div>
                )}
                {customization.backText.font && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Police:</span>
                    <Badge variant="outline">{customization.backText.font}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Structure ancienne
    if (hasOldStructure) {
      return (
        <div className="space-y-2">
          {customization.customText && (
            <div>
              <span className="text-gray-400 block">Texte recto:</span>
              <span className="text-sm bg-gray-800 p-2 rounded block mt-1">
                {customization.customText}
              </span>
            </div>
          )}
          
          {customization.designName && (
            <div className="flex justify-between">
              <span className="text-gray-400">Design:</span>
              <Badge variant="outline">{customization.designName}</Badge>
            </div>
          )}
          
          {customization.textColor && (
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
          
          {customization.textFont && (
            <div className="flex justify-between">
              <span className="text-gray-400">Police:</span>
              <Badge variant="outline">{customization.textFont}</Badge>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="glass-card mb-6">
      <CardContent className="p-6">
        {/* Visuels des mockups avec priorité HD */}
        {(hasRectoMockup || hasVersoMockup) && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Visuels du produit</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hasRectoMockup && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h5 className="text-sm font-medium">Recto</h5>
                    {hdUrls.hdRectoUrl && (
                      <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400">
                        HD
                      </Badge>
                    )}
                  </div>
                  <img
                    src={hdUrls.hdRectoUrl || item.visual_front_url || item.mockup_recto_url}
                    alt="Mockup Recto"
                    className="w-full max-w-[600px] h-auto rounded-lg border border-gray-700"
                  />
                </div>
              )}
              {hasVersoMockup && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h5 className="text-sm font-medium">Verso</h5>
                    {hdUrls.hdVersoUrl && (
                      <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400">
                        HD
                      </Badge>
                    )}
                  </div>
                  <img
                    src={hdUrls.hdVersoUrl || item.visual_back_url || item.mockup_verso_url}
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
            {renderCustomizationDetails()}
            
            {item.lottery_name && (
              <div className="flex justify-between mt-4">
                <span className="text-gray-400">Loterie:</span>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                  {item.lottery_name}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Fichiers de production */}
        <ProductionFiles item={item} />
      </CardContent>
    </Card>
  );
};
