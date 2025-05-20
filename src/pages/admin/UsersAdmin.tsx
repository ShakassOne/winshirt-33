
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Search, ChevronRight, Settings, Shield, Ban, CheckCircle, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  } | null;
  is_banned?: boolean;
  role?: string;
}

const UsersAdmin = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Utilisons une requête à la table des utilisateurs
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('*');
      
      if (authError) {
        throw authError;
      }

      if (authUsers) {
        console.log("Loaded profiles:", authUsers.length);
        
        // Get additional user data for each profile
        const usersWithData = await Promise.all(
          authUsers.map(async (profile) => {
            try {
              // Try to get user data - this might fail if not admin
              const { data: userData, error: userError } = await supabase.auth
                .admin.getUserById(profile.id);
                
              if (userError) {
                console.log(`Could not get detailed user info for ${profile.id}:`, userError);
                // Return basic profile data
                return {
                  id: profile.id,
                  email: profile.email || 'Email inconnu',
                  created_at: profile.created_at || new Date().toISOString(),
                  last_sign_in_at: null,
                  user_metadata: {
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                  },
                  is_banned: false,
                  role: 'user'
                };
              }
              
              if (userData) {
                // Check if the user has ban_duration set to indicate they are banned
                const isBanned = userData.user.ban_duration !== null && 
                                userData.user.ban_duration !== undefined && 
                                userData.user.ban_duration !== '0 seconds';
                
                return {
                  id: userData.user.id,
                  email: userData.user.email || 'Email inconnu',
                  created_at: userData.user.created_at,
                  last_sign_in_at: userData.user.last_sign_in_at,
                  user_metadata: userData.user.user_metadata,
                  // Use the ban_duration to determine if banned
                  is_banned: isBanned,
                  role: (userData.user.app_metadata?.role || 'user') as string
                };
              }
              
              // Fallback
              return {
                id: profile.id,
                email: profile.email || 'Email inconnu',
                created_at: profile.created_at || new Date().toISOString(),
                last_sign_in_at: null,
                user_metadata: {
                  first_name: profile.first_name,
                  last_name: profile.last_name,
                },
                is_banned: false,
                role: 'user'
              };
            } catch (e) {
              console.error(`Error fetching user data for ${profile.id}:`, e);
              // Return basic profile data on error
              return {
                id: profile.id,
                email: profile.email || 'Email inconnu',
                created_at: profile.created_at || new Date().toISOString(),
                last_sign_in_at: null,
                user_metadata: {
                  first_name: profile.first_name,
                  last_name: profile.last_name,
                },
                is_banned: false,
                role: 'user'
              };
            }
          })
        );
        
        setUsers(usersWithData);
      } else {
        console.log("No users found or not authorized");
        setUsers([]);
      }
    } catch (error: any) {
      console.error("Error loading users:", error);
      setError(error.message || "Erreur lors du chargement des utilisateurs");
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs. Vous n'avez peut-être pas les droits d'administrateur.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (user.user_metadata?.first_name && user.user_metadata.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.user_metadata?.last_name && user.user_metadata.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUserClick = (user: AdminUser) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        app_metadata: { role: newRole }
      });
      
      if (error) throw error;
      
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Rôle modifié",
        description: `Le rôle a été changé en ${newRole}`,
      });
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rôle de l'utilisateur. Vérifiez que vous avez les droits d'administration.",
        variant: "destructive",
      });
    }
  };

  const handleToggleBan = async (userId: string, currentBanStatus: boolean) => {
    try {
      // Use the ban_duration parameter for the updateUserById method
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: currentBanStatus ? '0 seconds' : 'none'
      });
      
      if (error) throw error;
      
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, is_banned: !currentBanStatus } : user
      ));
      
      toast({
        title: currentBanStatus ? "Utilisateur débloqué" : "Utilisateur bloqué",
        description: currentBanStatus ? "L'utilisateur peut désormais se connecter" : "L'utilisateur ne peut plus se connecter",
      });
      
      setOpenDialog(false);
    } catch (error: any) {
      console.error("Error toggling ban status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'utilisateur. Vérifiez que vous avez les droits d'administration.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    return format(new Date(dateString), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
          <Button onClick={loadUsers} disabled={isLoading}>
            {isLoading ? "Chargement..." : "Actualiser"}
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              <p className="text-red-500 font-medium">Erreur</p>
            </div>
            <p className="mt-2 text-red-500/90">{error}</p>
            <p className="mt-2 text-red-500/90">
              Pour accéder à l'API d'administration des utilisateurs, vous devez utiliser une clé de service
              dans votre application. Les utilisateurs normaux ne peuvent pas accéder à cette fonctionnalité.
            </p>
          </div>
        )}

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Rechercher un utilisateur..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Chargement des utilisateurs...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {searchQuery ? "Aucun utilisateur ne correspond à votre recherche" : "Aucun utilisateur trouvé"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow 
                        key={user.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleUserClick(user)}
                      >
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.user_metadata?.first_name && user.user_metadata?.last_name 
                            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? "destructive" : "outline"}>
                            {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                        <TableCell>
                          {user.is_banned ? (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <Ban className="h-3 w-3" /> Bloqué
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Actif
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {selectedUser && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Détail de l'utilisateur</DialogTitle>
                <DialogDescription>
                  {selectedUser.email}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">ID de l'utilisateur</p>
                    <p className="text-xs text-muted-foreground break-all">{selectedUser.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Email</p>
                    <p>{selectedUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Prénom</p>
                    <p>{selectedUser.user_metadata?.first_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Nom</p>
                    <p>{selectedUser.user_metadata?.last_name || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Inscrit le</p>
                    <p>{formatDate(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Dernière connexion</p>
                    <p>{formatDate(selectedUser.last_sign_in_at)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Gérer le rôle</p>
                  <div className="flex gap-2">
                    <Button 
                      variant={selectedUser.role === 'user' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => handleRoleChange(selectedUser.id, 'user')}
                    >
                      Utilisateur
                    </Button>
                    <Button 
                      variant={selectedUser.role === 'admin' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleRoleChange(selectedUser.id, 'admin')}
                    >
                      Admin
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button 
                  variant="destructive" 
                  onClick={() => handleToggleBan(selectedUser.id, !!selectedUser.is_banned)}
                >
                  {selectedUser.is_banned ? 'Débloquer' : 'Bloquer'} l'utilisateur
                </Button>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>
                  Fermer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default UsersAdmin;
