import logger from '@/utils/logger';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { CheckoutFormData } from '@/types/cart.types';
import { ShippingOption } from '@/types/shipping.types';
import { createOrder } from '@/services/order.service';
import { migrateCartToUser } from '@/services/cart.service';
import { getShippingOptions } from '@/services/shipping.service';
import ShippingOptions from '@/components/checkout/ShippingOptions';
import StripeProvider from '@/components/payment/StripeProvider';
import StripePaymentModal from '@/components/payment/StripePaymentModal';
import GooglePlacesAutocomplete from '@/components/ui/GooglePlacesAutocomplete';
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
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Liste des pays avec codes ISO
const countries = [
  { code: 'FR', name: 'France' },
  { code: 'BE', name: 'Belgique' },
  { code: 'CH', name: 'Suisse' },
  { code: 'ES', name: 'Espagne' },
  { code: 'IT', name: 'Italie' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'GB', name: 'Royaume-Uni' },
  { code: 'US', name: 'États-Unis' },
  { code: 'CA', name: 'Canada' },
];

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
  password: z.string().optional(),
  selectedShippingOption: z.string().min(1, "Veuillez sélectionner une option de livraison")
}).refine(
  (data) => !data.createAccount || (data.password && data.password.length >= 6),
  {
    message: "Le mot de passe doit contenir au moins 6 caractères pour créer un compte",
    path: ["password"]
  }
);

const Checkout = () => {
  const { items, total, cartToken, currentUser, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingCost, setSelectedShippingCost] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  React.useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        
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
            country: profileData.country || 'FR',
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
      country: 'FR',
      deliveryNotes: '',
      createAccount: false,
      password: '',
      selectedShippingOption: ''
    }
  });

  const createAccount = form.watch('createAccount');
  const selectedShippingOption = form.watch('selectedShippingOption');

  useEffect(() => {
    const loadShippingOptions = async () => {
      try {
        const options = await getShippingOptions();
        setShippingOptions(options);
        
        if (options.length > 0 && !selectedShippingOption) {
          form.setValue('selectedShippingOption', options[0].id);
          setSelectedShippingCost(options[0].price);
        }
      } catch (error) {
        console.error('Error loading shipping options:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les options de livraison",
          variant: "destructive",
        });
      }
    };

    loadShippingOptions();
  }, []);

  useEffect(() => {
    const option = shippingOptions.find(opt => opt.id === selectedShippingOption);
    if (option) {
      setSelectedShippingCost(option.price);
    }
  }, [selectedShippingOption, shippingOptions]);

  const handleShippingOptionChange = (optionId: string) => {
    form.setValue('selectedShippingOption', optionId);
    const option = shippingOptions.find(opt => opt.id === optionId);
    if (option) {
      setSelectedShippingCost(option.price);
    }
  };

  const handleAddressSelect = (addressComponents: any) => {
    // Auto-fill the form fields when an address is selected
    if (addressComponents.address) {
      form.setValue('address', addressComponents.address);
    }
    if (addressComponents.city) {
      form.setValue('city', addressComponents.city);
    }
    if (addressComponents.postalCode) {
      form.setValue('postalCode', addressComponents.postalCode);
    }
    if (addressComponents.country) {
      form.setValue('country', addressComponents.country);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    logger.log("Checkout form submitted with data:", data);
    logger.log("Cart items:", items);
    logger.log("Cart token:", cartToken);
    
    if (!items || items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Votre panier est vide. Ajoutez des produits avant de procéder au paiement.",
        variant: "destructive",
      });
      return;
    }

    if (!cartToken) {
      toast({
        title: "Erreur",
        description: "Token de panier manquant. Veuillez rafraîchir la page.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      logger.log("Starting checkout process...");
      
      let userId = user?.id;
      
      if (data.createAccount && !user) {
        logger.log("Creating new account...");
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
        
        if (userId && cartToken) {
          await migrateCartToUser(userId, cartToken);
          toast({
            title: "Panier migrée",
            description: "Votre panier a été associé à votre nouveau compte",
          });
        }
        
        if (userId) {
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
            
          if (profileError) console.error("Erreur lors de la création du profil:", profileError);
        }
      }
      
      logger.log("Creating order...");
      const order = await createOrder(data, items, cartToken, userId);
      logger.log("Order created:", order);
      
      setCurrentOrderId(order.id);
      setShowPaymentModal(true);
      
      toast({
        title: "Commande créée avec succès!",
        description: "Procédez maintenant au paiement.",
      });
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de la création de la commande: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string) => {
    setShowPaymentModal(false);
    await clearCart();
    navigate('/payment-success', { 
      state: { orderId } 
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    logger.log("Form submit triggered");
    e.preventDefault();
    form.handleSubmit(onSubmit)(e);
  };

  const finalTotal = total + selectedShippingCost;

  return (
    <StripeProvider>
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
                    <form onSubmit={handleFormSubmit} className="space-y-6">
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
                            <GooglePlacesAutocomplete
                              onAddressSelect={handleAddressSelect}
                              value={field.value}
                              onChange={field.onChange}
                              error={form.formState.errors.address?.message}
                              placeholder="Commencez à taper votre adresse..."
                              label="Adresse"
                            />
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un pays" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                      {country.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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
                      
                      <div className="pt-6 border-t border-gray-100/10">
                        <FormField
                          control={form.control}
                          name="selectedShippingOption"
                          render={({ field }) => (
                            <FormItem>
                              <ShippingOptions
                                options={shippingOptions}
                                selectedOption={field.value}
                                onOptionChange={handleShippingOptionChange}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
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
                          onClick={(e) => {
                            logger.log("Button clicked");
                          }}
                        >
                          {isLoading ? "Création de la commande..." : "Procéder au paiement"}
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
                      <div key={item.productId} className="flex gap-3">
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
                      <span>
                        {selectedShippingCost > 0 ? `${selectedShippingCost.toFixed(2)} €` : 'Gratuite'}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 text-lg">
                      <span>Total</span>
                      <span>{finalTotal.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {showPaymentModal && currentOrderId && (
          <StripePaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={handlePaymentSuccess}
            checkoutData={form.getValues()}
            items={items}
            total={finalTotal}
            orderId={currentOrderId}
          />
        )}
        
        <Footer />
      </div>
    </StripeProvider>
  );
};

export default Checkout;
