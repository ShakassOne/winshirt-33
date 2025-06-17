
import React from 'react';
import { Info, Zap, Image } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ProductionFilesInfo: React.FC = () => {
  return (
    <Alert className="border-green-500/30 bg-green-500/10">
      <Zap className="h-4 w-4 text-green-400" />
      <AlertDescription className="text-green-300">
        <div className="flex items-start gap-2">
          <div>
            <strong>Nouveau système de production optimisé !</strong>
            <p className="text-sm mt-1 text-green-200">
              Les fichiers de production haute définition sont maintenant générés automatiquement côté serveur 
              pour une qualité et une fiabilité maximales. Plus de problèmes de capture !
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <Image className="h-3 w-3" />
                <span>Aperçus avec produit</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>Fichiers HD 3500x3500px</span>
              </div>
            </div>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
