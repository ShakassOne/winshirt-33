
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
  const [useFallbackDisplay, setUseFallbackDisplay] = useState(false);

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
      setUseFallbackDisplay(false);
      
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
            // Pour les URLs externes, essayer plusieurs méthodes
            try {
              // Première tentative avec CORS
              response = await fetch(imageUrl, {
                mode: 'cors',
                headers: {
                  'Accept': 'image/svg+xml,*/*'
                }
              });
            } catch (corsError) {
              console.warn('🌐 [SVGColorEditor] Erreur CORS, tentative sans CORS...');
              try {
                // Deuxième tentative sans mode CORS
                response = await fetch(imageUrl, {
                  headers: {
                    'Accept': 'image/svg+xml,*/*'
                  }
                });
              } catch (secondError) {
                console.warn('🌐 [SVGColorEditor] Toutes les tentatives de fetch ont échoué, utilisation du fallback');
                throw new Error('CORS_ERROR');
              }
            }
          }
          
          if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
          }
          
          const text = await response.text();
          console.log('✅ [SVGColorEditor] SVG chargé avec succès, longueur:', text.length);
          
          // Vérifier que c'est bien du SVG
          if (!text.includes('<svg')) {
            throw new Error('Le contenu ne semble pas être un SVG valide');
          }
          
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
          const coloredSvg = applyColorToSvg(cleanedSvg, color);
          
          setSvgContent(coloredSvg);
          onSvgContentChange(coloredSvg);
          setIsLoading(false);
          
        } catch (error: any) {
          console.error('❌ [SVGColorEditor] Erreur lors du chargement du SVG:', error);
          
          if (error.message === 'CORS_ERROR' || error.message.includes('CORS') || error.message.includes('fetch')) {
            console.log('🔄 [SVGColorEditor] Activation du mode fallback pour SVG externe');
            // Mode fallback : créer un SVG colorisable basique mais fonctionnel
            setUseFallbackDisplay(true);
            setError('SVG externe - Mode image simple activé');
            
            // Créer un SVG simple qui peut être recolorisé
            const fallbackSvg = `
              <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="160" height="160" fill="${color}" stroke="${color}" stroke-width="4" rx="15"/>
                <circle cx="100" cy="80" r="20" fill="white"/>
                <rect x="70" y="120" width="60" height="40" fill="white" rx="5"/>
                <text x="100" y="140" text-anchor="middle" fill="${color}" font-size="12" font-weight="bold">SVG</text>
              </svg>
            `;
            setOriginalSvg(fallbackSvg);
            setSvgContent(fallbackSvg);
            onSvgContentChange(fallbackSvg);
          } else {
            setError(`Erreur: ${error.message}`);
          }
          setIsLoading(false);
        }
      };
      
      fetchSvg();
    }
  }, [imageUrl, isSvg]);

  // Fonction pour appliquer la couleur au SVG
  const applyColorToSvg = (svgString: string, newColor: string): string => {
    try {
      let coloredSvg = svgString;
      
      // Remplacer les attributs fill et stroke
      coloredSvg = coloredSvg
        .replace(/fill="[^"]*"/g, `fill="${newColor}"`)
        .replace(/stroke="[^"]*"/g, `stroke="${newColor}"`)
        // Remplacer currentColor spécifiquement
        .replace(/fill="currentColor"/g, `fill="${newColor}"`)
        .replace(/stroke="currentColor"/g, `stroke="${newColor}"`)
        // Aussi remplacer les couleurs dans les styles inline
        .replace(/fill:\s*[^;"\s]+/g, `fill:${newColor}`)
        .replace(/stroke:\s*[^;"\s]+/g, `stroke:${newColor}`)
        .replace(/fill:\s*currentColor/g, `fill:${newColor}`)
        .replace(/stroke:\s*currentColor/g, `stroke:${newColor}`);
      
      return coloredSvg;
    } catch (error) {
      console.error('❌ [SVGColorEditor] Erreur lors de l\'application de la couleur:', error);
      return svgString;
    }
  };

  useEffect(() => {
    if (originalSvg && color) {
      try {
        const coloredSvg = applyColorToSvg(originalSvg, color);
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
            disabled={isLoading}
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
          Chargement du SVG...
        </div>
      )}
      
      {error && (
        <div className="text-xs text-blue-400 p-2 bg-blue-900/20 rounded border border-blue-500/30">
          ℹ️ {error}
        </div>
      )}
      
      {svgContent && !isLoading && (
        <div className="p-2 bg-white/5 rounded border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/70">Aperçu</span>
            {useFallbackDisplay && (
              <span className="text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                Mode image simple
              </span>
            )}
          </div>
          <div 
            className="flex items-center justify-center bg-white/10 rounded p-2"
            style={{ minHeight: '60px' }}
          >
            {useFallbackDisplay ? (
              // Mode fallback : afficher l'image + aperçu SVG généré
              <div className="flex items-center gap-3">
                <img
                  src={imageUrl}
                  alt="SVG original"
                  className="w-12 h-12 object-contain rounded border border-white/20"
                  style={{ filter: `hue-rotate(${getHueRotationForColor(color)}deg)` }}
                />
                <div className="text-xs text-white/60">→</div>
                <div 
                  className="w-12 h-12"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </div>
            ) : (
              <div 
                className="w-12 h-12"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Fonction utilitaire pour approximer la rotation de teinte
function getHueRotationForColor(hexColor: string): number {
  // Conversion approximative de couleur hex vers rotation de teinte
  // Cette fonction est une approximation pour le mode fallback
  const colors: { [key: string]: number } = {
    '#ff0000': 0,   // rouge
    '#00ff00': 120, // vert
    '#0000ff': 240, // bleu
    '#ffff00': 60,  // jaune
    '#ff00ff': 300, // magenta
    '#00ffff': 180, // cyan
    '#ffffff': 0,   // blanc
    '#000000': 0,   // noir
  };
  
  return colors[hexColor.toLowerCase()] || 0;
}
