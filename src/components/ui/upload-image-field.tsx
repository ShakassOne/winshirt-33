
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
  useExternalUpload?: boolean;
}

export function UploadImageField({
  label,
  value,
  onChange,
  placeholder = "URL de l'image",
  className,
  id,
  showPreview = true,
  useExternalUpload = true
}: UploadImageFieldProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(value || null);

  useEffect(() => {
    setImagePreview(value || null);
  }, [value]);

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
          useExternalUpload={useExternalUpload}
        />
      </div>
      
      {showPreview && imagePreview && (
        <div className="mt-2 rounded-lg overflow-hidden border border-dashed p-2 flex flex-col items-center">
          <p className="text-sm mb-2 text-muted-foreground">Aperçu</p>
          <img
            src={imagePreview}
            alt="Aperçu"
            className="max-h-32 object-contain rounded"
            onError={() => setImagePreview(null)}
          />
        </div>
      )}
    </div>
  );
}
