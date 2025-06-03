
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UploadButton } from '@/components/ui/upload-button';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface UploadImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  showPreview?: boolean;
}

export function UploadImageField({
  label,
  value,
  onChange,
  placeholder = "URL de l'image",
  className,
  id,
  showPreview = true
}: UploadImageFieldProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(value || null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoadingSvg, setIsLoadingSvg] = useState(false);
  const [svgStatus, setSvgStatus] = useState<'clean' | 'needs-fix' | 'external' | 'unknown'>('unknown');

  const isSvg = value && value.toLowerCase().endsWith('.svg');

  useEffect(() => {
    setImagePreview(value || null);
    
    // Si c'est un SVG, charger le contenu pour l'affichage inline et analyser
    if (isSvg && value) {
      setIsLoadingSvg(true);
      console.log('📁 [UploadImageField] Chargement du SVG pour aperçu:', value);
      
      fetch(value)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
          }
          return res.text();
        })
        .then((text) => {
          console.log('✅ [UploadImageField] SVG chargé avec succès');
          setSvgContent(text);
          
          // Analyser rapidement le SVG pour déterminer son statut
          const hasStyle = text.includes('<style');
          const hasFixedSize = /svg[^>]*\s(width|height)=/.test(text);
          const missingFill = /<(path|g)[^>]*(?!.*fill=)/.test(text);
          const hasCurrentColor = text.includes('currentColor');
          
          if (hasStyle || hasFixedSize || (missingFill && !hasCurrentColor)) {
            setSvgStatus('needs-fix');
          } else if (hasCurrentColor) {
            setSvgStatus('clean');
          } else {
            setSvgStatus('clean');
          }
          
          setIsLoadingSvg(false);
        })
        .catch((error) => {
          console.warn('⚠️ [UploadImageField] SVG externe non accessible:', error);
          setSvgContent('');
          setSvgStatus('external'); // SVG externe, potentiellement recolorisable mais non analysable
          setIsLoadingSvg(false);
        });
    } else {
      setSvgContent('');
      setSvgStatus('unknown');
      setIsLoadingSvg(false);
    }
  }, [value, isSvg]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setImagePreview(newValue || null);
  };

  const handleUpload = (url: string) => {
    console.log('📁 [UploadImageField] Fichier uploadé:', url);
    onChange(url);
    setImagePreview(url);
    
    // Si c'est un SVG, indiquer à l'utilisateur
    if (url.toLowerCase().endsWith('.svg')) {
      console.log('🎨 [UploadImageField] SVG détecté après upload:', url);
    }
  };

  const getSvgStatusBadge = () => {
    if (!isSvg) return null;
    
    switch (svgStatus) {
      case 'clean':
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            SVG Optimisé
          </Badge>
        );
      case 'needs-fix':
        return (
          <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
            <AlertTriangle className="h-3 w-3 mr-1" />
            SVG à corriger
          </Badge>
        );
      case 'external':
        return (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Info className="h-3 w-3 mr-1" />
            SVG Externe
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            SVG
          </Badge>
        );
    }
  };

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex mt-1 gap-2">
        <Input
          id={id}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1"
        />
        <UploadButton
          onUpload={handleUpload}
          variant="outline"
          acceptTypes="image/*,.svg"
        />
      </div>
      
      {showPreview && imagePreview && (
        <div className="mt-2 rounded-lg overflow-hidden border border-dashed p-2 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-muted-foreground">Aperçu</p>
            {getSvgStatusBadge()}
          </div>
          
          {isSvg ? (
            <div className="w-full max-w-32 h-32 flex items-center justify-center">
              {isLoadingSvg ? (
                <div className="text-xs text-muted-foreground flex items-center">
                  <div className="animate-spin h-3 w-3 mr-2 border border-gray-400 border-t-transparent rounded-full"></div>
                  Analyse SVG...
                </div>
              ) : svgContent ? (
                <div 
                  className="max-w-full max-h-full"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                  style={{ maxHeight: '100px', maxWidth: '100px' }}
                />
              ) : (
                <div className="text-xs text-muted-foreground text-center">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎨</div>
                    <p>SVG Externe</p>
                    <p className="mt-1 text-xs text-blue-400">Recolorisable côté client</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <img
              src={imagePreview}
              alt="Aperçu"
              className="max-h-32 object-contain rounded"
              onError={() => setImagePreview(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
