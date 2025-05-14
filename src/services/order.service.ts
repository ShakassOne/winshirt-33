
import { supabase } from "@/integrations/supabase/client";
import { CartItem, Order, OrderWithItems } from "@/types/supabase.types";

// Get all orders for current user
export const getUserOrders = async (): Promise<Order[]> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data || [];
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<OrderWithItems | null> => {
  // First, get the order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  
  if (orderError || !orderData) {
    console.error("Error fetching order:", orderError);
    return null;
  }
  
  // Then, get the order items
  const { data: itemsData, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  
  if (itemsError) {
    console.error("Error fetching order items:", itemsError);
    return {
      ...orderData,
      items: []
    };
  }
  
  // Transform order items to match CartItem interface
  const items: CartItem[] = itemsData.map(item => ({
    id: item.id,
    productId: item.product_id,
    name: item.product_name,
    price: item.price,
    quantity: item.quantity,
    color: item.color,
    size: item.size,
    image_url: item.product_image || '',
    customization: item.customization,
    lotteries: item.lotteries
  }));
  
  return {
    ...orderData,
    items
  };
};

// Create an order
export const createOrder = async (
  shippingAddress: string,
  billingAddress: string,
  shippingMethod: string,
  paymentMethod: string,
  items: CartItem[],
  guestEmail?: string
): Promise<{ orderId: string; order: Order }> => {
  const user = (await supabase.auth.getUser()).data.user;
  
  const userId = user?.id;
  
  if (!userId && !guestEmail) {
    throw new Error("User not authenticated and no guest email provided");
  }
  
  // Calculate total price
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Set shipping price based on shipping method (simplified example)
  let shippingPrice = 0;
  if (shippingMethod === 'standard') {
    shippingPrice = 5.99;
  } else if (shippingMethod === 'express') {
    shippingPrice = 12.99;
  }
  
  // Create the order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId || null,
      guest_email: !userId ? guestEmail : null,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      shipping_method: shippingMethod,
      shipping_price: shippingPrice,
      payment_method: paymentMethod,
      payment_status: 'pending',
      total_price: totalPrice + shippingPrice,
    })
    .select('*')
    .single();
  
  if (orderError || !orderData) {
    console.error("Error creating order:", orderError);
    throw new Error("Failed to create order");
  }
  
  // Insert order items
  const orderItems = items.map(item => ({
    order_id: orderData.id,
    product_id: item.productId,
    product_name: item.name,
    product_image: item.image_url,
    price: item.price,
    quantity: item.quantity,
    color: item.color || null,
    size: item.size || null,
    customization: item.customization || null,
    lotteries: item.lotteries || null,
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    throw new Error("Failed to create order items");
  }
  
  return { 
    orderId: orderData.id,
    order: orderData
  };
};

// Update order payment status
export const updateOrderPaymentStatus = async (orderId: string, status: string, paymentIntentId?: string): Promise<boolean> => {
  const updateData: any = { 
    payment_status: status
  };
  
  if (paymentIntentId) {
    updateData.payment_intent_id = paymentIntentId;
  }
  
  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);
  
  if (error) {
    console.error("Error updating order payment status:", error);
    return false;
  }
  
  return true;
};
