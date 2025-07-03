
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { Design } from '@/types/supabase.types';

interface UploadDesignProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveBackground: (tolerance?: number) => void;
  isRemovingBackground: boolean;
  currentDesign: Design | null;
}

export const UploadDesign: React.FC<UploadDesignProps> = ({
  onFileUpload,
  onRemoveBackground,
  isRemovingBackground,
  currentDesign
}) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Téléchargez votre design
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Formats acceptés : PNG, JPG, SVG (max 10MB)
          </p>
          
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={onFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Upload className="h-4 w-4 mr-2" />
              Choisir un fichier
            </Button>
          </div>
        </div>
      </Card>

      {currentDesign && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">Design actuel</h4>
          <div className="flex items-center gap-4">
            <img
              src={currentDesign.image_url}
              alt={currentDesign.name}
              className="w-16 h-16 object-cover rounded border"
            />
            <div className="flex-1">
              <p className="font-medium">{currentDesign.name}</p>
              <p className="text-sm text-gray-600">Design uploadé</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemoveBackground(32)}
              disabled={isRemovingBackground}
              className="flex items-center gap-2"
            >
              {isRemovingBackground ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isRemovingBackground ? 'Suppression...' : 'Supprimer fond'}
            </Button>
          </div>
        </Card>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">💡 Conseils</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Utilisez des images haute résolution (300 DPI minimum)</li>
          <li>• Les designs avec fond transparent sont recommandés</li>
          <li>• Évitez les images trop complexes pour un meilleur rendu</li>
        </ul>
      </div>
    </div>
  );
};
