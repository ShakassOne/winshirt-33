
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Package, User, Gift, History, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Fetch user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      // Set form values
      setFirstName(data?.first_name || '');
      setLastName(data?.last_name || '');
      setEmail(user.email || '');
      setAvatarUrl(data?.avatar_url || '');
      
      return data;
    },
    enabled: !!user
  });

  // Fetch user orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['userOrders', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Fetch user lottery entries
  const { data: lotteryEntries, isLoading: lotteriesLoading } = useQuery({
    queryKey: ['userLotteries', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('lottery_entries')
        .select('*, lottery(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour mettre à jour votre profil",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          avatar_url: avatarUrl,
        });
      
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour avec succès",
        variant: "default"
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la mise à jour de votre profil",
        variant: "destructive"
      });
    }
  };
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const userInitials = firstName && lastName 
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left sidebar */}
            <div className="w-full md:w-64">
              <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                <CardHeader>
                  <div className="flex flex-col items-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">
                      {firstName} {lastName}
                    </CardTitle>
                    <CardDescription>{email}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="bg-white/5 backdrop-blur-lg border border-white/10 mb-6">
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <User size={16} />
                    <span>Mon compte</span>
                  </TabsTrigger>
                  <TabsTrigger value="orders" className="flex items-center gap-2">
                    <Package size={16} />
                    <span>Commandes</span>
                  </TabsTrigger>
                  <TabsTrigger value="lotteries" className="flex items-center gap-2">
                    <Gift size={16} />
                    <span>Loteries</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <History size={16} />
                    <span>Historique</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings size={16} />
                    <span>Paramètres</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="account">
                  <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Informations personnelles</CardTitle>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? 'Annuler' : 'Modifier'}
                        </Button>
                      </div>
                      <CardDescription>
                        Gérez vos informations personnelles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {profileLoading ? (
                        <div>Chargement...</div>
                      ) : isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">Prénom</Label>
                              <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Votre prénom"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Nom</Label>
                              <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Votre nom"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              disabled
                              placeholder="Votre email"
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              L'email ne peut pas être modifié
                            </p>
                          </div>
                          
                          <div>
                            <Label htmlFor="avatar">URL de l'avatar (optionnel)</Label>
                            <Input
                              id="avatar"
                              value={avatarUrl}
                              onChange={(e) => setAvatarUrl(e.target.value)}
                              placeholder="https://example.com/avatar.png"
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button type="submit">Enregistrer</Button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-muted-foreground">Prénom</Label>
                              <p className="font-medium">{firstName || 'Non renseigné'}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Nom</Label>
                              <p className="font-medium">{lastName || 'Non renseigné'}</p>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="font-medium">{email}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders">
                  <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                    <CardHeader>
                      <CardTitle>Historique des commandes</CardTitle>
                      <CardDescription>
                        Consultez toutes vos commandes passées
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {ordersLoading ? (
                        <div>Chargement des commandes...</div>
                      ) : orders?.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="h-16 w-16 mx-auto text-muted-foreground" />
                          <h3 className="mt-4 text-lg font-medium">Aucune commande</h3>
                          <p className="mt-1 text-muted-foreground">
                            Vous n'avez pas encore passé de commande
                          </p>
                          <Button className="mt-4" asChild>
                            <a href="/products">Voir les produits</a>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {orders?.map((order) => (
                            <div
                              key={order.id}
                              className="border border-white/10 rounded-lg overflow-hidden"
                            >
                              <div className="bg-white/5 p-4 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Commande #{order.id.substring(0, 8)}
                                  </p>
                                  <p className="font-medium">
                                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Statut</p>
                                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {order.status === 'completed' ? 'Terminée' :
                                     order.status === 'processing' ? 'En cours' :
                                     order.status === 'cancelled' ? 'Annulée' :
                                     order.status}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Total</p>
                                  <p className="font-medium">
                                    {new Intl.NumberFormat('fr-FR', {
                                      style: 'currency',
                                      currency: 'EUR'
                                    }).format(order.total_amount)}
                                  </p>
                                </div>
                                <div>
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={`/order-confirmation/${order.id}`}>
                                      Détails
                                    </a>
                                  </Button>
                                </div>
                              </div>
                              <div className="p-4">
                                <p className="text-sm font-medium mb-2">
                                  {order.order_items.length} article{order.order_items.length > 1 ? 's' : ''}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {order.order_items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="bg-white/5 rounded p-2 text-sm flex items-center gap-2"
                                    >
                                      {item.product_name} x{item.quantity}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="lotteries">
                  <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                    <CardHeader>
                      <CardTitle>Mes participations aux loteries</CardTitle>
                      <CardDescription>
                        Suivez vos participations aux loteries en cours
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {lotteriesLoading ? (
                        <div>Chargement des loteries...</div>
                      ) : lotteryEntries?.length === 0 ? (
                        <div className="text-center py-8">
                          <Gift className="h-16 w-16 mx-auto text-muted-foreground" />
                          <h3 className="mt-4 text-lg font-medium">Aucune participation</h3>
                          <p className="mt-1 text-muted-foreground">
                            Vous ne participez à aucune loterie pour le moment
                          </p>
                          <Button className="mt-4" asChild>
                            <a href="/lotteries">Voir les loteries</a>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {lotteryEntries?.map((entry) => (
                            <div
                              key={entry.id}
                              className="border border-white/10 rounded-lg overflow-hidden"
                            >
                              <div className="flex">
                                <div className="w-1/4">
                                  <img
                                    src={entry.lottery.image_url}
                                    alt={entry.lottery.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="w-3/4 p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-medium">{entry.lottery.title}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        Tirage: {new Date(entry.lottery.draw_date).toLocaleDateString('fr-FR')}
                                      </p>
                                    </div>
                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      entry.lottery.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {entry.lottery.is_active ? 'En cours' : 'Terminée'}
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <p className="text-sm">
                                      {entry.lottery.participants}/{entry.lottery.goal} participants
                                    </p>
                                    <div className="mt-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue"
                                        style={{ width: `${Math.min((entry.lottery.participants / entry.lottery.goal) * 100, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={`/lotteries/${entry.lottery.id}`}>
                                        Voir les détails
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history">
                  <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                    <CardHeader>
                      <CardTitle>Historique d'activité</CardTitle>
                      <CardDescription>
                        Historique de vos actions récentes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <History className="h-16 w-16 mx-auto text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">Historique à venir</h3>
                        <p className="mt-1 text-muted-foreground">
                          Cette fonctionnalité sera bientôt disponible
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card className="bg-white/5 backdrop-blur-lg border-white/10">
                    <CardHeader>
                      <CardTitle>Paramètres du compte</CardTitle>
                      <CardDescription>
                        Gérez les paramètres de votre compte
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-1">Mot de passe</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Changez votre mot de passe pour sécuriser votre compte
                        </p>
                        <Button variant="outline">Changer le mot de passe</Button>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-1">Notifications</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Gérez vos préférences de notification
                        </p>
                        <Button variant="outline">Gérer les notifications</Button>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-1 text-red-500">Données personnelles</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Exportez ou supprimez vos données personnelles
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline">Exporter mes données</Button>
                          <Button variant="destructive">Supprimer mon compte</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
