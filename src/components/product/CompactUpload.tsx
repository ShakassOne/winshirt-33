
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
        console.log('🔍 [CompactUpload] Analyse du SVG:', file.name);
        const analysis = await SVGAnalyzerService.analyzeSVG(file);
        setSvgAnalysis(analysis);
        
        if (!analysis.needsFix) {
          // SVG propre, procéder à l'upload direct
          onFileUpload(event);
          setSelectedFile(null);
        }
      } catch (error) {
        console.error('❌ [CompactUpload] Erreur lors de l\'analyse SVG:', error);
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
      console.log('🔧 [CompactUpload] Nettoyage SVG:', selectedFile.name);
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
      
      console.log('✅ [CompactUpload] SVG nettoyé et uploadé:', result.appliedFixes);
    } catch (error) {
      console.error('❌ [CompactUpload] Erreur lors du nettoyage SVG:', error);
    } finally {
      setIsProcessing(false);
    }
  };

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
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Correction SVG compacte */}
      {selectedFile && svgAnalysis?.needsFix && (
        <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <span className="text-orange-400 text-xs font-medium">SVG à corriger</span>
          </div>
          <p className="text-xs text-orange-300 mb-2">
            {svgAnalysis.issues.length} problème(s) détecté(s)
          </p>
          <Button
            onClick={handleSvgCleanup}
            disabled={isProcessing}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="sm"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-3 w-3 mr-2 border border-white border-t-transparent rounded-full"></div>
                Correction...
              </>
            ) : (
              <>
                <Wand2 className="h-3 w-3 mr-2" />
                Corriger
              </>
            )}
          </Button>
        </div>
      )}

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
