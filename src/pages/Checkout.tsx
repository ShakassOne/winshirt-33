import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, CheckCircle, MailCheck, User } from 'lucide-react';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string;
}

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    email: '',
    phone: '',
  });
  const [accountDetails, setAccountDetails] = useState({
    password: '',
    confirmPassword: '',
  });
  const [notes, setNotes] = useState('');
  const [createAccount, setCreateAccount] = useState(false);
  const [checkoutTab, setCheckoutTab] = useState<string>('guest');
  const [currentUser, setCurrentUser] = useState<any>(null);

  React.useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setCurrentUser(data.session.user);
        
        // If user is logged in, fetch their profile to pre-fill shipping details
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData) {
          setShippingAddress({
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            address: profileData.address || '',
            // Handle missing city, postal_code, and country in the profile schema
            city: '',  // Default to empty string since it doesn't exist in the profile
            postalCode: '',  // Default to empty string since it doesn't exist in the profile
            country: 'France',  // Default country since it doesn't exist in the profile
            email: data.session.user.email || '',
            phone: profileData.phone || '',
          });
        }
      }
    };
    
    checkUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountDetails({ ...accountDetails, [name]: value });
  };

  const validateFields = () => {
    const requiredFields = [
      'firstName', 'lastName', 'address', 'city', 'postalCode', 'email'
    ];
    
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        toast.error(`Le champ ${field} est obligatoire`);
        return false;
      }
    }
    
    if (createAccount && checkoutTab === 'guest') {
      if (accountDetails.password.length < 6) {
        toast.error("Le mot de passe doit contenir au moins 6 caractères");
        return false;
      }
      
      if (accountDetails.password !== accountDetails.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return false;
      }
    }
    
    if (cartItems.length === 0) {
      toast.error("Votre panier est vide");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFields()) return;
    
    setIsProcessing(true);
    
    try {
      let userId = currentUser?.id;
      
      // Create account if requested and not logged in
      if (createAccount && checkoutTab === 'guest') {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: shippingAddress.email,
          password: accountDetails.password,
          options: {
            data: {
              first_name: shippingAddress.firstName,
              last_name: shippingAddress.lastName,
            }
          }
        });
        
        if (authError) {
          console.error("Auth error:", authError);
          toast.error(authError.message);
          setIsProcessing(false);
          return;
        }
        
        userId = authData.user?.id;
        
        // Update profile with shipping details
        await supabase.from('profiles').update({
          first_name: shippingAddress.firstName,
          last_name: shippingAddress.lastName,
          address: shippingAddress.address,
          phone: shippingAddress.phone,
          // Note: We don't update city, postal_code, or country since they don't exist in the schema
        }).eq('id', userId);
      }
      
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: totalPrice,
          status: 'pending',
          shipping_address: {
            ...shippingAddress,
            notes
          },
        })
        .select()
        .single();
      
      if (orderError) {
        console.error("Order error:", orderError);
        toast.error("Erreur lors de la création de la commande");
        setIsProcessing(false);
        return;
      }
      
      // Add order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization || null,
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        console.error("Order items error:", itemsError);
        toast.error("Erreur lors de l'ajout des articles à la commande");
        setIsProcessing(false);
        return;
      }
      
      // If there are lottery tickets offered with products, add lottery entries
      const lotteryEntries = cartItems.flatMap(item => {
        if (item.lotteries && item.lotteries.length > 0) {
          return item.lotteries.map(lotteryId => ({
            lottery_id: lotteryId,
            user_id: userId,
          }));
        }
        return [];
      });
      
      if (lotteryEntries.length > 0) {
        await supabase.from('lottery_entries').insert(lotteryEntries);
      }
      
      // Create a Stripe checkout session
      const { data: stripeData, error: stripeError } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          orderId: orderData.id,
          items: cartItems,
          customerEmail: shippingAddress.email,
        },
      });
      
      if (stripeError || !stripeData?.url) {
        console.error("Stripe error:", stripeError || "No URL returned");
        toast.error("Erreur de connexion au service de paiement");
        setIsProcessing(false);
        return;
      }
      
      // Redirect to Stripe checkout
      clearCart();
      window.location.href = stripeData.url;
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Une erreur est survenue lors de la validation de la commande");
      setIsProcessing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const email = (e.currentTarget as HTMLFormElement).email.value;
    const password = (e.currentTarget as HTMLFormElement).password.value;
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    setIsProcessing(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      toast.error(error.message);
      setIsProcessing(false);
      return;
    }
    
    setCurrentUser(data.user);
    setCheckoutTab('shipping');
    setIsProcessing(false);
    toast.success("Connexion réussie");
  };

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-8">Finaliser votre commande</h1>
      
      {currentUser ? (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-8 flex items-center gap-4">
          <div className="p-2 bg-primary/20 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Connecté en tant que 
            </p>
            <p className="font-medium">{currentUser.email}</p>
          </div>
        </div>
      ) : (
        <Tabs
          value={checkoutTab}
          onValueChange={setCheckoutTab}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="guest">Achat rapide</TabsTrigger>
            <TabsTrigger value="login">Se connecter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guest">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Commandez rapidement sans créer de compte ou connectez-vous pour accéder à votre historique de commandes.
              </p>
              
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox 
                  id="createAccount" 
                  checked={createAccount}
                  onCheckedChange={(checked) => setCreateAccount(checked === true)}
                />
                <Label htmlFor="createAccount" className="text-sm font-normal">
                  Créer un compte pour suivre vos commandes
                </Label>
              </div>
              
              {createAccount && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={accountDetails.password}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={accountDetails.confirmPassword}
                      onChange={handleAccountChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="login">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isProcessing}>
                  {isProcessing ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-medium mb-4">Information de livraison</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={shippingAddress.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={shippingAddress.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal *</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={handleInputChange}
                    required
                    disabled={!!currentUser}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes de commande</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Instructions spéciales pour votre commande"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-purple"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Traitement...' : 'Procéder au paiement'}
              </Button>
            </div>
          </form>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-4">Résumé de commande</h2>
            
            <div className="max-h-[400px] overflow-y-auto space-y-4 mb-4">
              {cartItems.map((item) => (
                <div 
                  key={`${item.productId}-${item.color}-${item.size}`} 
                  className="flex gap-3 pb-3 border-b border-white/10"
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                    <img 
                      src={item.customization?.designUrl || item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{item.name}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {item.color && (
                        <div className="flex items-center gap-1">
                          <span>Couleur:</span>
                          <div 
                            className="w-2 h-2 rounded-full border border-white/30" 
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                      )}
                      
                      {item.size && (
                        <span>Taille: {item.size}</span>
                      )}
                      
                      <span>Qté: {item.quantity}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 mt-4 pt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
