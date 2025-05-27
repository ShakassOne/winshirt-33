
import React, { useState, useEffect } from 'react';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getUserOrders } from '@/services/order.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Loader2, User, Package, Calendar, Euro, Eye, Trophy, Ticket } from 'lucide-react';
import { Order } from '@/types/supabase.types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  avatar_url: string | null;
}

interface LotteryParticipation {
  id: string;
  lottery_id: string;
  created_at: string;
  lotteries: {
    title: string;
    description: string;
    value: number;
    draw_date: string;
    image_url: string;
    participants: number;
    goal: number;
  };
}

const Account = () => {
  const { user } = useOptimizedAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: ''
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Lottery participations state
  const [lotteryParticipations, setLotteryParticipations] = useState<LotteryParticipation[]>([]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        fetchProfile(),
        fetchOrders(),
        fetchLotteryParticipations()
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postal_code: data.postal_code || '',
          country: data.country || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const userOrders = await getUserOrders(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    }
  };

  const fetchLotteryParticipations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('lottery_entries')
        .select(`
          id,
          lottery_id,
          created_at,
          lotteries (
            title,
            description,
            value,
            draw_date,
            image_url,
            participants,
            goal
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLotteryParticipations(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des participations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Profil mis à jour avec succès');
      fetchProfile();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde du profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'processing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'delivered':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En traitement';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <User className="h-8 w-8 mr-3 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Mon Compte</h1>
              <p className="text-gray-400">Gérez votre profil et suivez vos activités</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Commandes ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="lotteries" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Loteries ({lotteryParticipations.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="glass-card">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-2xl">Informations Personnelles</CardTitle>
                  <CardDescription>
                    Gérez vos informations personnelles et de livraison
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">Prénom</Label>
                        <Input
                          id="first_name"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Nom</Label>
                        <Input
                          id="last_name"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-100 dark:bg-gray-800"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Votre numéro de téléphone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Votre adresse"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Votre ville"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">Code postal</Label>
                        <Input
                          id="postal_code"
                          value={formData.postal_code}
                          onChange={(e) => handleInputChange('postal_code', e.target.value)}
                          placeholder="Code postal"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Pays</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder="Votre pays"
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sauvegarde...
                        </>
                      ) : (
                        'Sauvegarder'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              {orders.length === 0 ? (
                <Card className="glass-card text-center py-12">
                  <CardContent>
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-semibold mb-2">Aucune commande</h2>
                    <p className="text-gray-400 mb-6">Vous n'avez pas encore passé de commande</p>
                    <Button asChild>
                      <Link to="/products">Découvrir nos produits</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order.id} className="glass-card">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              Commande #{order.id.slice(0, 8)}
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(order.created_at), 'dd MMMM yyyy', { locale: fr })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Euro className="h-4 w-4" />
                                {order.total_amount.toFixed(2)} €
                              </span>
                            </CardDescription>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/order-confirmation/${order.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Voir détails
                            </Link>
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="lotteries" className="mt-6">
              {lotteryParticipations.length === 0 ? (
                <Card className="glass-card text-center py-12">
                  <CardContent>
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-semibold mb-2">Aucune participation</h2>
                    <p className="text-gray-400 mb-6">Vous ne participez à aucune loterie pour le moment</p>
                    <Button asChild>
                      <Link to="/lotteries">Découvrir les loteries</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lotteryParticipations.map((participation) => (
                    <Card key={participation.id} className="glass-card">
                      <CardHeader className="p-0">
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <img
                            src={participation.lotteries.image_url}
                            alt={participation.lotteries.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                              <Ticket className="h-3 w-3 mr-1" />
                              Participant
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{participation.lotteries.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {participation.lotteries.description}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Valeur du lot:</span>
                            <span className="font-semibold text-primary">
                              {participation.lotteries.value.toFixed(2)} €
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tirage le:</span>
                            <span>
                              {format(new Date(participation.lotteries.draw_date), 'dd/MM/yyyy', { locale: fr })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Participation le:</span>
                            <span>
                              {format(new Date(participation.created_at), 'dd/MM/yyyy', { locale: fr })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Participants:</span>
                            <span>{participation.lotteries.participants}/{participation.lotteries.goal}</span>
                          </div>
                        </div>
                        <Button asChild className="w-full mt-4" variant="outline">
                          <Link to={`/lotteries/${participation.lottery_id}`}>
                            Voir la loterie
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Account;
