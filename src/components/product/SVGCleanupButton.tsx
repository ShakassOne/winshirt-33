
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { SVGAnalysisResult, SVGCleanupResult, SVGAnalyzerService } from '@/services/svgAnalyzer.service';

interface SVGCleanupButtonProps {
  file: File;
  analysisResult: SVGAnalysisResult;
  onCleanupComplete: (cleanedFile: File) => void;
  className?: string;
}

export const SVGCleanupButton: React.FC<SVGCleanupButtonProps> = ({
  file,
  analysisResult,
  onCleanupComplete,
  className = ""
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<SVGCleanupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCleanup = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      console.log('🔧 [SVGCleanup] Début du nettoyage SVG:', file.name);
      const result = await SVGAnalyzerService.cleanSVG(file);
      
      setCleanupResult(result);
      
      // Créer le fichier nettoyé
      const cleanedFile = SVGAnalyzerService.createCleanedFile(result.cleanedBlob, file.name);
      
      console.log('✅ [SVGCleanup] SVG nettoyé avec succès:', result.appliedFixes);
      onCleanupComplete(cleanedFile);
      
    } catch (err) {
      console.error('❌ [SVGCleanup] Erreur lors du nettoyage:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du nettoyage');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cleanupResult) {
    return (
      <Card className={`p-4 bg-green-500/10 border-green-500/30 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="text-green-400 font-medium">SVG corrigé avec succès</span>
        </div>
        <div className="space-y-1">
          {cleanupResult.appliedFixes.map((fix, index) => (
            <div key={index} className="text-sm text-green-300 flex items-center gap-1">
              <span className="w-1 h-1 bg-green-400 rounded-full"></span>
              {fix}
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-4 bg-red-500/10 border-red-500/30 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <span className="text-red-400 font-medium">Erreur de nettoyage</span>
        </div>
        <p className="text-sm text-red-300">{error}</p>
        <Button
          onClick={() => setError(null)}
          variant="outline"
          size="sm"
          className="mt-2 bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
        >
          Réessayer
        </Button>
      </Card>
    );
  }

  return (
    <Card className={`p-4 bg-orange-500/10 border-orange-500/30 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-orange-400" />
        <span className="text-orange-400 font-medium">SVG à corriger</span>
        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
          {analysisResult.issues.length} problème(s)
        </Badge>
      </div>
      
      <div className="space-y-2 mb-4">
        {analysisResult.issues.map((issue, index) => (
          <div key={index} className="text-sm text-orange-300 flex items-center gap-1">
            <span className="w-1 h-1 bg-orange-400 rounded-full"></span>
            {issue}
          </div>
        ))}
      </div>

      <Button
        onClick={handleCleanup}
        disabled={isProcessing}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        size="sm"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Correction en cours...
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4 mr-2" />
            Corriger le SVG automatiquement
          </>
        )}
      </Button>
    </Card>
  );
};
