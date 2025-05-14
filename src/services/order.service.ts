import { supabase } from "@/integrations/supabase/client";
import { CheckoutFormData } from "@/types/cart.types";
import { CartItem } from "@/types/supabase.types";

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
    
    // Create order with more robust error handling
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
      
    if (orderError) {
      console.error("Erreur lors de la création de la commande:", orderError);
      throw orderError;
    }
    
    if (!order) {
      throw new Error("La commande a été créée mais aucune donnée n'a été retournée");
    }
    
    console.log("Commande créée avec succès:", order);
    
    // Create order items with better error handling
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
      // Tentative de suppression de la commande en cas d'erreur
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }
    
    console.log("Éléments de commande créés avec succès");
    
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
      .single();
      
    if (orderError) throw orderError;
    
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('order_id', orderId);
      
    if (itemsError) throw itemsError;
    
    return {
      ...order,
      items: orderItems
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
      
    if (error) throw error;
    
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
      
    if (error) throw error;
  } catch (error) {
    console.error("Error in updateOrderPaymentStatus:", error);
    throw error;
  }
};

// Ajouter une nouvelle fonction pour vérifier si une commande existe
export const checkOrderExists = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .single();
      
    if (error) {
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error in checkOrderExists:", error);
    return false;
  }
};
