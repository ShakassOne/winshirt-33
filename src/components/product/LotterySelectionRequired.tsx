
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LotterySelectionRequiredProps {
  show?: boolean;
  open?: boolean;
  onClose?: () => void;
  onLotterySelect?: (lottery: string) => void;
}

export const LotterySelectionRequired: React.FC<LotterySelectionRequiredProps> = ({ 
  show, 
  open, 
  onClose, 
  onLotterySelect 
}) => {
  // If used as modal (with open prop), render as dialog
  if (open !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sélection de loterie requise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                Veuillez sélectionner toutes les loteries avant d'ajouter ce produit au panier.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline">
                Annuler
              </Button>
              <Button onClick={() => onLotterySelect?.('default')}>
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // If used as inline alert (with show prop), render as alert
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
