
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Award, Mail } from 'lucide-react';

type Winner = {
  id: string;
  lottery_id: string;
  user_id: string;
  claimed: boolean;
  created_at?: string;
  lottery: {
    title: string;
    value: number;
    image_url: string;
  };
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
};

const WinnersAdmin = () => {
  const { data: winners, isLoading, error } = useQuery({
    queryKey: ['admin-winners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('winners')
        .select(`
          *,
          lottery:lottery_id (title, value, image_url),
          profile:user_id (first_name, last_name, email, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Winner[];
    }
  });

  if (error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger la liste des gagnants",
      variant: "destructive",
    });
  }

  const contactWinner = (email: string) => {
    toast({
      title: "E-mail préparé",
      description: `Un e-mail pour ${email} a été préparé.`,
    });
  };

  const markAsClaimed = (winnerId: string, claimed: boolean) => {
    toast({
      title: claimed ? "Prix réclamé" : "Marque non réclamé",
      description: `Le statut du prix a été mis à jour.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-20">
        {/* Header */}
        <section className="relative py-16 bg-gradient-to-b from-yellow-500/20 to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <Award className="h-8 w-8 text-yellow-500" />
              Gestion des <span className="text-gradient">Gagnants</span>
            </h1>
            <p className="text-white/70 mt-2 max-w-2xl">
              Suivez et gérez les gagnants des loteries et l'attribution des prix.
            </p>
          </div>
        </section>
        
        {/* Winners Table */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Liste des gagnants</CardTitle>
                  <Button 
                    variant="outline" 
                    onClick={() => toast({ title: "Fonctionnalité à venir", description: "Tirage au sort automatisé" })}
                  >
                    Lancer un tirage au sort
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-white/10 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-white/5">
                        <TableHead>Gagnant</TableHead>
                        <TableHead>Loterie</TableHead>
                        <TableHead>Date du tirage</TableHead>
                        <TableHead>Valeur</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, index) => (
                          <TableRow key={index} className="hover:bg-white/5">
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-28 ml-auto" /></TableCell>
                          </TableRow>
                        ))
                      ) : winners && winners.length > 0 ? (
                        winners.map((winner) => (
                          <TableRow key={winner.id} className="hover:bg-white/5">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-9 w-9 border border-white/10">
                                  <AvatarImage src={winner.profile?.avatar_url} />
                                  <AvatarFallback className="bg-yellow-500/30 text-yellow-500">
                                    {winner.profile?.first_name?.[0]}
                                    {winner.profile?.last_name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {winner.profile?.first_name} {winner.profile?.last_name}
                                  </div>
                                  <div className="text-xs text-white/60">{winner.profile?.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded bg-black/30 overflow-hidden">
                                  {winner.lottery?.image_url && (
                                    <img
                                      src={winner.lottery.image_url}
                                      alt={winner.lottery.title}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div>{winner.lottery?.title}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {winner.created_at && new Date(winner.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{winner.lottery?.value.toFixed(2)} €</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${winner.claimed ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                {winner.claimed ? 'Réclamé' : 'En attente de réclamation'}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => contactWinner(winner.profile?.email)}
                                >
                                  <Mail className="h-4 w-4 mr-1" /> Contacter
                                </Button>
                                <Button
                                  variant={winner.claimed ? "destructive" : "outline"}
                                  size="sm"
                                  onClick={() => markAsClaimed(winner.id, !winner.claimed)}
                                >
                                  {winner.claimed ? 'Non réclamé' : 'Réclamé'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-white/60">
                            Aucun gagnant trouvé
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default WinnersAdmin;
