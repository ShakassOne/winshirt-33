import logger from '@/utils/logger';

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
      // First, get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        throw profilesError;
      }

      // Then, get all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) {
        console.error('Error loading roles:', rolesError);
        // Continue without roles if there's an error
      }

      if (profilesData) {
        logger.log("Loaded profiles:", profilesData.length);
        logger.log("Loaded roles:", rolesData?.length || 0);
        
        // Create a map of user roles for easy lookup
        const roleMap = new Map();
        if (rolesData) {
          rolesData.forEach(roleItem => {
            roleMap.set(roleItem.user_id, roleItem.role);
          });
        }
        
        // Map profiles to AdminUser format with roles
        const usersWithRoles = profilesData.map((profile) => {
          const userRole = roleMap.get(profile.id) || 'user';
          
          return {
            id: profile.id,
            email: profile.email || 'Email inconnu',
            created_at: profile.created_at || new Date().toISOString(),
            last_sign_in_at: null, // We can't access auth.users directly
            user_metadata: {
              first_name: profile.first_name,
              last_name: profile.last_name,
            },
            is_banned: false, // Would need admin API access to check this
            role: userRole
          };
        });
        
        setUsers(usersWithRoles);
      } else {
        logger.log("No users found or not authorized");
        setUsers([]);
      }
    } catch (error: any) {
      console.error("Error loading users:", error);
      setError(error.message || "Erreur lors du chargement des utilisateurs");
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs. Vérifiez que vous avez les droits d'administrateur.",
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
      // Validate role
      if (!['admin', 'user'].includes(newRole)) {
        throw new Error('Invalid role');
      }

      // Cast newRole to the correct type
      const roleValue = newRole as 'admin' | 'user';

      // Update or insert user role
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: roleValue,
        });
      
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      // Update selected user if it's the same one
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
      
      toast({
        title: "Succès",
        description: `Le rôle de l'utilisateur a été mis à jour vers ${newRole === 'admin' ? 'Administrateur' : 'Utilisateur'}.`,
      });
      
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rôle de l'utilisateur.",
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
              
              <DialogFooter className="flex justify-end">
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
