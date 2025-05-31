
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

  // Vérification plus robuste du format SVG
  const isSvg = imageUrl && (
    imageUrl.toLowerCase().includes('.svg') || 
    imageUrl.toLowerCase().includes('svg') ||
    imageUrl.includes('data:image/svg')
  );

  useEffect(() => {
    if (isSvg && imageUrl) {
      setIsLoading(true);
      setError(null);
      
      console.log('🎨 [SVGColorEditor] Chargement du SVG:', imageUrl);
      
      // Gérer différents types d'URLs SVG
      const fetchSvg = async () => {
        try {
          let response;
          
          // Si c'est un data URL, l'utiliser directement
          if (imageUrl.startsWith('data:image/svg')) {
            const svgData = imageUrl.split(',')[1];
            const decodedSvg = atob(svgData);
            response = { ok: true, text: () => Promise.resolve(decodedSvg) };
          } else {
            // Pour les URLs externes, utiliser un proxy ou gérer les CORS
            try {
              response = await fetch(imageUrl, {
                mode: 'cors',
                headers: {
                  'Accept': 'image/svg+xml,*/*'
                }
              });
            } catch (corsError) {
              console.warn('🌐 [SVGColorEditor] Erreur CORS, tentative de contournement...');
              // Fallback : créer un SVG simple avec l'URL comme background
              throw new Error('CORS_ERROR');
            }
          }
          
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          
          const text = await response.text();
          console.log('✅ [SVGColorEditor] SVG chargé avec succès');
          
          // Nettoyer et améliorer le SVG
          let cleanedSvg = text;
          
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
          
        } catch (error: any) {
          console.error('❌ [SVGColorEditor] Erreur lors du chargement du SVG:', error);
          
          if (error.message === 'CORS_ERROR') {
            // Créer un SVG de fallback
            const fallbackSvg = `
              <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="180" height="180" fill="${color}" stroke="${color}" stroke-width="2" rx="10"/>
                <text x="100" y="105" text-anchor="middle" fill="white" font-size="12">SVG</text>
              </svg>
            `;
            setOriginalSvg(fallbackSvg);
            setSvgContent(fallbackSvg);
            onSvgContentChange(fallbackSvg);
            setError('SVG externe non accessible, utilisation d\'un SVG générique');
          } else {
            setError(`Impossible de charger le SVG: ${error.message}`);
          }
          setIsLoading(false);
        }
      };
      
      fetchSvg();
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
    <div className="space-y-3 p-3 bg-gradient-to-r from-winshirt-purple/10 to-winshirt-blue/10 rounded-lg border border-white/20">
      <div className="flex items-center justify-between">
        <Label className="flex items-center font-medium text-sm">
          <Palette className="h-4 w-4 mr-2 text-winshirt-purple" />
          Couleur du SVG
        </Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-8 h-8 rounded border-2 border-white/30 bg-transparent cursor-pointer hover:border-winshirt-purple/60 transition-colors"
            disabled={isLoading || !!error}
            title="Choisir une couleur"
          />
          <span className="text-xs text-white/80 font-mono bg-black/20 px-2 py-1 rounded">
            {color.toUpperCase()}
          </span>
        </div>
      </div>
      
      {isLoading && (
        <div className="text-xs text-white/70 flex items-center justify-center py-2">
          <div className="animate-spin h-3 w-3 mr-2 border-2 border-winshirt-purple border-t-transparent rounded-full"></div>
          Chargement...
        </div>
      )}
      
      {error && (
        <div className="text-xs text-yellow-400 p-2 bg-yellow-900/20 rounded border border-yellow-500/30">
          ⚠️ {error}
        </div>
      )}
      
      {svgContent && !isLoading && (
        <div className="p-2 bg-white/5 rounded border border-white/10">
          <div 
            className="flex items-center justify-center bg-white/10 rounded p-2"
            style={{ minHeight: '60px' }}
          >
            <div 
              className="w-12 h-12"
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
