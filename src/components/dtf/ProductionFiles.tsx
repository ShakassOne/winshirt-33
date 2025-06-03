
import React from 'react';
import { Download, Image, FileImage, FileText, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductionFilesProps {
  item: {
    mockup_recto_url?: string;
    mockup_verso_url?: string;
    visual_front_url?: string;
    visual_back_url?: string;
    mockup_url?: string;
    customization?: any;
    products?: {
      name: string;
      image_url?: string;
    };
  };
}

export const ProductionFiles: React.FC<ProductionFilesProps> = ({ item }) => {
  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCustomizationFile = () => {
    if (!item.customization) return;
    
    const customizationData = {
      customText: item.customization.customText || '',
      textColor: item.customization.textColor || '',
      textFont: item.customization.textFont || '',
      designName: item.customization.designName || '',
      designUrl: item.customization.designUrl || '',
      selectedSize: item.customization.selectedSize || '',
      selectedColor: item.customization.selectedColor || ''
    };
    
    const dataStr = JSON.stringify(customizationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    downloadFile(url, `${item.products?.name || 'produit'}_personnalisation.json`);
    URL.revokeObjectURL(url);
  };

  // Prioriser les mockups capturés (avec personnalisations)
  const rectoUrl = item.mockup_recto_url || item.visual_front_url;
  const versoUrl = item.mockup_verso_url || item.visual_back_url;
  
  const files = [
    {
      url: rectoUrl,
      label: 'Visuel recto (avec personnalisations)',
      filename: `${item.products?.name || 'produit'}_recto_personnalise.png`,
      icon: <Image className="h-4 w-4" />,
      type: 'mockup'
    },
    {
      url: versoUrl,
      label: 'Visuel verso (avec personnalisations)',
      filename: `${item.products?.name || 'produit'}_verso_personnalise.png`,
      icon: <Image className="h-4 w-4" />,
      type: 'mockup'
    },
    {
      url: item.mockup_url,
      label: 'Mockup produit vierge',
      filename: `${item.products?.name || 'produit'}_vierge.png`,
      icon: <FileImage className="h-4 w-4" />,
      type: 'template'
    }
  ].filter(file => file.url);

  // Éléments de personnalisation disponibles
  const hasCustomization = item.customization && (
    item.customization.customText || 
    item.customization.designUrl || 
    item.customization.designName
  );

  return (
    <Card className="glass-card mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="h-5 w-5 text-orange-400" />
          Fichiers de production
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fichiers visuels */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Fichiers visuels</h4>
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2">
                  {file.icon}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{file.label}</span>
                    {file.type === 'mockup' && (
                      <Badge variant="outline" className="text-xs w-fit mt-1 bg-green-500/20 text-green-400">
                        Personnalisé
                      </Badge>
                    )}
                    {file.type === 'template' && (
                      <Badge variant="outline" className="text-xs w-fit mt-1 bg-gray-500/20 text-gray-400">
                        Template
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(file.url, '_blank')}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                  >
                    <Image className="h-4 w-4 mr-1" />
                    Aperçu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(file.url!, file.filename)}
                    className="text-orange-400 hover:text-orange-300 border-orange-400/50 hover:border-orange-300/50 hover:bg-orange-400/10"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Données de personnalisation */}
        {hasCustomization && (
          <div className="space-y-3 border-t border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-300">Données de personnalisation</h4>
            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Fichier de personnalisation</span>
                    <span className="text-xs text-gray-400">
                      Contient : textes, couleurs, polices, designs choisis
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.customization.customText && (
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Texte
                        </Badge>
                      )}
                      {item.customization.textColor && (
                        <Badge variant="outline" className="text-xs">
                          <Palette className="h-3 w-3 mr-1" />
                          Couleur
                        </Badge>
                      )}
                      {item.customization.designName && (
                        <Badge variant="outline" className="text-xs">
                          <Image className="h-3 w-3 mr-1" />
                          Design
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateCustomizationFile}
                  className="text-purple-400 hover:text-purple-300 border-purple-400/50 hover:border-purple-300/50 hover:bg-purple-400/10"
                >
                  <Download className="h-4 w-4 mr-1" />
                  JSON
                </Button>
              </div>
            </div>
          </div>
        )}

        {files.length === 0 && !hasCustomization && (
          <div className="text-center py-8 text-gray-500">
            <FileImage className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun fichier de production disponible</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
