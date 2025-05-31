
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Type, Plus, Minus, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';

interface TextCustomizationProps {
  value: string;
  onChange: (value: string) => void;
  currentSide: 'front' | 'back';
}

export const TextCustomization: React.FC<TextCustomizationProps> = ({
  value,
  onChange,
  currentSide,
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Lato',
    'Oswald'
  ];

  const presetTexts = [
    'Mon texte personnalisé',
    'Édition limitée',
    'Design unique',
    'Fait avec ❤️',
    'Style personnel',
    'Original'
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Personnalisation du texte</h3>
        <p className="text-sm text-white/70">
          Ajoutez et stylisez votre texte sur le {currentSide === 'front' ? 'recto' : 'verso'}
        </p>
      </div>

      {/* Texte principal */}
      <div className="space-y-3">
        <Label htmlFor="main-text" className="text-white font-medium">Votre texte</Label>
        <Textarea
          id="main-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Saisissez votre texte ici..."
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
          maxLength={200}
        />
        <div className="flex justify-between items-center text-xs text-white/60">
          <span>Maximum 200 caractères</span>
          <span>{value.length}/200</span>
        </div>
      </div>

      {/* Textes prédéfinis */}
      <div className="space-y-3">
        <Label className="text-white font-medium">Textes suggérés</Label>
        <div className="flex flex-wrap gap-2">
          {presetTexts.map((preset) => (
            <Badge
              key={preset}
              variant="outline"
              className="cursor-pointer hover:bg-winshirt-purple/20 transition-colors"
              onClick={() => onChange(preset)}
            >
              {preset}
            </Badge>
          ))}
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Style du texte */}
      <div className="space-y-4">
        <Label className="text-white font-medium flex items-center gap-2">
          <Type className="h-4 w-4" />
          Style du texte
        </Label>

        {/* Police */}
        <div className="space-y-2">
          <Label className="text-sm text-white/80">Police</Label>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font} className="bg-slate-800">
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Taille */}
        <div className="space-y-2">
          <Label className="text-sm text-white/80">Taille</Label>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFontSize(Math.max(8, fontSize - 2))}
              disabled={fontSize <= 8}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20 text-center bg-white/10 border-white/20"
              min="8"
              max="72"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFontSize(Math.min(72, fontSize + 2))}
              disabled={fontSize >= 72}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Couleur */}
        <div className="space-y-2">
          <Label className="text-sm text-white/80">Couleur</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-12 h-10 rounded border-2 border-white/30 bg-transparent cursor-pointer"
            />
            <Input
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 font-mono"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Alignement */}
        <div className="space-y-2">
          <Label className="text-sm text-white/80">Alignement</Label>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={textAlign === 'left' ? 'default' : 'outline'}
              onClick={() => setTextAlign('left')}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={textAlign === 'center' ? 'default' : 'outline'}
              onClick={() => setTextAlign('center')}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={textAlign === 'right' ? 'default' : 'outline'}
              onClick={() => setTextAlign('right')}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Formatage */}
        <div className="space-y-2">
          <Label className="text-sm text-white/80">Formatage</Label>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={isBold ? 'default' : 'outline'}
              onClick={() => setIsBold(!isBold)}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={isItalic ? 'default' : 'outline'}
              onClick={() => setIsItalic(!isItalic)}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={isUnderline ? 'default' : 'outline'}
              onClick={() => setIsUnderline(!isUnderline)}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Aperçu */}
      {value && (
        <div className="space-y-2">
          <Label className="text-sm text-white/80">Aperçu</Label>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 min-h-[80px] flex items-center justify-center">
            <div
              style={{
                fontSize: `${fontSize}px`,
                color: fontColor,
                fontFamily: fontFamily,
                textAlign: textAlign,
                fontWeight: isBold ? 'bold' : 'normal',
                fontStyle: isItalic ? 'italic' : 'normal',
                textDecoration: isUnderline ? 'underline' : 'none',
                lineHeight: 1.4,
              }}
              className="max-w-full break-words"
            >
              {value}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
