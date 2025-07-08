
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { HexColorPicker } from 'react-colorful';
import { generateQRCode, validateQRContent, formatQRContent, QRCodeOptions } from '@/services/qrcode.service';
import { QrCode, Check, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface QRCodeGeneratorProps {
  onQRCodeGenerated: (qrCodeUrl: string) => void;
  defaultContent?: string;
  defaultColor?: string;
  defaultSize?: number;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  onQRCodeGenerated,
  defaultContent = '',
  defaultColor = '#000000',
  defaultSize = 200
}) => {
  const [content, setContent] = useState(defaultContent);
  const [contentType, setContentType] = useState<'text' | 'url' | 'email' | 'phone'>('text');
  const [color, setColor] = useState(defaultColor);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isTransparent, setIsTransparent] = useState(true);
  const [size, setSize] = useState(defaultSize);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const generateQR = async () => {
    if (!content.trim()) return;
    
    setIsGenerating(true);
    try {
      const formattedContent = formatQRContent(content, contentType);
      const options: QRCodeOptions = {
        content: formattedContent,
        size,
        color,
        backgroundColor,
        errorCorrectionLevel: errorLevel,
        transparent: isTransparent
      };
      
      const url = await generateQRCode(options);
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyQRCode = () => {
    if (qrCodeUrl) {
      onQRCodeGenerated(qrCodeUrl);
    }
  };

  useEffect(() => {
    const valid = validateQRContent(content, contentType);
    setIsValid(valid);
    
    if (valid && content.trim()) {
      const timer = setTimeout(generateQR, 500);
      return () => clearTimeout(timer);
    } else {
      setQrCodeUrl('');
    }
  }, [content, contentType, color, backgroundColor, size, errorLevel, isTransparent]);

  const contentTypeLabels = {
    text: 'Texte simple',
    url: 'URL/Site web',
    email: 'Adresse email',
    phone: 'Numéro de téléphone'
  };

  const contentTypePlaceholders = {
    text: 'Votre texte ici...',
    url: 'https://example.com',
    email: 'contact@example.com',
    phone: '+33 1 23 45 67 89'
  };

  return (
    <div className="space-y-4">
      {/* Type de contenu */}
      <div className="space-y-2">
        <Label>Type de contenu</Label>
        <Select value={contentType} onValueChange={setContentType as any}>
          <SelectTrigger className="bg-white/5 border-white/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black/95 border-white/20">
            {Object.entries(contentTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contenu */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Contenu</Label>
          {!isValid && <AlertCircle className="h-4 w-4 text-red-400" />}
          {isValid && content && <Check className="h-4 w-4 text-green-400" />}
        </div>
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={contentTypePlaceholders[contentType]}
          className={`bg-white/5 border-white/20 ${!isValid ? 'border-red-400' : ''}`}
        />
        {!isValid && (
          <p className="text-xs text-red-400">
            {contentType === 'url' && 'URL invalide'}
            {contentType === 'email' && 'Adresse email invalide'}
            {contentType === 'phone' && 'Numéro de téléphone invalide'}
            {contentType === 'text' && 'Texte trop long (max 2048 caractères)'}
          </p>
        )}
      </div>

      {/* Taille */}
      <div className="space-y-2">
        <Label>Taille ({size}px)</Label>
        <Slider
          value={[size]}
          onValueChange={(value) => setSize(value[0])}
          min={100}
          max={400}
          step={10}
        />
      </div>

      {/* Couleurs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Couleur QR Code</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-full bg-white/5 border-white/20"
          >
            <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: color }}></div>
            Couleur
          </Button>
          {showColorPicker && (
            <div className="mt-2">
              <HexColorPicker color={color} onChange={setColor} />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Fond transparent</Label>
            <Switch
              checked={isTransparent}
              onCheckedChange={setIsTransparent}
            />
          </div>
          {!isTransparent && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                className="w-full bg-white/5 border-white/20"
              >
                <div className="w-4 h-4 mr-2 rounded" style={{ backgroundColor: backgroundColor }}></div>
                Couleur fond
              </Button>
              {showBgColorPicker && (
                <div className="mt-2">
                  <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Niveau de correction d'erreur */}
      <div className="space-y-2">
        <Label>Niveau de correction</Label>
        <Select value={errorLevel} onValueChange={setErrorLevel as any}>
          <SelectTrigger className="bg-white/5 border-white/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black/95 border-white/20">
            <SelectItem value="L">Faible (7%)</SelectItem>
            <SelectItem value="M">Moyen (15%)</SelectItem>
            <SelectItem value="Q">Élevé (25%)</SelectItem>
            <SelectItem value="H">Très élevé (30%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Aperçu */}
      {qrCodeUrl && (
        <div className="space-y-2">
          <Label>Aperçu</Label>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-center">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="mx-auto max-w-[200px] max-h-[200px]"
            />
          </div>
        </div>
      )}

      {/* Bouton d'application */}
      <Button
        onClick={handleApplyQRCode}
        disabled={!qrCodeUrl || isGenerating}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        {isGenerating ? (
          <>
            <QrCode className="mr-2 h-4 w-4 animate-spin" />
            Génération...
          </>
        ) : (
          <>
            <QrCode className="mr-2 h-4 w-4" />
            Appliquer le QR Code
          </>
        )}
      </Button>
    </div>
  );
};
