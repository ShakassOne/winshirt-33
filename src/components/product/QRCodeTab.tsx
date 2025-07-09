import React from 'react';
import { Button } from '@/components/ui/button';
import { QRCodeGenerator } from './QRCodeGenerator';
import { Design } from '@/types/supabase.types';

interface QRCodeTabProps {
  onQRCodeGenerated: (qrCodeUrl: string) => void;
  onRemoveDesign: () => void;
  selectedDesign: Design | null;
}

export const QRCodeTab: React.FC<QRCodeTabProps> = ({
  onQRCodeGenerated,
  onRemoveDesign,
  selectedDesign
}) => {
  const handleQRCodeGenerated = (qrCodeUrl: string) => {
    onQRCodeGenerated(qrCodeUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Générateur QR Code</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRemoveDesign}
          disabled={!selectedDesign}
        >
          Réinitialiser
        </Button>
      </div>
      
      <QRCodeGenerator
        onQRCodeGenerated={handleQRCodeGenerated}
        defaultContent=""
        defaultColor="#000000"
      />
    </div>
  );
};