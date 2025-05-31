
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadButton } from '@/components/ui/upload-button';

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

  const isSvg = value && value.toLowerCase().endsWith('.svg');

  useEffect(() => {
    setImagePreview(value || null);
    
    // Si c'est un SVG, charger le contenu pour l'affichage inline
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
          setIsLoadingSvg(false);
        })
        .catch((error) => {
          console.error('❌ [UploadImageField] Erreur lors du chargement du SVG:', error);
          setSvgContent('');
          setIsLoadingSvg(false);
        });
    } else {
      setSvgContent('');
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
            {isSvg && (
              <span className="inline-block bg-purple-500 text-xs px-2 py-1 rounded text-white">
                SVG - Recolorisable
              </span>
            )}
          </div>
          
          {isSvg ? (
            <div className="w-full max-w-32 h-32 flex items-center justify-center">
              {isLoadingSvg ? (
                <div className="text-xs text-muted-foreground flex items-center">
                  <div className="animate-spin h-3 w-3 mr-2 border border-gray-400 border-t-transparent rounded-full"></div>
                  Chargement SVG...
                </div>
              ) : svgContent ? (
                <div 
                  className="max-w-full max-h-full"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                  style={{ maxHeight: '100px', maxWidth: '100px' }}
                />
              ) : (
                <div className="text-xs text-muted-foreground text-center">
                  <p>⚠️ Impossible de charger le SVG</p>
                  <p className="mt-1">Utilisation de l'affichage standard</p>
                  <img
                    src={imagePreview}
                    alt="Aperçu SVG (fallback)"
                    className="max-h-24 object-contain rounded mt-2"
                    onError={() => setImagePreview(null)}
                  />
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
