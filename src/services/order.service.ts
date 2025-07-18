import logger from '@/utils/logger';

import { supabase } from "@/integrations/supabase/client";
import { CheckoutFormData } from "@/types/cart.types";
import { CartItem, Order, OrderStatus, PaymentStatus } from "@/types/supabase.types";
import { getShippingOptionById } from "./shipping.service";
import { EmailService } from "./email.service";

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
    
    logger.log('Creating order with items:', items);
    logger.log('Shipping option:', shippingOption);
    logger.log('Subtotal:', subtotal, 'Shipping:', shippingCost, 'Total:', totalAmount);
    
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
    
    // Create order items avec gestion améliorée des captures
    const orderItems = items.map(item => {
      logger.log('🔍 [Order Service] Processing item for order:', item.productId);
      logger.log('📋 [Order Service] Item customization:', item.customization);
      
      const customization = item.customization;
      
      // Extraire toutes les URLs de capture disponibles
      let mockupRectoUrl = null;
      let mockupVersoUrl = null;
      let hdRectoUrl = null;
      let hdVersoUrl = null;
      
      if (customization && typeof customization === 'object') {
        const customObj = customization as Record<string, any>;
        
        // URLs de mockup (preview)
        mockupRectoUrl = customObj.mockupRectoUrl || null;
        mockupVersoUrl = customObj.mockupVersoUrl || null;
        
        // URLs HD (production) - priorité à la nouvelle structure
        hdRectoUrl = customObj.visual_front_url || customObj.hdRectoUrl || null;
        hdVersoUrl = customObj.visual_back_url || customObj.hdVersoUrl || null;
        
        logger.log('📸 [Order Service] URLs extraites:');
        logger.log('   - Mockup Recto:', mockupRectoUrl);
        logger.log('   - Mockup Verso:', mockupVersoUrl);
        logger.log('   - HD Recto:', hdRectoUrl);
        logger.log('   - HD Verso:', hdVersoUrl);
      }
      
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
        visual_front_url: hdRectoUrl, // URL HD pour DTF
        visual_back_url: hdVersoUrl,  // URL HD pour DTF
        selected_size: selectedSize,
        selected_color: selectedColor,
        lottery_name: lotteryName
      };
      
      logger.log('💾 [Order Service] Order item à insérer:', orderItem);
      
      return orderItem;
    });
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
      
    if (itemsError) {
      console.error('❌ [Order Service] Error inserting order items:', itemsError);
      throw itemsError;
    }
    
    logger.log('✅ [Order Service] Order items créés avec succès avec système de capture unifié');
    
    return order;
  } catch (error) {
    console.error("❌ [Order Service] Error in createOrder:", error);
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

    // Si le paiement est confirmé, envoyer l'email de confirmation
    if (status === 'paid') {
      logger.log(`📧 [Order Service] Commande payée, envoi email confirmation ${orderId}`);
      try {
        await EmailService.sendOrderConfirmation(orderId);
      } catch (emailError) {
        console.error('❌ [Order Service] Erreur envoi email confirmation:', emailError);
        // Ne pas faire échouer la mise à jour de commande pour un problème d'email
      }
    }

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
          logger.log(`Generated lottery entries for order ${orderId} using corrected function`);
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

// Nouvelle fonction pour mettre à jour le statut d'expédition
export const updateOrderShippingStatus = async (
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string
) => {
  try {
    const updateData: any = { status };
    if (trackingNumber) {
      updateData.tracking_number = trackingNumber;
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);
      
    if (error) throw error;

    // Si le statut passe à "shipped", envoyer la notification d'expédition
    if (status === 'shipped') {
      logger.log(`📧 [Order Service] Commande expédiée, envoi notification ${orderId}`);
      try {
        await EmailService.sendShippingNotification(orderId, trackingNumber);
      } catch (emailError) {
        console.error('❌ [Order Service] Erreur envoi notification expédition:', emailError);
        // Ne pas faire échouer la mise à jour pour un problème d'email
      }
    }

    return true;
  } catch (error) {
    console.error("Error in updateOrderShippingStatus:", error);
    throw error;
  }
};
