import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { createOrder } from '@/services/order.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { CartItem } from '@/types/supabase.types';
import { CheckoutFormData } from '@/types/cart.types';

const checkoutSchema = z.object({
  shipping_first_name: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  shipping_last_name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  shipping_email: z.string().email({ message: 'Adresse e-mail invalide' }),
  shipping_phone: z.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, { message: 'Numéro de téléphone invalide' }),
  shipping_address: z.string().min(5, { message: 'L\'adresse doit contenir au moins 5 caractères' }),
  shipping_city: z.string().min(2, { message: 'La ville doit contenir au moins 2 caractères' }),
  shipping_postal_code: z.string().regex(/^[0-9]{5}$/, { message: 'Code postal invalide' }),
  shipping_country: z.string().min(2, { message: 'Le pays doit contenir au moins 2 caractères' }),
  delivery_notes: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  createAccount: z.boolean().default(false),
  password: z.string().min(6).optional(),
});

const defaultValues = {
  shipping_first_name: '',
  shipping_last_name: '',
  shipping_email: '',
  shipping_phone: '',
  shipping_address: '',
  shipping_city: '',
  shipping_postal_code: '',
  shipping_country: '',
  delivery_notes: '', // Use delivery_notes instead of deliveryNotes
  // Additional backwards compatibility fields
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  createAccount: false,
  password: ''
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, total } = useCart();
  const { currentUser, signUp } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartToken, setCartToken] = useState<string | null>(localStorage.getItem('cartToken'));
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (!cartToken) {
      const newToken = Math.random().toString(36).substring(2, 15);
      setCartToken(newToken);
      localStorage.setItem('cartToken', newToken);
    }
  }, [cartToken]);

  const createAccount = watch("createAccount");

  const handleCreateOrder = async (formData: CheckoutFormData) => {
    try {
      setIsProcessing(true);
      
      // Create new user account if requested
      if (formData.createAccount && formData.email && formData.password) {
        try {
          const { error } = await signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                postalCode: formData.postalCode,
                country: formData.country,
              },
            },
          });
          if (error) {
            throw error;
          }
          toast({
            title: "Compte créé avec succès",
            description: "Vous pouvez maintenant vous connecter avec votre nouveau compte.",
          });
        } catch (signUpError: any) {
          console.error("Error signing up:", signUpError);
          toast({
            title: "Erreur lors de la création du compte",
            description: signUpError.message || "Une erreur s'est produite lors de la création du compte.",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
      }
      
      // Create the order in the database
      const order = await createOrder(
        {
          shipping_first_name: formData.shipping_first_name || formData.firstName || '',
          shipping_last_name: formData.shipping_last_name || formData.lastName || '',
          shipping_email: formData.shipping_email || formData.email || '',
          shipping_phone: formData.shipping_phone || formData.phone || '',
          shipping_address: formData.shipping_address || formData.address || '',
          shipping_city: formData.shipping_city || formData.city || '',
          shipping_postal_code: formData.shipping_postal_code || formData.postalCode || '',
          shipping_country: formData.shipping_country || formData.country || '',
          delivery_notes: formData.delivery_notes || formData.deliveryNotes || '', // Use both for compatibility
          // Add other required fields
          firstName: formData.firstName || formData.shipping_first_name || '',
          lastName: formData.lastName || formData.shipping_last_name || '',
          email: formData.email || formData.shipping_email || '',
          phone: formData.phone || formData.shipping_phone || '',
          address: formData.address || formData.shipping_address || '',
          city: formData.city || formData.shipping_city || '',
          postalCode: formData.postalCode || formData.shipping_postal_code || '',
          country: formData.country || formData.shipping_country || '',
          deliveryNotes: formData.deliveryNotes || formData.delivery_notes || '' // For backwards compatibility
        },
        items,
        cartToken || 'guest',
        currentUser?.id
      );
      
      if (order) {
        toast({
          title: "Commande créée",
          description: "Votre commande a été créée avec succès. Vous allez être redirigé vers la page de paiement.",
        });
        clearCart();
        navigate(`/order-confirmation/${order.id}`);
      } else {
        toast({
          title: "Erreur lors de la création de la commande",
          description: "Une erreur s'est produite lors de la création de la commande.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        title: "Erreur lors de la création de la commande",
        description: error.message || "Une erreur s'est produite lors de la création de la commande.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          {items.map((item: CartItem) => (
            <div key={item.productId} className="flex items-center justify-between py-2 border-b border-gray-200">
              <div className="flex items-center">
                <img src={item.image_url || '/placeholder-image.png'} alt={item.name} className="w-12 h-12 object-cover rounded mr-2" />
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-semibold">Total</div>
            <div className="text-lg font-semibold">{formatCurrency(total || 0)}</div>
          </div>
        </div>
        
        {/* Checkout Form */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
            <CardDescription>Enter your shipping details below:</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shipping_first_name">First Name</Label>
                <Input id="shipping_first_name" placeholder="John" {...register('shipping_first_name')} />
                {errors.shipping_first_name && (
                  <p className="text-red-500 text-sm">{errors.shipping_first_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_last_name">Last Name</Label>
                <Input id="shipping_last_name" placeholder="Doe" {...register('shipping_last_name')} />
                {errors.shipping_last_name && (
                  <p className="text-red-500 text-sm">{errors.shipping_last_name.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_email">Email</Label>
              <Input id="shipping_email" placeholder="john.doe@example.com" {...register('shipping_email')} />
              {errors.shipping_email && (
                <p className="text-red-500 text-sm">{errors.shipping_email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_phone">Phone</Label>
              <Input id="shipping_phone" placeholder="+33612345678" {...register('shipping_phone')} />
              {errors.shipping_phone && (
                <p className="text-red-500 text-sm">{errors.shipping_phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_address">Address</Label>
              <Input id="shipping_address" placeholder="123 Main St" {...register('shipping_address')} />
              {errors.shipping_address && (
                <p className="text-red-500 text-sm">{errors.shipping_address.message}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shipping_city">City</Label>
                <Input id="shipping_city" placeholder="Anytown" {...register('shipping_city')} />
                {errors.shipping_city && (
                  <p className="text-red-500 text-sm">{errors.shipping_city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_postal_code">Postal Code</Label>
                <Input id="shipping_postal_code" placeholder="12345" {...register('shipping_postal_code')} />
                {errors.shipping_postal_code && (
                  <p className="text-red-500 text-sm">{errors.shipping_postal_code.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_country">Country</Label>
                <Input id="shipping_country" placeholder="USA" {...register('shipping_country')} />
                {errors.shipping_country && (
                  <p className="text-red-500 text-sm">{errors.shipping_country.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery_notes">Delivery Notes</Label>
              <Textarea
                {...register('delivery_notes')}
                placeholder="Instructions spéciales pour la livraison"
                className="w-full p-2 border rounded"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={isProcessing} onClick={handleSubmit(handleCreateOrder)}>
              {isProcessing ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Create Order"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
