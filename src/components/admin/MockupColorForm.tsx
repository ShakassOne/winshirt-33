
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadImageField } from "@/components/ui/upload-image-field";
import { Trash } from "lucide-react";

interface MockupColor {
  id?: string;
  name: string;
  color_code: string;
  front_image_url: string;
  back_image_url: string;
}

interface MockupColorFormProps {
  color: MockupColor;
  index: number;
  onChange: (index: number, color: MockupColor) => void;
  onDelete: (index: number) => void;
  allowDelete: boolean;
}

const MockupColorForm = ({ 
  color, 
  index, 
  onChange, 
  onDelete, 
  allowDelete 
}: MockupColorFormProps) => {
  const handleChange = (field: keyof MockupColor, value: string) => {
    onChange(index, { ...color, [field]: value });
  };

  return (
    <div className="p-4 border border-white/10 rounded-lg mb-4 bg-white/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Variante de couleur {index + 1}</h3>
        {allowDelete && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            onClick={() => onDelete(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`color-name-${index}`}>Nom de la couleur</Label>
          <Input
            id={`color-name-${index}`}
            value={color.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ex: Rouge, Bleu, Noir..."
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor={`color-code-${index}`}>Code couleur (hex)</Label>
          <div className="flex gap-2 mt-1">
            <Input
              id={`color-code-${index}`}
              value={color.color_code}
              onChange={(e) => handleChange('color_code', e.target.value)}
              placeholder="#FF0000"
            />
            <div 
              className="h-10 w-10 rounded border border-white/20"
              style={{ backgroundColor: color.color_code || '#FFFFFF' }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <UploadImageField
          label="Image recto"
          value={color.front_image_url}
          onChange={(value) => handleChange('front_image_url', value)}
          placeholder="URL de l'image recto"
          id={`front-image-${index}`}
          showPreview={false}
        />
      </div>
      
      <div className="mt-4">
        <UploadImageField
          label="Image verso"
          value={color.back_image_url}
          onChange={(value) => handleChange('back_image_url', value)}
          placeholder="URL de l'image verso"
          id={`back-image-${index}`}
          showPreview={false}
        />
      </div>
    </div>
  );
};

export default MockupColorForm;
