
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UploadButton } from '@/components/ui/upload-button';
import { CheckCircle } from 'lucide-react';
import { sanitizeSvg } from '@/utils/sanitizeSvg';

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

  const isSvg = value && value.toLowerCase().endsWith('.svg');

  useEffect(() => {
    setImagePreview(value || null);
    
    if (isSvg && value) {
      fetch(value)
        .then((res) => res.ok ? res.text() : '')
        .then((text) => setSvgContent(text))
        .catch(() => setSvgContent(''));
    } else {
      setSvgContent('');
    }
  }, [value, isSvg]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setImagePreview(newValue || null);
  };

  const handleUpload = (url: string) => {
    onChange(url);
    setImagePreview(url);
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
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                SVG
              </Badge>
            )}
          </div>
          
          {isSvg ? (
            <div className="w-full max-w-32 h-32 flex items-center justify-center">
              {svgContent ? (
                <div
                  className="max-w-full max-h-full"
                  dangerouslySetInnerHTML={{ __html: sanitizeSvg(svgContent) }}
                  style={{ maxHeight: '100px', maxWidth: '100px' }}
                />
              ) : (
                <div className="text-xs text-muted-foreground text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <p>SVG Externe</p>
                </div>
              )}
            </div>
          ) : (
            <img
              src={imagePreview}
              alt="Aperçu"
              className="max-h-32 object-contain rounded"
              onError={() => setImagePreview(null)}
              loading="lazy"
            />
          )}
        </div>
      )}
    </div>
  );
}
