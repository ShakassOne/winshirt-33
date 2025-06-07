
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Wand2, AlertTriangle } from 'lucide-react';
import { Design } from '@/types/supabase.types';
import { SVGAnalysisResult, SVGAnalyzerService } from '@/services/svgAnalyzer.service';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [svgAnalysis, setSvgAnalysis] = useState<SVGAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canRemoveBackground = currentDesign && 
    (currentDesign.category === 'ai-generated' || currentDesign.category === 'ai-generated-cleaned');

  const isSvgFile = (file: File) => {
    return file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setSvgAnalysis(null);

    // Si c'est un SVG, analyser automatiquement
    if (isSvgFile(file)) {
      try {
        const analysis = await SVGAnalyzerService.analyzeSVG(file);
        setSvgAnalysis(analysis);
        
        if (!analysis.needsFix) {
          // SVG propre, procéder à l'upload direct
          onFileUpload(event);
          setSelectedFile(null);
        }
      } catch (error) {
        console.error('Erreur lors de l\'analyse SVG:', error);
        // En cas d'erreur d'analyse, procéder à l'upload normal
        onFileUpload(event);
        setSelectedFile(null);
      }
    } else {
      // Fichier non-SVG, upload direct
      onFileUpload(event);
      setSelectedFile(null);
    }
  };

  const handleSvgCleanup = async () => {
    if (!selectedFile || !svgAnalysis) return;

    setIsProcessing(true);
    try {
      const result = await SVGAnalyzerService.cleanSVG(selectedFile);
      const cleanedFile = SVGAnalyzerService.createCleanedFile(result.cleanedBlob, selectedFile.name);
      
      // Créer un événement synthetic pour le fichier nettoyé
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(cleanedFile);
      
      const syntheticEvent = {
        target: {
          files: dataTransfer.files
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      // Procéder à l'upload du fichier nettoyé
      onFileUpload(syntheticEvent);
      
      // Reset de l'état
      setSelectedFile(null);
      setSvgAnalysis(null);
    } catch (error) {
      console.error('Erreur lors du nettoyage SVG:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <Label className="text-white text-xs">Import rapide</Label>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full mt-1 bg-gradient-to-r from-winshirt-purple/20 to-winshirt-blue/20 border-white/20 text-white h-6 text-xs"
          size="sm"
        >
          <Upload className="h-3 w-3 mr-1" />
          Choisir
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml,.svg"
          onChange={handleFileSelect}
        />
      </div>

      {/* Correction SVG ultra-compacte */}
      {selectedFile && svgAnalysis?.needsFix && (
        <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded">
          <div className="flex items-center gap-1 mb-1">
            <AlertTriangle className="h-3 w-3 text-orange-400" />
            <span className="text-orange-400 text-xs">SVG à corriger</span>
          </div>
          <Button
            onClick={handleSvgCleanup}
            disabled={isProcessing}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-6 text-xs"
            size="sm"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-2 w-2 mr-1 border border-white border-t-transparent rounded-full"></div>
                Correction...
              </>
            ) : (
              <>
                <Wand2 className="h-3 w-3 mr-1" />
                Corriger
              </>
            )}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className="text-center p-1 bg-white/5 rounded border border-white/10">
          <div className="text-xs text-white/60">Formats</div>
          <div className="text-xs text-white">JPG, PNG, SVG</div>
        </div>
        <div className="text-center p-1 bg-white/5 rounded border border-white/10">
          <div className="text-xs text-white/60">Max</div>
          <div className="text-xs text-white">10 MB</div>
        </div>
      </div>

      {canRemoveBackground && (
        <Button
          onClick={onRemoveBackground}
          disabled={isRemovingBackground}
          variant="outline"
          className="w-full bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30 text-white h-6 text-xs"
          size="sm"
        >
          {isRemovingBackground ? (
            <>
              <div className="animate-spin h-3 w-3 mr-1 border border-white border-t-transparent rounded-full"></div>
              Traitement...
            </>
          ) : (
            <>
              <Wand2 className="h-3 w-3 mr-1" />
              Supprimer fond
            </>
          )}
        </Button>
      )}
    </div>
  );
};
