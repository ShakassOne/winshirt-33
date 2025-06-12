import { supabase } from "@/integrations/supabase/client";
import { CheckoutFormData } from "@/types/cart.types";
import { CartItem, Order, OrderStatus, PaymentStatus } from "@/types/supabase.types";
import { getShippingOptionById } from "./shipping.service";

export const createOrder = async (
  checkoutData: CheckoutFormData,
  items: CartItem[],
  sessionId: string,
  userId?: string
) => {
  try {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Récupérer l'option de livraison sélectionnée
    const shippingOption = await getShippingOptionById(checkoutData.selectedShippingOption);
    if (!shippingOption) {
      throw new Error("Option de livraison invalide");
    }
    
    const shippingCost = shippingOption.price;
    const totalAmount = subtotal + shippingCost;
    
    console.log('Creating order with items:', items);
    console.log('Shipping option:', shippingOption);
    console.log('Subtotal:', subtotal, 'Shipping:', shippingCost, 'Total:', totalAmount);
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId || null,
          guest_email: !userId ? checkoutData.email : null,
          session_id: sessionId,
          subtotal: subtotal,
          shipping_cost: shippingCost,
          shipping_option_id: shippingOption.id,
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
          status: 'pending' as OrderStatus
        }
      ])
      .select()
      .single();
      
    if (orderError) throw orderError;
    
    // Create order items avec gestion unifiée des captures
    const orderItems = items.map(item => {
      console.log('Processing item for order:', item);
      console.log('Item customization:', item.customization);
      
      const customization = item.customization;
      
      // Extraire les URLs de capture avec support nouvelle structure
      const mockupRectoUrl = customization?.mockupRectoUrl || null;
      const mockupVersoUrl = customization?.mockupVersoUrl || null;
      const hdRectoUrl = customization?.hdRectoUrl || null;
      const hdVersoUrl = customization?.hdVersoUrl || null;
      
      const selectedSize = item.size || customization?.selectedSize || null;
      const selectedColor = item.color || customization?.selectedColor || null;
      const lotteryName = customization?.lotteryName || null;
      
      const orderItem = {
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        customization: customization || null,
        mockup_recto_url: mockupRectoUrl,
        mockup_verso_url: mockupVersoUrl,
        visual_front_url: hdRectoUrl, // Nouveau: URL HD pour DTF
        visual_back_url: hdVersoUrl,  // Nouveau: URL HD pour DTF
        selected_size: selectedSize,
        selected_color: selectedColor,
        lottery_name: lotteryName
      };
      
      console.log('Order item to insert:', orderItem);
      console.log('Captured URLs - Mockup Recto:', mockupRectoUrl, 'Verso:', mockupVersoUrl);
      console.log('HD URLs - Recto:', hdRectoUrl, 'Verso:', hdVersoUrl);
      console.log('Lottery name being saved:', lotteryName);
      
      return orderItem;
    });
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
      
    if (itemsError) {
      console.error('Error inserting order items:', itemsError);
      throw itemsError;
    }
    
    console.log('Order items successfully created with unified capture system');
    
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

    // If order is now paid, generate lottery entries with the corrected function
    if (status === 'paid') {
      try {
        const { error: lotteryError } = await supabase.rpc('generate_lottery_entries_for_order', {
          order_id_param: orderId
        });
        
        if (lotteryError) {
          console.error('Error generating lottery entries:', lotteryError);
          // Don't throw - order update succeeded
        } else {
          console.log(`Generated lottery entries for order ${orderId} using corrected function`);
        }
      } catch (lotteryErr) {
        console.error('Exception generating lottery entries:', lotteryErr);
        // Continue - order update succeeded
      }
    }
  } catch (error) {
    console.error("Error in updateOrderPaymentStatus:", error);
    throw error;
  }
};
