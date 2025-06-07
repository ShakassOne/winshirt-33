
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LotterySelectionRequiredProps {
  show: boolean;
}

export const LotterySelectionRequired: React.FC<LotterySelectionRequiredProps> = ({ show }) => {
  if (!show) return null;

  return (
    <Alert className="bg-red-500/10 border-red-500/20 mb-4">
      <AlertCircle className="h-4 w-4 text-red-400" />
      <AlertDescription className="text-red-400">
        Veuillez sélectionner au moins une loterie avant d'ajouter ce produit au panier.
      </AlertDescription>
    </Alert>
  );
};
