
import QRCode from 'qrcode';

export interface QRCodeOptions {
  content: string;
  size: number;
  color: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  transparent?: boolean;
}

export const generateQRCode = async (options: QRCodeOptions): Promise<string> => {
  try {
    const qrOptions = {
      width: options.size,
      margin: 1,
      color: {
        dark: options.color,
        light: options.transparent ? '#00000000' : options.backgroundColor,
      },
      errorCorrectionLevel: options.errorCorrectionLevel,
    };

    const dataUrl = await QRCode.toDataURL(options.content, qrOptions);
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Impossible de générer le QR code');
  }
};

export const validateQRContent = (content: string, type: string): boolean => {
  if (!content.trim()) return false;
  
  switch (type) {
    case 'url':
      try {
        new URL(content);
        return true;
      } catch {
        return false;
      }
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(content);
    case 'phone':
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      return phoneRegex.test(content);
    case 'text':
    default:
      return content.length <= 2048; // Limite raisonnable pour QR codes
  }
};

export const formatQRContent = (content: string, type: string): string => {
  switch (type) {
    case 'email':
      return `mailto:${content}`;
    case 'phone':
      return `tel:${content}`;
    case 'url':
      return content.startsWith('http') ? content : `https://${content}`;
    case 'text':
    default:
      return content;
  }
};
