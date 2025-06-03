
import React from 'react';
import { Download, Image, FileImage, FileText, Palette, Zap } from 'lucide-react';
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
      selectedColor: item.customization.selectedColor || '',
      hdRectoUrl: item.customization.hdRectoUrl || '',
      hdVersoUrl: item.customization.hdVersoUrl || ''
    };
    
    const dataStr = JSON.stringify(customizationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    downloadFile(url, `${item.products?.name || 'produit'}_personnalisation.json`);
    URL.revokeObjectURL(url);
  };

  // URLs des fichiers HD prioritaires pour la production
  const hdRectoUrl = item.customization?.hdRectoUrl;
  const hdVersoUrl = item.customization?.hdVersoUrl;
  
  // Fallback vers les mockups classiques
  const rectoUrl = hdRectoUrl || item.mockup_recto_url || item.visual_front_url;
  const versoUrl = hdVersoUrl || item.mockup_verso_url || item.visual_back_url;
  
  const hdFiles = [
    {
      url: hdRectoUrl,
      label: 'Fichier HD Recto (Production DTF)',
      filename: `${item.products?.name || 'produit'}_HD_recto.png`,
      icon: <Zap className="h-4 w-4" />,
      type: 'hd-production',
      priority: true
    },
    {
      url: hdVersoUrl,
      label: 'Fichier HD Verso (Production DTF)',
      filename: `${item.products?.name || 'produit'}_HD_verso.png`,
      icon: <Zap className="h-4 w-4" />,
      type: 'hd-production',
      priority: true
    }
  ].filter(file => file.url);

  const mockupFiles = [
    {
      url: rectoUrl,
      label: 'Visuel recto (aperçu avec produit)',
      filename: `${item.products?.name || 'produit'}_recto_apercu.png`,
      icon: <Image className="h-4 w-4" />,
      type: 'mockup',
      priority: false
    },
    {
      url: versoUrl,
      label: 'Visuel verso (aperçu avec produit)',
      filename: `${item.products?.name || 'produit'}_verso_apercu.png`,
      icon: <Image className="h-4 w-4" />,
      type: 'mockup',
      priority: false
    },
    {
      url: item.mockup_url,
      label: 'Mockup produit vierge',
      filename: `${item.products?.name || 'produit'}_vierge.png`,
      icon: <FileImage className="h-4 w-4" />,
      type: 'template',
      priority: false
    }
  ].filter(file => file.url && !hdFiles.find(hd => hd.url === file.url));

  const allFiles = [...hdFiles, ...mockupFiles];

  // Éléments de personnalisation disponibles
  const hasCustomization = item.customization && (
    item.customization.customText || 
    item.customization.designUrl || 
    item.customization.designName ||
    hdRectoUrl ||
    hdVersoUrl
  );

  return (
    <Card className="glass-card mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="h-5 w-5 text-orange-400" />
          Fichiers de production
          {hdFiles.length > 0 && (
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              <Zap className="h-3 w-3 mr-1" />
              HD Prêt
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fichiers HD prioritaires */}
        {hdFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-green-400 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Fichiers Production DTF (Haute Résolution)
            </h4>
            {hdFiles.map((file, index) => (
              <div key={index} className="flex justify-between items-center bg-green-900/20 p-3 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-2">
                  {file.icon}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{file.label}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                        <Zap className="h-3 w-3 mr-1" />
                        HD 3000x4000px
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-400 border-purple-500/30">
                        DTF Ready
                      </Badge>
                    </div>
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
                    className="text-green-400 hover:text-green-300 border-green-400/50 hover:border-green-300/50 hover:bg-green-400/10"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger HD
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fichiers mockup (aperçu) */}
        {mockupFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Fichiers aperçu (avec produit)</h4>
            {mockupFiles.map((file, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2">
                  {file.icon}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{file.label}</span>
                    <Badge variant="outline" className="text-xs w-fit mt-1 bg-gray-500/20 text-gray-400">
                      {file.type === 'template' ? 'Template' : 'Aperçu'}
                    </Badge>
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
                      Contient : textes, couleurs, polices, designs, URLs HD
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
                      {(hdRectoUrl || hdVersoUrl) && (
                        <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400">
                          <Zap className="h-3 w-3 mr-1" />
                          HD URLs
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

        {allFiles.length === 0 && !hasCustomization && (
          <div className="text-center py-8 text-gray-500">
            <FileImage className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun fichier de production disponible</p>
            <p className="text-xs text-gray-600 mt-1">
              Les fichiers HD seront générés lors de la validation de la commande
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
