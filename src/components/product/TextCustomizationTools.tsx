
import React from 'react';
import { Bold, Italic, Underline } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextCustomizationToolsProps {
  currentViewSide: 'front' | 'back';
  textFont: string;
  setTextFont: React.Dispatch<React.SetStateAction<string>>;
  textColor: string;
  setTextColor: React.Dispatch<React.SetStateAction<string>>;
  textShowColorPicker: boolean;
  setTextShowColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
  textStyles: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  handleTextStylesToggle: (styleName: 'bold' | 'italic' | 'underline', value: boolean) => void;
  textTransform: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  handleTextTransformChange: (property: string, value: any) => void;
  googleFonts: Array<{value: string, label: string}>;
}

const TextCustomizationTools = ({
  currentViewSide,
  textFont,
  setTextFont,
  textColor,
  setTextColor,
  textShowColorPicker,
  setTextShowColorPicker,
  textStyles,
  handleTextStylesToggle,
  textTransform,
  handleTextTransformChange,
  googleFonts
}: TextCustomizationToolsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="text-font">Police</Label>
        <Select
          value={textFont}
          onValueChange={(value) => setTextFont(value)}
        >
          <SelectTrigger id="text-font" className="w-full">
            <SelectValue placeholder="Choisir une police" />
          </SelectTrigger>
          <SelectContent>
            {googleFonts.map(font => (
              <SelectItem key={font.value} value={font.value}>
                <span style={{ fontFamily: font.value }}>
                  {font.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Style</Label>
        <div className="flex gap-2 mt-1">
          <ToggleGroup type="multiple" className="justify-start">
            <ToggleGroupItem 
              value="bold" 
              aria-label="Toggle Bold" 
              data-state={textStyles.bold ? "on" : "off"}
              onClick={() => handleTextStylesToggle('bold', !textStyles.bold)}
            >
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="italic" 
              aria-label="Toggle Italic" 
              data-state={textStyles.italic ? "on" : "off"}
              onClick={() => handleTextStylesToggle('italic', !textStyles.italic)}
            >
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="underline" 
              aria-label="Toggle Underline" 
              data-state={textStyles.underline ? "on" : "off"}
              onClick={() => handleTextStylesToggle('underline', !textStyles.underline)}
            >
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div>
        <Label>Couleur</Label>
        <div 
          className="w-full h-8 rounded-md cursor-pointer mt-1"
          style={{ backgroundColor: textColor }}
          onClick={() => setTextShowColorPicker(prev => !prev)}
        ></div>
        {textShowColorPicker && (
          <Card className="p-4 mt-2">
            <HexColorPicker color={textColor} onChange={setTextColor} />
          </Card>
        )}
      </div>

      <div>
        <Label>Taille</Label>
        <Slider
          className="my-4"
          value={[textTransform.scale * 100]}
          min={50}
          max={200}
          step={5}
          onValueChange={(value) => handleTextTransformChange('scale', value[0] / 100)}
        />
      </div>

      <div>
        <Label>Rotation</Label>
        <Slider
          className="my-4"
          value={[textTransform.rotation]}
          min={-180}
          max={180}
          step={5}
          onValueChange={(value) => handleTextTransformChange('rotation', value[0])}
        />
      </div>
    </>
  );
};

export default TextCustomizationTools;
