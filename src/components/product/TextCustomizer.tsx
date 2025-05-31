
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bold, Italic, Underline, RotateCw } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

interface TextCustomizerProps {
  textContent: string;
  textFont: string;
  textColor: string;
  textStyles: { bold: boolean; italic: boolean; underline: boolean };
  textTransform: { position: { x: number; y: number }; scale: number; rotation: number };
  onTextContentChange: (content: string) => void;
  onTextFontChange: (font: string) => void;
  onTextColorChange: (color: string) => void;
  onTextStylesChange: (styles: { bold: boolean; italic: boolean; underline: boolean }) => void;
  onTextTransformChange: (property: string, value: any) => void;
}

const googleFonts = [
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'PT Sans', label: 'PT Sans' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Ubuntu', label: 'Ubuntu' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Noto Sans', label: 'Noto Sans' },
  { value: 'Fira Sans', label: 'Fira Sans' },
  { value: 'Quicksand', label: 'Quicksand' },
  { value: 'Dancing Script', label: 'Dancing Script' },
  { value: 'Pacifico', label: 'Pacifico' },
  { value: 'Shadows Into Light', label: 'Shadows Into Light' },
  { value: 'Lobster', label: 'Lobster' },
  { value: 'Caveat', label: 'Caveat' },
  { value: 'Comfortaa', label: 'Comfortaa' },
  { value: 'Indie Flower', label: 'Indie Flower' },
  { value: 'Sacramento', label: 'Sacramento' },
  { value: 'Architects Daughter', label: 'Architects Daughter' },
  { value: 'Permanent Marker', label: 'Permanent Marker' },
  { value: 'Satisfy', label: 'Satisfy' },
  { value: 'Amatic SC', label: 'Amatic SC' },
  { value: 'Pathway Gothic One', label: 'Pathway Gothic One' },
  { value: 'Abel', label: 'Abel' },
  { value: 'Barlow', label: 'Barlow' },
  { value: 'Cabin', label: 'Cabin' },
  { value: 'Crimson Text', label: 'Crimson Text' },
  { value: 'Exo 2', label: 'Exo 2' },
  { value: 'Fjalla One', label: 'Fjalla One' },
  { value: 'Josefin Sans', label: 'Josefin Sans' },
  { value: 'Karla', label: 'Karla' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville' },
  { value: 'Muli', label: 'Muli' },
  { value: 'Noto Serif', label: 'Noto Serif' },
  { value: 'Oxygen', label: 'Oxygen' },
  { value: 'Prompt', label: 'Prompt' },
  { value: 'Rubik', label: 'Rubik' },
  { value: 'Space Mono', label: 'Space Mono' },
  { value: 'Work Sans', label: 'Work Sans' },
  { value: 'Yanone Kaffeesatz', label: 'Yanone Kaffeesatz' },
  { value: 'Bree Serif', label: 'Bree Serif' },
  { value: 'Crete Round', label: 'Crete Round' },
  { value: 'Abril Fatface', label: 'Abril Fatface' },
  { value: 'Righteous', label: 'Righteous' },
  { value: 'Philosopher', label: 'Philosopher' },
  { value: 'Kanit', label: 'Kanit' },
  { value: 'Russo One', label: 'Russo One' },
  { value: 'Archivo', label: 'Archivo' },
  { value: 'Arvo', label: 'Arvo' },
  { value: 'Bitter', label: 'Bitter' },
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'Didact Gothic', label: 'Didact Gothic' },
  { value: 'EB Garamond', label: 'EB Garamond' },
  { value: 'Fredoka One', label: 'Fredoka One' },
  { value: 'Gloria Hallelujah', label: 'Gloria Hallelujah' },
  { value: 'Hind', label: 'Hind' },
  { value: 'IBM Plex Sans', label: 'IBM Plex Sans' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Kalam', label: 'Kalam' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Maven Pro', label: 'Maven Pro' },
  { value: 'Neucha', label: 'Neucha' },
  { value: 'Overpass', label: 'Overpass' },
  { value: 'Patrick Hand', label: 'Patrick Hand' },
  { value: 'Quattrocento Sans', label: 'Quattrocento Sans' },
  { value: 'Roboto Condensed', label: 'Roboto Condensed' },
  { value: 'Roboto Mono', label: 'Roboto Mono' },
  { value: 'Roboto Slab', label: 'Roboto Slab' },
  { value: 'Signika', label: 'Signika' },
  { value: 'Teko', label: 'Teko' },
  { value: 'Ubuntu Condensed', label: 'Ubuntu Condensed' },
  { value: 'Varela Round', label: 'Varela Round' },
  { value: 'Acme', label: 'Acme' },
  { value: 'Alegreya', label: 'Alegreya' },
  { value: 'Anton', label: 'Anton' },
  { value: 'Asap', label: 'Asap' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Baloo 2', label: 'Baloo 2' },
  { value: 'Bangers', label: 'Bangers' },
  { value: 'BioRhyme', label: 'BioRhyme' },
  { value: 'Catamaran', label: 'Catamaran' },
  { value: 'Coda', label: 'Coda' },
  { value: 'Courgette', label: 'Courgette' },
  { value: 'Cousine', label: 'Cousine' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Dosis', label: 'Dosis' },
  { value: 'Fira Code', label: 'Fira Code' }
];

export const TextCustomizer: React.FC<TextCustomizerProps> = ({
  textContent,
  textFont,
  textColor,
  textStyles,
  textTransform,
  onTextContentChange,
  onTextFontChange,
  onTextColorChange,
  onTextStylesChange,
  onTextTransformChange
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="space-y-6">
      {/* Contenu du texte */}
      <div className="space-y-2">
        <Label htmlFor="textContent">Votre texte</Label>
        <Input
          id="textContent"
          value={textContent}
          onChange={(e) => onTextContentChange(e.target.value)}
          placeholder="Entrez votre texte ici..."
          className="bg-white/5 border-white/20"
        />
      </div>

      {/* Police */}
      <div className="space-y-2">
        <Label htmlFor="textFont">Police</Label>
        <Select value={textFont} onValueChange={onTextFontChange}>
          <SelectTrigger className="bg-white/5 border-white/20">
            <SelectValue placeholder="Choisir une police" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] bg-black/90 border-white/20">
            <SelectGroup>
              {googleFonts.map(font => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Styles de texte */}
      <div className="space-y-2">
        <Label>Style de texte</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className={textStyles.bold ? 'bg-winshirt-purple/40' : ''}
            onClick={() => onTextStylesChange({ ...textStyles, bold: !textStyles.bold })}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={textStyles.italic ? 'bg-winshirt-purple/40' : ''}
            onClick={() => onTextStylesChange({ ...textStyles, italic: !textStyles.italic })}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={textStyles.underline ? 'bg-winshirt-purple/40' : ''}
            onClick={() => onTextStylesChange({ ...textStyles, underline: !textStyles.underline })}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Couleur */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Couleur</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="bg-white/5 border-white/20"
          >
            <div
              className="w-4 h-4 mr-2 rounded"
              style={{ backgroundColor: textColor }}
            ></div>
            {showColorPicker ? 'Fermer' : 'Choisir'}
          </Button>
        </div>
        
        {showColorPicker && (
          <div className="mt-2">
            <HexColorPicker
              color={textColor}
              onChange={onTextColorChange}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Échelle */}
      <div className="space-y-2">
        <Label>Échelle ({Math.round(textTransform.scale * 100)}%)</Label>
        <Slider
          value={[textTransform.scale * 100]}
          min={50}
          max={200}
          step={5}
          onValueChange={(value) => onTextTransformChange('scale', value[0] / 100)}
          className="flex-1"
        />
      </div>

      {/* Rotation */}
      <div className="space-y-2">
        <Label>Rotation ({textTransform.rotation}°)</Label>
        <div className="flex gap-2 items-center">
          <Slider
            value={[textTransform.rotation + 180]}
            min={0}
            max={360}
            step={5}
            onValueChange={(value) => onTextTransformChange('rotation', value[0] - 180)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => onTextTransformChange('rotation', 0)}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Aperçu du texte */}
      {textContent && (
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <Label className="text-sm mb-2 block">Aperçu :</Label>
          <div className="bg-white/10 rounded p-4 text-center">
            <span
              style={{
                fontFamily: textFont,
                color: textColor,
                fontWeight: textStyles.bold ? 'bold' : 'normal',
                fontStyle: textStyles.italic ? 'italic' : 'normal',
                textDecoration: textStyles.underline ? 'underline' : 'none',
                fontSize: `${Math.round(textTransform.scale * 24)}px`,
                transform: `rotate(${textTransform.rotation}deg)`,
                display: 'inline-block'
              }}
            >
              {textContent}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
