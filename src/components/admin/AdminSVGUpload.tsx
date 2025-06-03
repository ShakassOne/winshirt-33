
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, AlertTriangle, CheckCircle, Wand2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SVGAnalysisResult, SVGCleanupResult, SVGAnalyzerService } from '@/services/svgAnalyzer.service';
import { useToast } from '@/hooks/use-toast';
import { uploadToExternalScript } from '@/services/api.service';

interface AdminSVGUploadProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AdminSVGUpload: React.FC<AdminSVGUploadProps> = ({
  label,
  value,
  onChange,
  placeholder = "URL de l'image",
  className
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [svgAnalysis, setSvgAnalysis] = useState<SVGAnalysisResult | null>(null);
  const [cleanupResult, setCleanupResult] = useState<SVGCleanupResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [svgPreview, setSvgPreview] = useState<string>('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSvg = value && value.toLowerCase().endsWith('.svg');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setSvgAnalysis(null);
    setCleanupResult(null);
    setSvgPreview('');

    // Si c'est un SVG, analyser automatiquement
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      setIsAnalyzing(true);
      try {
        console.log('🔍 [AdminSVGUpload] Analyse du SVG:', file.name);
        
        // Lire le contenu pour l'aperçu
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setSvgPreview(content);
        };
        reader.readAsText(file);
        
        const analysis = await SVGAnalyzerService.analyzeSVG(file);
        setSvgAnalysis(analysis);
        
        if (!analysis.needsFix) {
          // SVG propre, proposer l'upload direct
          toast({
            title: "SVG propre détecté",
            description: "Ce fichier SVG est déjà optimisé et prêt à être utilisé",
          });
        } else {
          toast({
            title: "SVG à corriger détecté",
            description: `${analysis.issues.length} problème(s) détecté(s). Correction recommandée.`,
            variant: "default"
          });
        }
      } catch (error) {
        console.error('❌ [AdminSVGUpload] Erreur lors de l\'analyse SVG:', error);
        toast({
          title: "Erreur d'analyse",
          description: "Impossible d'analyser le SVG. Upload normal disponible.",
          variant: "destructive"
        });
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // Fichier non-SVG, upload direct possible
      handleDirectUpload(file);
    }
  };

  const handleSvgCleanup = async () => {
    if (!selectedFile || !svgAnalysis) return;

    setIsProcessing(true);
    try {
      console.log('🔧 [AdminSVGUpload] Nettoyage SVG:', selectedFile.name);
      const result = await SVGAnalyzerService.cleanSVG(selectedFile);
      
      setCleanupResult(result);
      
      // Mettre à jour l'aperçu avec le SVG nettoyé
      setSvgPreview(result.cleanedSvg);
      
      console.log('✅ [AdminSVGUpload] SVG nettoyé:', result.appliedFixes);
      toast({
        title: "SVG corrigé avec succès",
        description: `${result.appliedFixes.length} correction(s) appliquée(s)`,
      });
    } catch (error) {
      console.error('❌ [AdminSVGUpload] Erreur lors du nettoyage SVG:', error);
      toast({
        title: "Erreur de correction",
        description: "Impossible de corriger le SVG automatiquement",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectUpload = async (fileToUpload: File) => {
    setIsUploading(true);
    try {
      console.log('📁 [AdminSVGUpload] Upload vers le serveur...');
      const url = await uploadToExternalScript(fileToUpload);
      
      onChange(url);
      
      // Reset de l'état
      setSelectedFile(null);
      setSvgAnalysis(null);
      setCleanupResult(null);
      setSvgPreview('');
      
      toast({
        title: "Upload réussi",
        description: "Le fichier a été téléchargé avec succès",
      });
    } catch (error) {
      console.error('❌ [AdminSVGUpload] Erreur upload:', error);
      toast({
        title: "Erreur d'upload",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadProcessedFile = async () => {
    if (!cleanupResult) return;
    
    const cleanedFile = SVGAnalyzerService.createCleanedFile(cleanupResult.cleanedBlob, selectedFile?.name || 'cleaned.svg');
    await handleDirectUpload(cleanedFile);
  };

  const getSvgStatusBadge = () => {
    if (cleanupResult) {
      return (
        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
          <CheckCircle className="h-3 w-3 mr-1" />
          SVG Corrigé
        </Badge>
      );
    }
    
    if (!svgAnalysis) return null;
    
    if (svgAnalysis.needsFix) {
      return (
        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
          <AlertTriangle className="h-3 w-3 mr-1" />
          SVG à corriger
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
        <CheckCircle className="h-3 w-3 mr-1" />
        SVG Optimisé
      </Badge>
    );
  };

  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="space-y-3 mt-2">
        {/* Input URL + Upload */}
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isProcessing}
          >
            <Upload className="h-4 w-4 mr-1" />
            {isUploading ? 'Upload...' : 'Choisir'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.svg"
            onChange={handleFileSelect}
          />
        </div>

        {/* Analyse en cours */}
        {isAnalyzing && (
          <Card className="p-3 bg-blue-500/10 border-blue-500/30">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
              <span className="text-blue-400 text-sm">Analyse du SVG en cours...</span>
            </div>
          </Card>
        )}

        {/* Résultat de l'analyse - SVG à corriger */}
        {selectedFile && svgAnalysis?.needsFix && !cleanupResult && (
          <Card className="p-4 bg-orange-500/10 border-orange-500/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <span className="text-orange-400 font-medium">SVG à corriger</span>
              {getSvgStatusBadge()}
            </div>
            
            <div className="space-y-2 mb-4">
              {svgAnalysis.issues.map((issue, index) => (
                <div key={index} className="text-sm text-orange-300 flex items-center gap-1">
                  <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
                  {issue}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSvgCleanup}
                disabled={isProcessing}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                size="sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Correction...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Corriger automatiquement
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleDirectUpload(selectedFile)}
                disabled={isUploading}
                variant="outline"
                size="sm"
              >
                Utiliser tel quel
              </Button>
            </div>
          </Card>
        )}

        {/* SVG corrigé avec succès */}
        {cleanupResult && (
          <Card className="p-4 bg-green-500/10 border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">SVG corrigé avec succès</span>
              {getSvgStatusBadge()}
            </div>
            
            <div className="space-y-1 mb-4">
              {cleanupResult.appliedFixes.map((fix, index) => (
                <div key={index} className="text-sm text-green-300 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                  {fix}
                </div>
              ))}
            </div>

            <Button
              onClick={handleUploadProcessedFile}
              disabled={isUploading}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Uploader le SVG corrigé
                </>
              )}
            </Button>
          </Card>
        )}

        {/* SVG propre */}
        {selectedFile && svgAnalysis && !svgAnalysis.needsFix && !cleanupResult && (
          <Card className="p-4 bg-green-500/10 border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-medium">SVG déjà optimisé</span>
              {getSvgStatusBadge()}
            </div>
            
            <p className="text-sm text-green-300 mb-4">
              Ce fichier SVG est déjà prêt à être utilisé et sera recolorisable par les clients.
            </p>

            <Button
              onClick={() => handleDirectUpload(selectedFile)}
              disabled={isUploading}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Uploader le SVG
                </>
              )}
            </Button>
          </Card>
        )}

        {/* Aperçu */}
        {(value || svgPreview) && (
          <Card className="p-3 bg-white/5 border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-white/70">Aperçu</span>
              {isSvg && (
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  Recolorisable
                </Badge>
              )}
            </div>
            
            <div className="flex justify-center">
              {svgPreview ? (
                <div 
                  className="max-w-32 max-h-32"
                  dangerouslySetInnerHTML={{ __html: svgPreview }}
                />
              ) : isSvg ? (
                <div className="w-32 h-32 flex items-center justify-center border border-white/20 rounded">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎨</div>
                    <span className="text-xs text-white/60">Fichier SVG</span>
                  </div>
                </div>
              ) : (
                <img
                  src={value}
                  alt="Aperçu"
                  className="max-h-32 object-contain rounded"
                />
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
