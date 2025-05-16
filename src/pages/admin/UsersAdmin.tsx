
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/supabase.types';

const UsersAdmin = () => {
  const navigate = useNavigate();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserProfile[];
    }
  });

  if (error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger la liste des utilisateurs",
      variant: "destructive",
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-20">
        {/* Header */}
        <section className="relative py-16 bg-gradient-to-b from-winshirt-blue/20 to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Gestion des <span className="text-gradient">Utilisateurs</span>
            </h1>
            <p className="text-white/70 mt-2 max-w-2xl">
              Consultez et gérez les comptes utilisateurs de votre boutique en ligne.
            </p>
          </div>
        </section>
        
        {/* Users Table */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Liste des utilisateurs</CardTitle>
                  <Button variant="outline" onClick={() => toast({ title: "Fonctionnalité à venir" })}>
                    Exporter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-white/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-white/5">
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Adresse</TableHead>
                        <TableHead>Date d'inscription</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, index) => (
                          <TableRow key={index} className="hover:bg-white/5">
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          </TableRow>
                        ))
                      ) : users && users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user.id} className="hover:bg-white/5">
                            <TableCell>
                              <div className="font-medium">{user.first_name} {user.last_name}</div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone || '-'}</TableCell>
                            <TableCell>
                              {user.address ? (
                                <span>
                                  {user.address}, {user.city} {user.postal_code}, {user.country}
                                </span>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              {user.created_at ? (
                                new Date(user.created_at).toLocaleDateString()
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast({ title: "Fonctionnalité à venir" })}
                              >
                                Détails
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-white/60">
                            Aucun utilisateur trouvé
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

export default UsersAdmin;
