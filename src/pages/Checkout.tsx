import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { CheckoutFormData } from '@/types/cart.types';
import { createOrder } from '@/services/order.service';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

// Schéma de validation pour le formulaire de checkout
const checkoutSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide"),
  address: z.string().min(5, "Adresse invalide"),
  city: z.string().min(2, "Ville invalide"),
  postalCode: z.string().min(5, "Code postal invalide"),
  country: z.string().min(2, "Pays invalide"),
  deliveryNotes: z.string().optional(),
  createAccount: z.boolean().default(false),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").optional()
    .refine(
      (pw, ctx) => !ctx.parent.createAccount || (pw && pw.length >= 6),
      { message: "Le mot de passe est requis pour créer un compte" }
    ),
});

const Checkout = () => {
  const { items, total, sessionId, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Vérifie si l'utilisateur est connecté
  React.useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        
        // Récupère les informations du profil pour pré-remplir le formulaire
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData) {
          form.reset({
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            email: data.session.user.email || '',
            phone: profileData.phone || '',
            address: profileData.address || '',
            city: profileData.city || '',
            postalCode: profileData.postal_code || '',
            country: profileData.country || '',
            deliveryNotes: '',
            createAccount: false
          });
        }
      }
    };
    
    checkUser();
  }, []);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      deliveryNotes: '',
      createAccount: false,
      password: ''
    }
  });

  const createAccount = form.watch('createAccount');

  const onSubmit = async (data: CheckoutFormData) => {
    console.log("Form submitted with data:", data);
    try {
      setIsLoading(true);
      
      let userId = user?.id;
      
      // Si l'utilisateur veut créer un compte et n'est pas connecté
      if (data.createAccount && !user) {
        console.log("Creating account for user");
        const { error, data: authData } = await supabase.auth.signUp({
          email: data.email,
          password: data.password as string,
          options: {
            data: {
              first_name: data.firstName,
              last_name: data.lastName
            }
          }
        });
        
        if (error) {
          console.error("Error creating account:", error);
          throw error;
        }
        
        userId = authData.user?.id;
        console.log("Account created, user ID:", userId);
        
        // Crée ou met à jour le profil utilisateur
        if (userId) {
          console.log("Creating user profile");
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              first_name: data.firstName,
              last_name: data.lastName,
              email: data.email,
              phone: data.phone,
              address: data.address,
              city: data.city,
              postal_code: data.postalCode,
              country: data.country
            });
            
          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
        }
      }
      
      // Crée la commande
      console.log("Creating order with items:", items);
      const order = await createOrder(data, items, sessionId, userId);
      console.log("Order created:", order);
      
      // Vide le panier après la création de la commande
      const cleared = await clearCart();
      console.log("Cart cleared:", cleared);
      
      toast.success("Commande créée avec succès!");
      
      // Redirige vers la page de paiement
      console.log("Redirecting to payment page:", `/payment/${order.id}`);
      navigate(`/payment/${order.id}`);
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      toast.error("Une erreur est survenue lors de la création de la commande");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Finaliser votre commande</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Informations de livraison</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Prénom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Nom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Email" type="email" {...field} />
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
                              <Input placeholder="Téléphone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Input placeholder="Adresse" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input placeholder="Ville" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code Postal</FormLabel>
                            <FormControl>
                              <Input placeholder="Code Postal" {...field} />
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
                              <Input placeholder="Pays" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="deliveryNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructions de livraison (optionnel)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Instructions spéciales pour la livraison..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {!user && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="createAccount"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Créer un compte</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Créez un compte pour suivre vos commandes et conserver vos informations
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        {createAccount && (
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Mot de passe" 
                                    type="password" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    )}
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Traitement en cours..." : "Procéder au paiement"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4">Résumé de la commande</h2>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.cartItemId || item.productId} className="flex gap-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="font-medium">{item.name}</p>
                          <p>{(item.price * item.quantity).toFixed(2)} €</p>
                        </div>
                        <div className="text-sm text-gray-400">
                          Qté: {item.quantity}
                          {item.color && ` • ${item.color}`}
                          {item.size && ` • ${item.size}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sous-total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Livraison</span>
                    <span>Gratuite</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2">
                    <span>Total</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
