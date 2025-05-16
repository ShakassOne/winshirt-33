
import { supabase } from "@/integrations/supabase/client";
import { CheckoutFormData } from "@/types/cart.types";
import { CartItem, Order } from "@/types/supabase.types";

// Types pour la personnalisation
export type TextCustomization = {
  content: string;
  font: string;
  color: string;
  printPosition: 'front' | 'back';
  transform?: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
};

export type CustomizationType = {
  designId: string;
  designName?: string;
  designUrl: string;
  printPosition: 'front' | 'back';
  printSize: string;
  transform?: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  text?: TextCustomization;
};

// Extend OrderItem with products relation
export interface ExtendedOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  customization?: CustomizationType;
  created_at?: string;
  products?: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    price: number;
    category: string;
    is_customizable: boolean;
    available_colors: string[];
    available_sizes: string[];
    mockup_id?: string;
  };
}

// Extended order type including items
export interface ExtendedOrder extends Order {
  items?: ExtendedOrderItem[];
}

// Helper function to validate order status
const validateOrderStatus = (status: string): Order['status'] => {
  const validStatuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  return validStatuses.includes(status as Order['status']) 
    ? status as Order['status'] 
    : 'pending';
};

// Helper function to validate payment status
const validatePaymentStatus = (status: string | null | undefined): Order['payment_status'] => {
  if (!status) return 'pending';
  
  const validStatuses: Order['payment_status'][] = ['pending', 'paid', 'failed'];
  return validStatuses.includes(status as Order['payment_status']) 
    ? status as Order['payment_status'] 
    : 'pending';
};

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

export const getOrderById = async (orderId: string): Promise<ExtendedOrder> => {
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
    
    // Process the items to convert customization from JSON
    const processedItems: ExtendedOrderItem[] = orderItems.map(item => {
      // Parse customization if it's a string
      let parsedCustomization: CustomizationType | undefined = undefined;
      
      if (item.customization) {
        if (typeof item.customization === 'string') {
          try {
            parsedCustomization = JSON.parse(item.customization);
          } catch (e) {
            console.error("Error parsing customization:", e);
          }
        } else {
          // It's already an object
          parsedCustomization = item.customization as unknown as CustomizationType;
        }
      }
      
      return {
        ...item,
        customization: parsedCustomization
      };
    });
    
    // Validate the status fields against our type definitions
    return {
      ...order,
      status: validateOrderStatus(order.status),
      payment_status: validatePaymentStatus(order.payment_status),
      items: processedItems
    };
  } catch (error) {
    console.error("Error in getOrderById:", error);
    throw error;
  }
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Ensure the order status is one of the valid types
    const typedOrders = orders.map(order => {
      return {
        ...order,
        status: validateOrderStatus(order.status),
        payment_status: validatePaymentStatus(order.payment_status)
      };
    });
    
    return typedOrders;
  } catch (error) {
    console.error("Error in fetchAllOrders:", error);
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
    
    return orders.map(order => ({
      ...order,
      status: validateOrderStatus(order.status),
      payment_status: validatePaymentStatus(order.payment_status)
    }));
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

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    throw error;
  }
};
