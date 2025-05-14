
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { fr } from 'date-fns/locale';
import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const UsersAdmin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Récupérer les utilisateurs de Supabase Auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }
      
      if (!authUsers?.users) {
        setUsers([]);
        return;
      }
      
      // Récupérer les profils des utilisateurs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) {
        throw profilesError;
      }
      
      // Fusionner les données des utilisateurs avec leurs profils
      const mergedUsers = authUsers.users.map(user => {
        const profile = profiles?.find(p => p.id === user.id) || {};
        return {
          ...user,
          profile
        };
      });
      
      setUsers(mergedUsers);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toast.error('Erreur lors de la récupération des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}` || '?';
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      
      <div className="container px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <Button onClick={() => fetchUsers()}>Actualiser</Button>
        </div>
        
        <Card className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="spinner"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-muted-foreground">Les utilisateurs inscrits apparaîtront ici.</p>
            </div>
          ) : (
            <Table>
              <TableCaption>Liste des utilisateurs inscrits</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Compte</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const profile = user.profile || {};
                  const firstName = profile.first_name || '';
                  const lastName = profile.last_name || '';
                  const fullName = `${firstName} ${lastName}`.trim() || 'Utilisateur';
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={profile.avatar_url} />
                          <AvatarFallback>{getInitials(firstName, lastName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{fullName}</div>
                          {profile.city && (
                            <div className="text-xs text-gray-400">{profile.city}, {profile.country}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        {user.email_confirmed_at ? (
                          <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
                            Vérifié
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                            En attente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default UsersAdmin;
