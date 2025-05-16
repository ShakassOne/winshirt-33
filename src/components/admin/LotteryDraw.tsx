
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlassCard from '@/components/ui/GlassCard';
import { Trophy, User, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getLotteryEntries, setLotteryWinner } from '@/services/api.service';
import { useQuery } from '@tanstack/react-query';

interface LotteryDrawProps {
  isOpen: boolean;
  onClose: () => void;
  lotteryId: string;
  lotteryTitle: string;
  onSuccess: () => void;
}

interface Participant {
  id: string;
  user_id: string | null;
  email?: string;
  name?: string;
}

const LotteryDraw: React.FC<LotteryDrawProps> = ({ isOpen, onClose, lotteryId, lotteryTitle, onSuccess }) => {
  const [drawState, setDrawState] = useState<'ready' | 'drawing' | 'complete'>('ready');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const { data: participants, isLoading, error } = useQuery({
    queryKey: ['lotteryEntries', lotteryId],
    queryFn: () => getLotteryEntries(lotteryId),
    enabled: isOpen,
  });

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startDraw = () => {
    if (!participants || participants.length === 0) {
      toast.error('Aucun participant à cette loterie');
      return;
    }

    setDrawState('drawing');

    // Shuffle effect
    let shuffleCount = 0;
    intervalRef.current = window.setInterval(() => {
      setSelectedIndex(Math.floor(Math.random() * participants.length));
      shuffleCount += 1;

      // After 30 shuffles, slow down
      if (shuffleCount === 30) {
        window.clearInterval(intervalRef.current!);
        intervalRef.current = window.setInterval(() => {
          setSelectedIndex(Math.floor(Math.random() * participants.length));
          shuffleCount += 1;

          // After 40 shuffles, slow down more
          if (shuffleCount === 40) {
            window.clearInterval(intervalRef.current!);
            intervalRef.current = window.setInterval(() => {
              setSelectedIndex(Math.floor(Math.random() * participants.length));
              shuffleCount += 1;

              // After 50 shuffles, stop and select winner
              if (shuffleCount === 50) {
                window.clearInterval(intervalRef.current!);
                const finalIndex = Math.floor(Math.random() * participants.length);
                setSelectedIndex(finalIndex);
                setWinnerId(participants[finalIndex].id);
                setDrawState('complete');
              }
            }, 300); // Even slower
          }
        }, 150); // Slower
      }
    }, 80); // Fast
  };

  const confirmWinner = async () => {
    if (!winnerId) return;

    try {
      await setLotteryWinner(lotteryId, winnerId);
      toast.success('Gagnant enregistré avec succès!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error setting winner:', error);
      toast.error('Erreur lors de l\'enregistrement du gagnant');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
      <div className="w-full max-w-3xl p-6 animate-in zoom-in-95">
        <GlassCard className="p-6 relative overflow-hidden">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold mb-1">Tirage au sort</h2>
            <p className="text-white/70">Loterie: {lotteryTitle}</p>
          </div>

          {isLoading && (
            <div className="text-center py-10">
              <p>Chargement des participants...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-10">
              <p className="text-red-500">Erreur lors du chargement des participants</p>
              <Button onClick={onClose} className="mt-4">Fermer</Button>
            </div>
          )}

          {participants && participants.length === 0 && (
            <div className="text-center py-10">
              <p>Aucun participant à cette loterie</p>
              <Button onClick={onClose} className="mt-4">Fermer</Button>
            </div>
          )}

          {participants && participants.length > 0 && (
            <>
              {/* Participants grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-6 max-h-64 overflow-y-auto p-2">
                {participants.map((participant, index) => (
                  <div 
                    key={participant.id}
                    className={`p-2 rounded-lg flex flex-col items-center justify-center text-center 
                      ${index === selectedIndex 
                        ? 'bg-winshirt-purple/80 ring-2 ring-winshirt-purple animate-pulse shadow-lg' 
                        : 'bg-white/10'}`}
                  >
                    <User className="h-8 w-8 mb-2" />
                    <p className="text-xs truncate w-full">
                      {participant.name || participant.email || 'Participant #' + (index + 1)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Selected participant */}
              {drawState !== 'ready' && (
                <div className="mb-6 text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-lg mb-2">
                    {drawState === 'drawing' ? 'Sélection en cours...' : 'Gagnant sélectionné!'}
                  </p>
                  <div className="p-3 rounded-lg inline-block bg-winshirt-purple/30">
                    <User className="h-10 w-10 mx-auto mb-2" />
                    <p className="font-bold">
                      {participants[selectedIndex]?.name || 
                       participants[selectedIndex]?.email || 
                       'Participant #' + (selectedIndex + 1)}
                    </p>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                {drawState === 'ready' && (
                  <Button onClick={startDraw} className="bg-gradient-purple">
                    <Trophy className="mr-2 h-4 w-4" />
                    Lancer le tirage
                  </Button>
                )}
                
                {drawState === 'drawing' && (
                  <Badge variant="outline" className="bg-white/10 px-3 py-1 text-md animate-pulse">
                    Tirage en cours...
                  </Badge>
                )}
                
                {drawState === 'complete' && (
                  <div className="flex gap-4">
                    <Button onClick={() => {
                      setDrawState('ready');
                      setWinnerId(null);
                    }} variant="outline">
                      Recommencer
                    </Button>
                    <Button onClick={confirmWinner}>
                      <Check className="mr-2 h-4 w-4" />
                      Confirmer le gagnant
                    </Button>
                  </div>
                )}
                
                <Button onClick={onClose} variant="ghost">Annuler</Button>
              </div>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default LotteryDraw;
