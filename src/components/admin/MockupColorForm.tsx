
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash } from 'lucide-react';
import { UploadButton } from '@/components/ui/upload-button';
import { MockupColor } from '@/types/mockup.types';

interface MockupColorFormProps {
  color: MockupColor;
  index: number;
  onChange: (index: number, updatedColor: MockupColor) => void;
  onDelete: (index: number) => void;
  allowDelete?: boolean;
}

const MockupColorForm: React.FC<MockupColorFormProps> = ({
  color,
  index,
  onChange,
  onDelete,
  allowDelete = true
}) => {
  const handleFieldChange = (field: keyof MockupColor, value: string) => {
    onChange(index, { ...color, [field]: value });
  };

  const handleFrontImageUpload = (url: string) => {
    handleFieldChange('front_image_url', url);
  };

  const handleBackImageUpload = (url: string) => {
    handleFieldChange('back_image_url', url);
  };

  return (
    <div className="bg-white/10 p-4 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border border-white/20"
            style={{ backgroundColor: color.color_code }}
          />
          Couleur {index + 1}
        </h4>
        {allowDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700"
            onClick={() => onDelete(index)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`color-name-${index}`}>Nom de la couleur</Label>
          <Input
            id={`color-name-${index}`}
            value={color.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="Ex: Rouge, Bleu marine..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`color-code-${index}`}>Code couleur HEX</Label>
          <div className="flex gap-2">
            <Input
              id={`color-code-${index}`}
              type="color"
              value={color.color_code}
              onChange={(e) => handleFieldChange('color_code', e.target.value)}
              className="w-16 h-10 p-1 rounded cursor-pointer"
            />
            <Input
              value={color.color_code}
              onChange={(e) => handleFieldChange('color_code', e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`front-image-${index}`}>Image avant (optionnel)</Label>
          <div className="flex gap-2">
            <Input
              id={`front-image-${index}`}
              value={color.front_image_url || ''}
              onChange={(e) => handleFieldChange('front_image_url', e.target.value)}
              placeholder="URL de l'image avant"
              className="flex-1"
            />
            <UploadButton
              onUpload={handleFrontImageUpload}
              size="icon"
              acceptTypes=".png,.jpg,.jpeg,.webp"
            />
          </div>
          <p className="text-xs text-white/50">
            Laissez vide pour utiliser la coloration dynamique
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`back-image-${index}`}>Image arrière (optionnel)</Label>
          <div className="flex gap-2">
            <Input
              id={`back-image-${index}`}
              value={color.back_image_url || ''}
              onChange={(e) => handleFieldChange('back_image_url', e.target.value)}
              placeholder="URL de l'image arrière"
              className="flex-1"
            />
            <UploadButton
              onUpload={handleBackImageUpload}
              size="icon"
              acceptTypes=".png,.jpg,.jpeg,.webp"
            />
          </div>
          <p className="text-xs text-white/50">
            Laissez vide pour utiliser la coloration dynamique
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockupColorForm;
