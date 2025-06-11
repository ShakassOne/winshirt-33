
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

// Liste étendue et organisée des polices Google Fonts avec catégories
const googleFonts = [
  // === POLICES SANS-SERIF CLASSIQUES ===
  { value: 'Roboto', label: 'Roboto', category: 'Sans-serif' },
  { value: 'Open Sans', label: 'Open Sans', category: 'Sans-serif' },
  { value: 'Lato', label: 'Lato', category: 'Sans-serif' },
  { value: 'Montserrat', label: 'Montserrat', category: 'Sans-serif' },
  { value: 'Raleway', label: 'Raleway', category: 'Sans-serif' },
  { value: 'Nunito', label: 'Nunito', category: 'Sans-serif' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro', category: 'Sans-serif' },
  { value: 'PT Sans', label: 'PT Sans', category: 'Sans-serif' },
  { value: 'Poppins', label: 'Poppins', category: 'Sans-serif' },
  { value: 'Ubuntu', label: 'Ubuntu', category: 'Sans-serif' },
  { value: 'Noto Sans', label: 'Noto Sans', category: 'Sans-serif' },
  { value: 'Fira Sans', label: 'Fira Sans', category: 'Sans-serif' },
  { value: 'Quicksand', label: 'Quicksand', category: 'Sans-serif' },
  { value: 'Abel', label: 'Abel', category: 'Sans-serif' },
  { value: 'Barlow', label: 'Barlow', category: 'Sans-serif' },
  { value: 'Cabin', label: 'Cabin', category: 'Sans-serif' },
  { value: 'Exo 2', label: 'Exo 2', category: 'Sans-serif' },
  { value: 'Josefin Sans', label: 'Josefin Sans', category: 'Sans-serif' },
  { value: 'Karla', label: 'Karla', category: 'Sans-serif' },
  { value: 'Muli', label: 'Muli', category: 'Sans-serif' },
  { value: 'Oxygen', label: 'Oxygen', category: 'Sans-serif' },
  { value: 'Prompt', label: 'Prompt', category: 'Sans-serif' },
  { value: 'Rubik', label: 'Rubik', category: 'Sans-serif' },
  { value: 'Work Sans', label: 'Work Sans', category: 'Sans-serif' },
  { value: 'Archivo', label: 'Archivo', category: 'Sans-serif' },
  { value: 'Asap', label: 'Asap', category: 'Sans-serif' },
  { value: 'Assistant', label: 'Assistant', category: 'Sans-serif' },
  { value: 'Catamaran', label: 'Catamaran', category: 'Sans-serif' },
  { value: 'DM Sans', label: 'DM Sans', category: 'Sans-serif' },
  { value: 'Dosis', label: 'Dosis', category: 'Sans-serif' },
  { value: 'Hind', label: 'Hind', category: 'Sans-serif' },
  { value: 'IBM Plex Sans', label: 'IBM Plex Sans', category: 'Sans-serif' },
  { value: 'Inter', label: 'Inter', category: 'Sans-serif' },
  { value: 'Maven Pro', label: 'Maven Pro', category: 'Sans-serif' },
  { value: 'Overpass', label: 'Overpass', category: 'Sans-serif' },
  { value: 'Quattrocento Sans', label: 'Quattrocento Sans', category: 'Sans-serif' },
  { value: 'Signika', label: 'Signika', category: 'Sans-serif' },
  { value: 'Ubuntu Condensed', label: 'Ubuntu Condensed', category: 'Sans-serif' },
  { value: 'Varela Round', label: 'Varela Round', category: 'Sans-serif' },
  { value: 'Acme', label: 'Acme', category: 'Sans-serif' },
  { value: 'Comfortaa', label: 'Comfortaa', category: 'Sans-serif' },
  { value: 'Didact Gothic', label: 'Didact Gothic', category: 'Sans-serif' },

  // === POLICES SERIF ÉLÉGANTES ===
  { value: 'Playfair Display', label: 'Playfair Display', category: 'Serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'Serif' },
  { value: 'Crimson Text', label: 'Crimson Text', category: 'Serif' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville', category: 'Serif' },
  { value: 'Noto Serif', label: 'Noto Serif', category: 'Serif' },
  { value: 'Arvo', label: 'Arvo', category: 'Serif' },
  { value: 'Bitter', label: 'Bitter', category: 'Serif' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond', category: 'Serif' },
  { value: 'EB Garamond', label: 'EB Garamond', category: 'Serif' },
  { value: 'Lora', label: 'Lora', category: 'Serif' },
  { value: 'Alegreya', label: 'Alegreya', category: 'Serif' },
  { value: 'Bree Serif', label: 'Bree Serif', category: 'Serif' },
  { value: 'Crete Round', label: 'Crete Round', category: 'Serif' },
  { value: 'Roboto Slab', label: 'Roboto Slab', category: 'Serif' },

  // === POLICES DISPLAY ET DÉCORATIVES ===
  { value: 'Oswald', label: 'Oswald', category: 'Display' },
  { value: 'Fjalla One', label: 'Fjalla One', category: 'Display' },
  { value: 'Pathway Gothic One', label: 'Pathway Gothic One', category: 'Display' },
  { value: 'Yanone Kaffeesatz', label: 'Yanone Kaffeesatz', category: 'Display' },
  { value: 'Abril Fatface', label: 'Abril Fatface', category: 'Display' },
  { value: 'Righteous', label: 'Righteous', category: 'Display' },
  { value: 'Philosopher', label: 'Philosopher', category: 'Display' },
  { value: 'Kanit', label: 'Kanit', category: 'Display' },
  { value: 'Russo One', label: 'Russo One', category: 'Display' },
  { value: 'Cairo', label: 'Cairo', category: 'Display' },
  { value: 'Fredoka One', label: 'Fredoka One', category: 'Display' },
  { value: 'Anton', label: 'Anton', category: 'Display' },
  { value: 'Baloo 2', label: 'Baloo 2', category: 'Display' },
  { value: 'Bangers', label: 'Bangers', category: 'Display' },
  { value: 'BioRhyme', label: 'BioRhyme', category: 'Display' },
  { value: 'Coda', label: 'Coda', category: 'Display' },
  { value: 'Teko', label: 'Teko', category: 'Display' },
  
  // === NOUVELLES POLICES AJOUTÉES ===
  { value: 'Bebas Neue', label: 'Bebas Neue', category: 'Display' },
  { value: 'Black Ops One', label: 'Black Ops One', category: 'Display' },
  { value: 'Orbitron', label: 'Orbitron', category: 'Display' },
  { value: 'Press Start 2P', label: 'Press Start 2P', category: 'Display' },
  { value: 'Creepster', label: 'Creepster', category: 'Display' },
  { value: 'Nosifer', label: 'Nosifer', category: 'Display' },
  { value: 'Special Elite', label: 'Special Elite', category: 'Display' },
  { value: 'Rock Salt', label: 'Rock Salt', category: 'Display' },
  { value: 'Six Caps', label: 'Six Caps', category: 'Display' },

  // === POLICES SCRIPT ET MANUSCRITES ===
  { value: 'Dancing Script', label: 'Dancing Script', category: 'Script' },
  { value: 'Pacifico', label: 'Pacifico', category: 'Script' },
  { value: 'Shadows Into Light', label: 'Shadows Into Light', category: 'Script' },
  { value: 'Lobster', label: 'Lobster', category: 'Script' },
  { value: 'Caveat', label: 'Caveat', category: 'Script' },
  { value: 'Indie Flower', label: 'Indie Flower', category: 'Script' },
  { value: 'Sacramento', label: 'Sacramento', category: 'Script' },
  { value: 'Architects Daughter', label: 'Architects Daughter', category: 'Script' },
  { value: 'Permanent Marker', label: 'Permanent Marker', category: 'Script' },
  { value: 'Satisfy', label: 'Satisfy', category: 'Script' },
  { value: 'Amatic SC', label: 'Amatic SC', category: 'Script' },
  { value: 'Gloria Hallelujah', label: 'Gloria Hallelujah', category: 'Script' },
  { value: 'Kalam', label: 'Kalam', category: 'Script' },
  { value: 'Neucha', label: 'Neucha', category: 'Script' },
  { value: 'Patrick Hand', label: 'Patrick Hand', category: 'Script' },
  { value: 'Courgette', label: 'Courgette', category: 'Script' },
  { value: 'Kaushan Script', label: 'Kaushan Script', category: 'Script' },
  { value: 'Great Vibes', label: 'Great Vibes', category: 'Script' },
  { value: 'Allura', label: 'Allura', category: 'Script' },
  { value: 'Alex Brush', label: 'Alex Brush', category: 'Script' },
  { value: 'Tangerine', label: 'Tangerine', category: 'Script' },
  { value: 'Arizonia', label: 'Arizonia', category: 'Script' },
  { value: 'Yesteryear', label: 'Yesteryear', category: 'Script' },

  // === POLICES MONOSPACE ===
  { value: 'Space Mono', label: 'Space Mono', category: 'Monospace' },
  { value: 'Roboto Mono', label: 'Roboto Mono', category: 'Monospace' },
  { value: 'Roboto Condensed', label: 'Roboto Condensed', category: 'Monospace' },
  { value: 'Fira Code', label: 'Fira Code', category: 'Monospace' },
  { value: 'Cousine', label: 'Cousine', category: 'Monospace' },
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

      {/* Police avec prévisualisation */}
      <div className="space-y-2">
        <Label htmlFor="textFont">Police</Label>
        <Select value={textFont} onValueChange={onTextFontChange}>
          <SelectTrigger className="bg-white/5 border-white/20">
            <SelectValue placeholder="Choisir une police" />
          </SelectTrigger>
          <SelectContent className="max-h-[400px] bg-black/95 border-white/20 backdrop-blur-sm">
            <SelectGroup>
              {googleFonts.map(font => (
                <SelectItem 
                  key={font.value} 
                  value={font.value}
                  className="hover:bg-winshirt-purple/20 focus:bg-winshirt-purple/30"
                  style={{ fontFamily: font.value }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span style={{ fontFamily: font.value, fontSize: '14px' }}>
                      {font.label}
                    </span>
                    <span className="text-xs text-white/50 ml-2">
                      {font.category}
                    </span>
                  </div>
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

      {/* Aperçu du texte amélioré */}
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
                display: 'inline-block',
                lineHeight: '1.2'
              }}
            >
              {textContent}
            </span>
          </div>
          <div className="mt-2 text-xs text-white/60 text-center">
            Police : {textFont} • Couleur : {textColor}
          </div>
        </div>
      )}
    </div>
  );
};
