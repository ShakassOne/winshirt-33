
import { supabase } from "@/integrations/supabase/client";
import { CheckoutFormData } from "@/types/cart.types";
import { CartItem, Order, OrderItem } from "@/types/supabase.types";

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

// Define a proper type for the customization data that's compatible with OrderItem
export interface CustomizationType {
  designId: string;  // Changed from optional to required
  designName?: string;
  designUrl: string; // Changed from optional to required
  printPosition: 'front' | 'back'; // Changed from optional to required
  printSize: string; // Changed from optional to required
  transform?: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  text?: {
    content: string;
    font: string;
    color: string;
    printPosition?: 'front' | 'back';
    transform?: {
      position: { x: number; y: number };
      scale: number;
      rotation: number;
    };
  };
  color?: string;
  size?: string;
}

// Define a proper type for the order item with design
interface ExtendedOrderItem extends OrderItem {
  design?: {
    id: string;
    name: string;
    image_url: string;
    category: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
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
    mockup_id: string;
  };
  customization?: CustomizationType;
}

// Define a type for the order with items
interface ExtendedOrder extends Order {
  items: ExtendedOrderItem[];
}

export const getOrderById = async (orderId: string): Promise<ExtendedOrder> => {
  try {
    // Fetch the order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
      
    if (orderError) throw orderError;
    
    // Fetch order items with product details
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products:product_id (
          id,
          name,
          description,
          image_url,
          price,
          category,
          is_customizable,
          available_colors,
          available_sizes,
          mockup_id
        )
      `)
      .eq('order_id', orderId);
      
    if (itemsError) throw itemsError;
    
    // For each customized item, fetch the design details if available
    const itemsWithDesigns = await Promise.all(
      orderItems.map(async (item) => {
        // Process customization data to ensure it's properly typed
        const customization = item.customization ? 
          (item.customization as unknown as CustomizationType) : 
          undefined;
        
        if (customization && customization.designId) {
          const { data: design } = await supabase
            .from('designs')
            .select('*')
            .eq('id', customization.designId)
            .single();
            
          return {
            ...item,
            customization,
            design: design || undefined
          } as ExtendedOrderItem;
        }
        
        return {
          ...item,
          customization
        } as ExtendedOrderItem;
      })
    );
    
    return {
      ...order,
      items: itemsWithDesigns
    } as ExtendedOrder;
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

export const updateOrderStatus = async (
  orderId: string,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    throw error;
  }
};
