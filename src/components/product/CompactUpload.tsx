
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, FileImage, Eraser, Sparkles } from 'lucide-react';
import { Design } from '@/types/supabase.types';

interface CompactUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;
  currentDesign?: Design | null;
}

export const CompactUpload: React.FC<CompactUploadProps> = ({
  onFileUpload,
  onRemoveBackground,
  isRemovingBackground,
  currentDesign
}) => {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-white text-xs mb-2 block">Upload d'image</Label>
        <div className="relative">
          <input
            type="file"
            accept="image/*,.svg"
            onChange={onFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-upload"
          />
          <Button
            variant="outline"
            className="w-full h-20 border-dashed border-white/30 hover:border-white/50 bg-white/5 hover:bg-white/10 flex flex-col items-center gap-2"
            asChild
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-6 w-6 text-white/70" />
              <span className="text-xs text-white/70">
                Cliquez pour uploader
              </span>
            </label>
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-white/50 text-center">
        Formats supportés: JPG, PNG, SVG
      </div>

      {currentDesign && (
        <div className="flex items-center gap-2 p-2 bg-white/5 rounded border border-white/10">
          <FileImage className="h-4 w-4 text-green-400" />
          <span className="text-xs text-white truncate flex-1">
            {currentDesign.name}
          </span>
        </div>
      )}

      {currentDesign && (
        <div className="pt-2 border-t border-white/10">
          <Button
            variant="outline"
            onClick={onRemoveBackground}
            disabled={isRemovingBackground}
            className="w-full border-white/30 hover:bg-purple-500/20 hover:border-purple-500/50"
          >
            {isRemovingBackground ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Suppression IA en cours...
              </>
            ) : (
              <>
                <Eraser className="mr-2 h-4 w-4" />
                Supprimer le fond (IA)
              </>
            )}
          </Button>
          <p className="text-xs text-white/50 mt-2 text-center">
            Suppression intelligente avec IA
          </p>
        </div>
      )}
    </div>
  );
};
