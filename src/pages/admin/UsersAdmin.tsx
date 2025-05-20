
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

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        throw error;
      }

      if (data && data.users) {
        console.log("Loaded users:", data.users.length);
        setUsers(data.users.map(user => ({
          id: user.id,
          email: user.email || 'Email inconnu',
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          user_metadata: user.user_metadata,
          is_banned: user.banned || false,
          role: (user.app_metadata?.role || 'user') as string
        })));
      } else {
        console.log("No users found or not authorized");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
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
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rôle de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const handleToggleBan = async (userId: string, currentBanStatus: boolean) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        banned: !currentBanStatus
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
    } catch (error) {
      console.error("Error toggling ban status:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'utilisateur",
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
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
          <Button onClick={loadUsers} disabled={isLoading}>
            {isLoading ? "Chargement..." : "Actualiser"}
          </Button>
        </div>

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
