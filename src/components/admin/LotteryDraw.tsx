
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getLotteryEntriesWithUserDetails, setLotteryWinner } from '@/services/api.service';
import { Confetti } from '@/components/ui/Confetti';
import { toast } from 'sonner';

interface Participant {
  id: string;
  user_id: string;
  lottery_id: string;
  order_item_id: string;
  created_at: string;
  name: string;
  email: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
}

interface LotteryDrawProps {
  isOpen: boolean;
  onClose: () => void;
  lotteryId: string;
  onSuccess?: () => void;
}

const LotteryDraw = ({ isOpen, onClose, lotteryId, onSuccess }: LotteryDrawProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast: toastNotification } = useToast();
  
  const intervalRef = useRef<number | null>(null);
  
  // Fetch participants
  useEffect(() => {
    const fetchParticipants = async () => {
      if (isOpen && lotteryId) {
        setIsLoading(true);
        try {
          const entries = await getLotteryEntriesWithUserDetails(lotteryId);
          setParticipants(entries);
        } catch (error) {
          console.error('Error fetching lottery entries:', error);
          toastNotification({
            title: "Erreur",
            description: "Impossible de charger les participants à la loterie",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchParticipants();
    
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isOpen, lotteryId, toastNotification]);
  
  const startDraw = () => {
    if (participants.length === 0) return;
    
    setIsDrawing(true);
    setSelectedIndex(Math.floor(Math.random() * participants.length));
    
    // Start animation
    intervalRef.current = window.setInterval(() => {
      setSelectedIndex(Math.floor(Math.random() * participants.length));
    }, 100);
    
    // Stop after 3 seconds and select winner
    setTimeout(() => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      const winnerIndex = Math.floor(Math.random() * participants.length);
      setSelectedIndex(winnerIndex);
      setWinner(participants[winnerIndex]);
      setShowConfetti(true);
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }, 3000);
  };
  
  const confirmWinner = async () => {
    if (!winner) return;
    
    try {
      await setLotteryWinner(lotteryId, winner.id);
      
      toast.success("Le gagnant a été enregistré avec succès !");
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error setting lottery winner:', error);
      toastNotification({
        title: "Erreur",
        description: "Impossible d'enregistrer le gagnant",
        variant: "destructive",
      });
    }
  };
  
  const resetDraw = () => {
    setIsDrawing(false);
    setSelectedIndex(null);
    setWinner(null);
  };
  
  return (
    <>
      {showConfetti && <Confetti />}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Tirage au sort de la loterie
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-white/70" />
                <p className="ml-2">Chargement des participants...</p>
              </div>
            ) : participants.length === 0 ? (
              <div className="text-center py-8">
                <p>Aucun participant à cette loterie</p>
              </div>
            ) : (
              <div className="space-y-6">
                {!winner ? (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-lg">{participants.length} participants</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4">
                      {participants.map((participant, index) => (
                        <div 
                          key={participant.id}
                          className={`
                            p-3 rounded-lg border text-center
                            ${selectedIndex === index ? 'border-winshirt-purple bg-winshirt-purple/30 scale-110' : 'border-white/20 bg-black/30'}
                            transition-all duration-200
                          `}
                        >
                          <div className="font-medium truncate">{participant.name}</div>
                          <div className="text-xs text-white/70 truncate">{participant.email}</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-32 h-32 rounded-full bg-winshirt-purple/30 flex items-center justify-center mb-6">
                      <Trophy className="h-16 w-16 text-yellow-500" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">Félicitations !</h3>
                    <p className="text-xl mb-1">{winner.name}</p>
                    <p className="text-white/70 mb-6">{winner.email}</p>
                    
                    <p className="text-center text-white/70 max-w-md mb-4">
                      Ce participant a été sélectionné comme le gagnant de cette loterie.
                      Confirmez pour enregistrer ce résultat ou tirez à nouveau.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div>
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
            </div>
            
            <div className="flex gap-2">
              {!isLoading && participants.length > 0 && (
                winner ? (
                  <>
                    <Button variant="outline" onClick={resetDraw}>
                      Nouveau tirage
                    </Button>
                    <Button variant="default" onClick={confirmWinner}>
                      Confirmer le gagnant
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="default"
                    onClick={startDraw}
                    disabled={isDrawing}
                  >
                    {isDrawing ? 'Tirage en cours...' : 'Lancer le tirage'}
                  </Button>
                )
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LotteryDraw;
