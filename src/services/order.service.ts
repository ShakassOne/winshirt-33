// Mise à jour des imports pour le service de commande
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { CheckoutFormData } from '@/types/cart.types';
import { CartItem } from '@/types/supabase.types';

export const createOrder = async (
  userId: string | null,
  sessionId: string | null,
  cartItems: CartItem[],
  checkoutData: CheckoutFormData,
  totalAmount: number
) => {
  try {
    // Generate a unique order ID
    const orderId = uuidv4();

    // Insert the order into the orders table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          id: orderId,
          user_id: userId,
          session_id: sessionId,
          status: 'pending', // You might want to adjust the initial status
          total_amount: totalAmount,
          shipping_address: checkoutData.address,
          shipping_city: checkoutData.city,
          shipping_postal_code: checkoutData.postalCode,
          shipping_country: checkoutData.country,
          shipping_first_name: checkoutData.firstName,
          shipping_last_name: checkoutData.lastName,
          shipping_email: checkoutData.email,
          shipping_phone: checkoutData.phone,
          delivery_notes: checkoutData.deliveryNotes,
          guest_email: checkoutData.email,
        },
      ])
      .select()

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error(`Unable to create order: ${orderError.message}`);
    }

    if (!orderData || orderData.length === 0) {
      throw new Error("Order creation failed, no order data returned.");
    }

    // Insert each cart item into the order_items table
    for (const cartItem of cartItems) {
      const { error: orderItemError } = await supabase
        .from('order_items')
        .insert([
          {
            id: uuidv4(),
            order_id: orderId,
            product_id: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.price,
            customization: cartItem.customization,
          },
        ]);

      if (orderItemError) {
        console.error('Error creating order item:', orderItemError);
        throw new Error(`Unable to create order item: ${orderItemError.message}`);
      }
    }

    return { orderId, order: orderData[0] };
  } catch (error: any) {
    console.error('Failed to create order', error);
    throw error;
  }
};
