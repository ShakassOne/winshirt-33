
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DesignCustomizationToolsProps {
  currentViewSide: 'front' | 'back';
  designTransform: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  handleDesignTransformChange: (property: string, value: any) => void;
  printSize: string;
  setPrintSize: React.Dispatch<React.SetStateAction<string>>;
}

const DesignCustomizationTools = ({
  currentViewSide,
  designTransform,
  handleDesignTransformChange,
  printSize,
  setPrintSize
}: DesignCustomizationToolsProps) => {
  return (
    <>
      <div>
        <Label>Format d'impression</Label>
        <Select
          value={printSize}
          onValueChange={setPrintSize}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner un format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A3">A3 (Grand format)</SelectItem>
            <SelectItem value="A4">A4 (Moyen format)</SelectItem>
            <SelectItem value="A5">A5 (Petit format)</SelectItem>
            <SelectItem value="A6">A6 (Mini format)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Taille</Label>
        <Slider
          className="my-4"
          value={[designTransform.scale * 100]}
          min={50}
          max={200}
          step={5}
          onValueChange={(value) => handleDesignTransformChange('scale', value[0] / 100)}
        />
      </div>

      <div>
        <Label>Rotation</Label>
        <Slider
          className="my-4"
          value={[designTransform.rotation]}
          min={-180}
          max={180}
          step={5}
          onValueChange={(value) => handleDesignTransformChange('rotation', value[0])}
        />
      </div>
    </>
  );
};

export default DesignCustomizationTools;
