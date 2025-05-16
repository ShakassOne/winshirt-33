
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/supabase.types';

const profileFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères",
  }),
  last_name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  }),
  email: z.string().email({
    message: "L'adresse e-mail doit être valide",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Account = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postal_code: "",
      country: "",
    },
  });

  // Fetch user and profile data
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch profile data
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (!error && profileData) {
            setProfile(profileData);
            // Update form values
            form.reset({
              first_name: profileData.first_name || "",
              last_name: profileData.last_name || "",
              email: profileData.email || session.user.email || "",
              phone: profileData.phone || "",
              address: profileData.address || "",
              city: profileData.city || "",
              postal_code: profileData.postal_code || "",
              country: profileData.country || "",
            });
          } else {
            // If no profile exists, use the email from the auth user
            form.reset({
              ...form.getValues(),
              email: session.user.email || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du profil.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, [form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
      
      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (updatedProfile) {
        setProfile(updatedProfile as UserProfile);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erreur",
        description: "Impossible de vous déconnecter.",
        variant: "destructive",
      });
    }
  };

  if (!user && !loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow pt-16 pb-20">
          <section className="relative py-16 bg-gradient-to-b from-winshirt-purple/20 to-transparent">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold">
                Mon <span className="text-gradient">Compte</span>
              </h1>
              <p className="text-white/70 mt-2">
                Vous devez être connecté pour accéder à cette page.
              </p>
              <Button 
                className="mt-4"
                onClick={() => window.location.href = "/login"}
              >
                Se connecter
              </Button>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-20">
        {/* Header */}
        <section className="relative py-16 bg-gradient-to-b from-winshirt-purple/20 to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Mon <span className="text-gradient">Compte</span>
            </h1>
            <p className="text-white/70 mt-2">
              Gérez vos informations personnelles et suivez vos commandes.
            </p>
          </div>
        </section>
        
        {/* Profile Section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Summary Card */}
              <Card className="bg-black/40 border-white/10 w-full md:w-64">
                <CardHeader>
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4 border-2 border-white/10">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-winshirt-purple/30 text-winshirt-purple text-2xl">
                        {profile?.first_name?.[0]}
                        {profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    {loading ? (
                      <div className="flex flex-col items-center space-y-2 w-full">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ) : (
                      <>
                        <CardTitle className="text-center">
                          {profile?.first_name} {profile?.last_name}
                        </CardTitle>
                        <CardDescription className="text-center">
                          {user?.email}
                        </CardDescription>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="outline" 
                      onClick={() => toast({ title: "Fonctionnalité à venir" })}
                    >
                      Modifier la photo
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleSignOut}
                    >
                      Déconnexion
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Main Content */}
              <div className="flex-1">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="bg-black/50 mb-6">
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                    <TabsTrigger value="orders">Mes commandes</TabsTrigger>
                    <TabsTrigger value="lotteries">Mes participations</TabsTrigger>
                  </TabsList>
                  
                  {/* Profile Tab */}
                  <TabsContent value="profile">
                    <Card className="bg-black/40 border-white/10">
                      <CardHeader>
                        <CardTitle>Informations personnelles</CardTitle>
                        <CardDescription>
                          Mettez à jour vos informations de profil et d'adresse.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="space-y-6">
                            {Array(6).fill(0).map((_, i) => (
                              <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="first_name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Prénom</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Votre prénom" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="last_name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nom</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Votre nom" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                  control={form.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email</FormLabel>
                                      <FormControl>
                                        <Input type="email" placeholder="votre@email.com" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="phone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Téléphone</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Votre numéro de téléphone" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <Separator className="my-6" />
                              
                              <h3 className="text-lg font-medium">Adresse de livraison</h3>
                              
                              <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Adresse</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Votre adresse" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                  control={form.control}
                                  name="city"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Ville</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Votre ville" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="postal_code"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Code postal</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Votre code postal" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="country"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Pays</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Votre pays" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <Button type="submit" className="w-full md:w-auto">
                                Enregistrer les modifications
                              </Button>
                            </form>
                          </Form>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Orders Tab */}
                  <TabsContent value="orders">
                    <Card className="bg-black/40 border-white/10">
                      <CardHeader>
                        <CardTitle>Mes commandes</CardTitle>
                        <CardDescription>
                          Historique et suivi de vos commandes.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-white/60">
                          Vous n'avez pas encore passé de commande.
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Lotteries Tab */}
                  <TabsContent value="lotteries">
                    <Card className="bg-black/40 border-white/10">
                      <CardHeader>
                        <CardTitle>Mes participations aux loteries</CardTitle>
                        <CardDescription>
                          Suivez vos participations aux loteries et vos gains potentiels.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-white/60">
                          Vous n'avez pas encore participé à une loterie.
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
