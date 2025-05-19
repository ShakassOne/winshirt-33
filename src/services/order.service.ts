import { supabase } from "@/integrations/supabase/client";
import { CheckoutFormData } from "@/types/cart.types";
import { CartItem, Order, OrderStatus, PaymentStatus, ExtendedOrder, Json, JsonObject } from "@/types/supabase.types";

export const createOrder = async (
  checkoutData: CheckoutFormData,
  items: CartItem[],
  sessionId: string,
  userId?: string
) => {
  try {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    console.log("Creating order with data:", { checkoutData, userId, totalAmount, items });
    
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
          status: 'pending' as OrderStatus
        }
      ])
      .select()
      .single();
      
    if (orderError) {
      console.error("Error creating order:", orderError);
      throw orderError;
    }
    
    console.log("Order created:", order);
    
    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      customization: item.customization || null
    }));
    
    console.log("Creating order items:", orderItems);
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
      
    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      throw itemsError;
    }
    
    console.log("Order items created successfully");
    
    return order;
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<ExtendedOrder> => {
  try {
    console.log("Getting order by ID:", orderId);
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
      
    if (orderError) {
      console.error("Error getting order:", orderError);
      throw orderError;
    }
    
    console.log("Order retrieved:", order);
    
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('order_id', orderId);
      
    if (itemsError) {
      console.error("Error getting order items:", itemsError);
      throw itemsError;
    }
    
    console.log("Order items retrieved:", orderItems);
    
    // Ensure status is valid
    const validStatus = (['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(order.status) 
      ? order.status as OrderStatus 
      : 'pending') as OrderStatus;
    
    // Ensure payment_status is valid
    const validPaymentStatus = (['pending', 'paid', 'failed'].includes(order.payment_status) 
      ? order.payment_status as PaymentStatus 
      : 'pending') as PaymentStatus;
    
    // Process order items to convert Json customization to expected format
    const processedItems = orderItems.map(item => {
      // Convert the customization JSON to the expected structure
      let processedCustomization = item.customization;
      
      if (typeof processedCustomization === 'string') {
        try {
          processedCustomization = JSON.parse(processedCustomization);
        } catch (e) {
          console.error("Failed to parse customization JSON:", e);
          processedCustomization = null;
        }
      }
      
      return {
        ...item,
        customization: processedCustomization
      };
    });
    
    return {
      ...order,
      status: validStatus,
      payment_status: validPaymentStatus,
      items: processedItems
    };
  } catch (error) {
    console.error("Error in getOrderById:", error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    console.log("Getting orders for user:", userId);
    
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error getting user orders:", error);
      throw error;
    }
    
    console.log("User orders retrieved:", ordersData);
    
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
    console.log("Updating order payment status:", { orderId, paymentIntentId, status });
    
    const { error } = await supabase
      .from('orders')
      .update({ 
        payment_intent_id: paymentIntentId,
        payment_status: status,
        status: status === 'paid' ? 'processing' as OrderStatus : 'pending' as OrderStatus
      })
      .eq('id', orderId);
      
    if (error) {
      console.error("Error updating order payment status:", error);
      throw error;
    }
    
    console.log("Order payment status updated successfully");
  } catch (error) {
    console.error("Error in updateOrderPaymentStatus:", error);
    throw error;
  }
};

// Create account from checkout information
export const createAccount = async (checkoutData: CheckoutFormData): Promise<{ userId: string }> => {
  try {
    console.log("Creating account from checkout data:", { 
      email: checkoutData.email, 
      createAccount: checkoutData.createAccount 
    });
    
    // Check if the user wants to create an account and has provided a password
    if (!checkoutData.createAccount || !checkoutData.password) {
      console.warn("Account creation skipped - createAccount is false or password is missing");
      throw new Error("Account creation data is incomplete");
    }

    // Create a new user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: checkoutData.email,
      password: checkoutData.password,
      options: {
        data: {
          first_name: checkoutData.firstName,
          last_name: checkoutData.lastName
        }
      }
    });
    
    if (authError) {
      console.error("Error creating user account:", authError);
      throw authError;
    }
    
    if (!authData.user) {
      console.error("User account creation returned no user");
      throw new Error("Failed to create user account");
    }
    
    console.log("User account created:", authData.user.id);
    
    // Create or update user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([{
        id: authData.user.id,
        first_name: checkoutData.firstName,
        last_name: checkoutData.lastName,
        email: checkoutData.email,
        phone: checkoutData.phone,
        address: checkoutData.address,
        city: checkoutData.city,
        postal_code: checkoutData.postalCode,
        country: checkoutData.country
      }]);
      
    if (profileError) {
      console.error("Error creating user profile:", profileError);
      throw profileError;
    }
    
    console.log("User profile created/updated successfully");
    
    return { userId: authData.user.id };
  } catch (error) {
    console.error("Error in createAccount:", error);
    throw error;
  }
};
