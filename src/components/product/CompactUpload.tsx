
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Wand2 } from 'lucide-react';
import { Design } from '@/types/supabase.types';

interface CompactUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;
  currentDesign: Design | null;
}

export const CompactUpload: React.FC<CompactUploadProps> = ({
  onFileUpload,
  onRemoveBackground,
  isRemovingBackground,
  currentDesign
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canRemoveBackground = currentDesign && 
    (currentDesign.category === 'ai-generated' || currentDesign.category === 'ai-generated-cleaned');

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-white text-sm">Import rapide</Label>
        <div className="mt-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-gradient-to-r from-winshirt-purple/20 to-winshirt-blue/20 border-white/20 text-white"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choisir une image
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml,.svg"
            onChange={onFileUpload}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="text-center p-2 bg-white/5 rounded border border-white/10">
          <div className="text-xs text-white/60">Formats</div>
          <div className="text-xs text-white">JPG, PNG, SVG</div>
        </div>
        <div className="text-center p-2 bg-white/5 rounded border border-white/10">
          <div className="text-xs text-white/60">Taille max</div>
          <div className="text-xs text-white">10 MB</div>
        </div>
      </div>

      {canRemoveBackground && (
        <div>
          <Label className="text-white text-sm">Amélioration</Label>
          <Button
            onClick={onRemoveBackground}
            disabled={isRemovingBackground}
            variant="outline"
            className="w-full mt-2 bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30 text-white"
            size="sm"
          >
            {isRemovingBackground ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Traitement...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Supprimer le fond
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
