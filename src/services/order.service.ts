
import { supabase } from "@/integrations/supabase/client";
import { CheckoutFormData } from "@/types/cart.types";
import { CartItem, Order, OrderStatus, PaymentStatus } from "@/types/supabase.types";

export const createOrder = async (
  checkoutData: CheckoutFormData,
  items: CartItem[],
  sessionId: string,
  userId?: string
) => {
  try {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId || null,
          guest_email: !userId ? checkoutData.shipping_email : null,
          session_id: sessionId,
          total_amount: totalAmount,
          shipping_first_name: checkoutData.shipping_first_name || checkoutData.firstName,
          shipping_last_name: checkoutData.shipping_last_name || checkoutData.lastName,
          shipping_email: checkoutData.shipping_email || checkoutData.email,
          shipping_phone: checkoutData.shipping_phone || checkoutData.phone,
          shipping_address: checkoutData.shipping_address || checkoutData.address,
          shipping_city: checkoutData.shipping_city || checkoutData.city,
          shipping_postal_code: checkoutData.shipping_postal_code || checkoutData.postalCode,
          shipping_country: checkoutData.shipping_country || checkoutData.country,
          delivery_notes: checkoutData.delivery_notes || checkoutData.deliveryNotes,
          status: 'pending' as OrderStatus
        }
      ])
      .select()
      .single();
      
    if (orderError) throw orderError;
    
    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      customization: item.customization || null
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
      
    if (itemsError) throw itemsError;
    
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
    
    // Ensure status is valid
    const validStatus = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(order.status) 
      ? order.status as OrderStatus 
      : 'pending' as OrderStatus;
    
    // Ensure payment_status is valid
    const validPaymentStatus = ['pending', 'paid', 'failed'].includes(order.payment_status) 
      ? order.payment_status as PaymentStatus 
      : 'pending' as PaymentStatus;
    
    return {
      ...order,
      status: validStatus,
      payment_status: validPaymentStatus,
      items: orderItems
    };
  } catch (error) {
    console.error("Error in getOrderById:", error);
    throw error;
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Validate each order's status and payment_status
    const orders = ordersData.map(order => ({
      ...order,
      status: (['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(order.status) 
        ? order.status 
        : 'pending') as OrderStatus,
      payment_status: (['pending', 'paid', 'failed'].includes(order.payment_status) 
        ? order.payment_status 
        : 'pending') as PaymentStatus
    }));
    
    return orders;
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    throw error;
  }
};

export const updateOrderPaymentStatus = async (
  orderId: string, 
  paymentIntentId: string, 
  status: PaymentStatus
) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        payment_intent_id: paymentIntentId,
        payment_status: status,
        status: status === 'paid' ? 'processing' as OrderStatus : 'pending' as OrderStatus
      })
      .eq('id', orderId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error in updateOrderPaymentStatus:", error);
    throw error;
  }
};
