
import React from 'react';
import { Download, Image, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductionFilesProps {
  item: {
    visual_front_url?: string;
    visual_back_url?: string;
    mockup_url?: string;
    mockup_recto_url?: string;
    mockup_verso_url?: string;
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

  const files = [
    {
      url: item.visual_front_url || item.mockup_recto_url,
      label: 'Visuel recto',
      filename: `${item.products?.name || 'produit'}_recto.png`,
      icon: <Image className="h-4 w-4" />
    },
    {
      url: item.visual_back_url || item.mockup_verso_url,
      label: 'Visuel verso',
      filename: `${item.products?.name || 'produit'}_verso.png`,
      icon: <Image className="h-4 w-4" />
    },
    {
      url: item.mockup_url,
      label: 'Mockup produit',
      filename: `${item.products?.name || 'produit'}_mockup.png`,
      icon: <FileImage className="h-4 w-4" />
    }
  ].filter(file => file.url);

  if (files.length === 0) {
    return null;
  }

  return (
    <Card className="glass-card mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="h-5 w-5 text-orange-400" />
          Fichiers de production
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {files.map((file, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2">
              {file.icon}
              <span className="text-sm font-medium">{file.label}</span>
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
      </CardContent>
    </Card>
  );
};
