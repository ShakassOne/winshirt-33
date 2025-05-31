
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

interface SVGColorEditorProps {
  imageUrl: string;
  onColorChange: (color: string) => void;
  onSvgContentChange: (svgContent: string) => void;
  defaultColor?: string;
}

export const SVGColorEditor: React.FC<SVGColorEditorProps> = ({
  imageUrl,
  onColorChange,
  onSvgContentChange,
  defaultColor = '#000000'
}) => {
  const [color, setColor] = useState(defaultColor);
  const [svgContent, setSvgContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [originalSvg, setOriginalSvg] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Vérification plus stricte du format SVG
  const isSvg = imageUrl && (
    imageUrl.toLowerCase().endsWith('.svg') ||
    imageUrl.includes('data:image/svg+xml')
  );

  useEffect(() => {
    if (isSvg && imageUrl) {
      setIsLoading(true);
      setError(null);
      
      console.log('🎨 [SVGColorEditor] Chargement du SVG:', imageUrl);
      
      // Ajouter un timeout et des headers pour éviter les erreurs CORS
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      fetch(imageUrl, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal,
        headers: {
          'Accept': 'image/svg+xml,*/*'
        }
      })
        .then((res) => {
          clearTimeout(timeoutId);
          if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status} - ${res.statusText}`);
          }
          
          // Vérifier le Content-Type si disponible
          const contentType = res.headers.get('content-type');
          if (contentType && !contentType.includes('svg') && !contentType.includes('xml') && !contentType.includes('text')) {
            console.warn('⚠️ [SVGColorEditor] Content-Type suspect:', contentType);
          }
          
          return res.text();
        })
        .then((text) => {
          // Vérifier que le contenu est bien du SVG
          if (!text.trim().toLowerCase().includes('<svg')) {
            throw new Error('Le fichier ne contient pas de SVG valide');
          }
          
          console.log('✅ [SVGColorEditor] SVG chargé avec succès');
          
          // Nettoyer et améliorer le SVG
          let cleanedSvg = text.trim();
          
          // S'assurer que le SVG a les bons attributs
          if (!cleanedSvg.includes('viewBox')) {
            cleanedSvg = cleanedSvg.replace(
              /<svg([^>]*)>/i, 
              '<svg$1 viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">'
            );
          }
          
          // Ajouter width et height si manquants
          if (!cleanedSvg.includes('width=') || !cleanedSvg.includes('height=')) {
            cleanedSvg = cleanedSvg.replace(
              /<svg([^>]*)>/i, 
              '<svg$1 width="100%" height="100%">'
            );
          }
          
          setOriginalSvg(cleanedSvg);
          
          // Appliquer la couleur par défaut
          const coloredSvg = cleanedSvg.replace(
            /fill="[^"]*"/g, 
            `fill="${color}"`
          ).replace(
            /stroke="[^"]*"/g, 
            `stroke="${color}"`
          );
          
          setSvgContent(coloredSvg);
          onSvgContentChange(coloredSvg);
          setIsLoading(false);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          console.error('❌ [SVGColorEditor] Erreur lors du chargement du SVG:', error);
          
          // Messages d'erreur plus spécifiques
          if (error.name === 'AbortError') {
            setError('Timeout: Le SVG met trop de temps à charger');
          } else if (error.message.includes('Failed to fetch')) {
            setError('Impossible d\'accéder au fichier SVG. Vérifiez l\'URL ou la connectivité.');
          } else {
            setError(`Erreur de chargement: ${error.message}`);
          }
          setIsLoading(false);
        });

      return () => {
        clearTimeout(timeoutId);
        controller.abort();
      };
    }
  }, [imageUrl, isSvg]);

  useEffect(() => {
    if (originalSvg && color) {
      try {
        // Remplacer toutes les couleurs fill et stroke
        const coloredSvg = originalSvg
          .replace(/fill="[^"]*"/g, `fill="${color}"`)
          .replace(/stroke="[^"]*"/g, `stroke="${color}"`)
          // Aussi remplacer les couleurs dans les styles inline
          .replace(/fill:\s*[^;"\s]+/g, `fill:${color}`)
          .replace(/stroke:\s*[^;"\s]+/g, `stroke:${color}`);
        
        setSvgContent(coloredSvg);
        onSvgContentChange(coloredSvg);
        onColorChange(color);
        console.log('🎨 [SVGColorEditor] Couleur appliquée:', color);
      } catch (error) {
        console.error('❌ [SVGColorEditor] Erreur lors du changement de couleur:', error);
        setError('Erreur lors du changement de couleur');
      }
    }
  }, [color, originalSvg, onColorChange, onSvgContentChange]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    setError(null);
  };

  if (!isSvg) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center font-medium text-white">
          <Palette className="h-4 w-4 mr-2 text-purple-400" />
          Couleur du SVG
        </Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-10 h-10 rounded-lg border-2 border-white/30 bg-transparent cursor-pointer hover:border-purple-400/60 transition-colors"
            disabled={isLoading || !!error}
            title="Choisir une couleur"
          />
          <span className="text-sm text-white/80 font-mono bg-black/20 px-2 py-1 rounded">
            {color.toUpperCase()}
          </span>
        </div>
      </div>
      
      {isLoading && (
        <div className="text-sm text-white/70 flex items-center justify-center py-2">
          <div className="animate-spin h-4 w-4 mr-2 border-2 border-purple-400 border-t-transparent rounded-full"></div>
          Chargement du SVG...
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-400 p-3 bg-red-900/20 rounded-lg border border-red-500/30">
          ⚠️ {error}
        </div>
      )}
      
      {svgContent && !error && !isLoading && (
        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <Label className="text-xs text-white/60 mb-2 block">Aperçu :</Label>
          <div 
            className="flex items-center justify-center bg-white/10 rounded p-2"
            style={{ minHeight: '80px' }}
          >
            <div 
              className="w-16 h-16"
              dangerouslySetInnerHTML={{ 
                __html: svgContent.replace(
                  /<svg([^>]*)>/i, 
                  '<svg$1 width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">'
                )
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
