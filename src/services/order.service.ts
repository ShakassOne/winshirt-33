
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { CheckoutFormData } from "@/types/cart.types";
import { CartItem } from "@/types/supabase.types";
import { toast } from "sonner";

export const createOrder = async (
  checkoutData: CheckoutFormData,
  items: CartItem[],
  sessionId: string,
  userId?: string
) => {
  try {
    if (!items || items.length === 0) {
      throw new Error("Le panier est vide");
    }
    
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Données de commande
    const orderData = {
      user_id: userId || null,
      guest_email: !userId ? checkoutData.email : null,
      session_id: sessionId,
      total_amount: totalAmount,
      shipping_first_name: checkoutData.firstName,
      shipping_last_name: checkoutData.lastName,
      shipping_email: checkoutData.email,
      shipping_phone: checkoutData.phone,
      shipping_address: checkoutData.address,
      shipping_city: checkoutData.city,
      shipping_postal_code: checkoutData.postalCode,
      shipping_country: checkoutData.country,
      delivery_notes: checkoutData.deliveryNotes,
      status: 'pending'
    };
    
    console.log("Création d'une commande avec les données:", orderData);
    
    // Create order with errorMode to better handle errors
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select();
      
    if (orderError) {
      console.error("Erreur lors de la création de la commande:", orderError);
      throw new Error(handleSupabaseError(orderError));
    }
    
    if (!orders || orders.length === 0) {
      throw new Error("La commande n'a pas pu être créée");
    }
    
    const order = orders[0];
    console.log("Commande créée avec succès:", order);
    
    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      customization: item.customization || null
    }));
    
    console.log("Création des éléments de commande:", orderItems);
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
      
    if (itemsError) {
      console.error("Erreur lors de la création des éléments de commande:", itemsError);
      // Même en cas d'erreur pour les items, on continue avec la commande
      toast.error("Attention: Certains articles de votre commande n'ont pas été correctement enregistrés. Veuillez contacter le support.");
    } else {
      console.log("Éléments de commande créés avec succès");
    }
    
    return order;
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle(); // Utilisation de maybeSingle au lieu de single
      
    if (orderError) throw new Error(handleSupabaseError(orderError));
    
    if (!order) {
      throw new Error("Commande introuvable");
    }
    
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('order_id', orderId);
      
    if (itemsError) throw new Error(handleSupabaseError(itemsError));
    
    return {
      ...order,
      items: orderItems || []
    };
  } catch (error) {
    console.error("Error in getOrderById:", error);
    throw error;
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw new Error(handleSupabaseError(error));
    
    return orders;
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    throw error;
  }
};

export const updateOrderPaymentStatus = async (
  orderId: string, 
  paymentIntentId: string, 
  status: 'paid' | 'failed' | 'pending'
) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        payment_intent_id: paymentIntentId,
        payment_status: status,
        status: status === 'paid' ? 'processing' : 'pending'
      })
      .eq('id', orderId);
      
    if (error) throw new Error(handleSupabaseError(error));
    
    return true;
  } catch (error) {
    console.error("Error in updateOrderPaymentStatus:", error);
    throw error;
  }
};
