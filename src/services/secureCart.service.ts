
import logger from '@/utils/logger';
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/supabase.types";
import { EnhancedValidationUtils } from '@/components/validation/EnhancedValidationUtils';

// Secure cart service with enhanced validation
export const secureCartService = {
  // Validate cart token format
  validateCartToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }
    
    // Token should be at least 32 characters and contain only alphanumeric and safe characters
    const tokenRegex = /^[a-zA-Z0-9_-]{32,}$/;
    return tokenRegex.test(token);
  },

  // Validate cart item data
  validateCartItem(item: CartItem): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!item.productId || typeof item.productId !== 'string') {
      errors.push('Product ID invalide');
    }

    if (!item.name || typeof item.name !== 'string' || item.name.length > 200) {
      errors.push('Nom de produit invalide');
    }

    if (typeof item.price !== 'number' || item.price < 0 || item.price > 10000) {
      errors.push('Prix invalide');
    }

    if (typeof item.quantity !== 'number' || item.quantity < 1 || item.quantity > 100) {
      errors.push('Quantité invalide');
    }

    // Validate customization if present
    if (item.customization) {
      if (item.customization.customText && item.customization.customText.length > 500) {
        errors.push('Texte personnalisé trop long');
      }
      
      if (item.customization.designName && item.customization.designName.length > 100) {
        errors.push('Nom de design trop long');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Secure add to cart with validation
  async addToCart(token: string, item: CartItem, userId?: string) {
    try {
      // Validate token
      if (!this.validateCartToken(token)) {
        throw new Error('Token de panier invalide');
      }

      // Validate item
      const itemValidation = this.validateCartItem(item);
      if (!itemValidation.isValid) {
        throw new Error(`Données invalides: ${itemValidation.errors.join(', ')}`);
      }

      // Sanitize text inputs
      const sanitizedItem = {
        ...item,
        name: EnhancedValidationUtils.sanitizeInput(item.name),
        customization: item.customization ? {
          ...item.customization,
          customText: item.customization.customText 
            ? EnhancedValidationUtils.sanitizeInput(item.customization.customText)
            : undefined,
          designName: item.customization.designName
            ? EnhancedValidationUtils.sanitizeInput(item.customization.designName)
            : undefined
        } : null
      };

      // Get or create cart token
      const { data: cartToken, error: tokenError } = await supabase
        .from('cart_tokens')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (tokenError) {
        throw tokenError;
      }

      let tokenId: string;

      if (!cartToken) {
        // Create new token
        const { data: newToken, error: createError } = await supabase
          .from('cart_tokens')
          .insert([{ token, user_id: userId || null }])
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        tokenId = newToken.id;
      } else {
        tokenId = cartToken.id;
        
        // Update user_id if user is now authenticated
        if (userId && !cartToken.user_id) {
          await supabase
            .from('cart_tokens')
            .update({ user_id: userId })
            .eq('id', tokenId);
        }
      }

      // Check if item already exists
      const { data: existingItems, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('cart_token_id', tokenId)
        .eq('product_id', sanitizedItem.productId);

      if (fetchError) {
        throw fetchError;
      }

      if (existingItems && existingItems.length > 0) {
        // Update existing item
        const existingItem = existingItems[0];
        const newQuantity = existingItem.quantity + sanitizedItem.quantity;
        
        // Validate new quantity
        if (newQuantity > 100) {
          throw new Error('Quantité maximale dépassée (100)');
        }

        const { error: updateError } = await supabase
          .from('cart_items')
          .update({
            quantity: newQuantity,
            customization: sanitizedItem.customization || existingItem.customization,
            color: sanitizedItem.color || existingItem.color,
            size: sanitizedItem.size || existingItem.size
          })
          .eq('id', existingItem.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert([{
            cart_token_id: tokenId,
            product_id: sanitizedItem.productId,
            quantity: sanitizedItem.quantity,
            price: sanitizedItem.price,
            color: sanitizedItem.color || null,
            size: sanitizedItem.size || null,
            customization: sanitizedItem.customization || null
          }]);

        if (insertError) {
          throw insertError;
        }
      }

      logger.log('[SecureCart] Item added successfully');
      return true;

    } catch (error) {
      logger.log('[SecureCart] Error adding item:', error);
      throw error;
    }
  },

  // Secure get cart items
  async getCartItems(token: string, userId?: string): Promise<CartItem[]> {
    try {
      if (!this.validateCartToken(token)) {
        throw new Error('Token de panier invalide');
      }

      const { data: cartToken, error: tokenError } = await supabase
        .from('cart_tokens')
        .select('*')
        .eq('token', token)
        .maybeSingle();

      if (tokenError) {
        throw tokenError;
      }

      if (!cartToken) {
        return [];
      }

      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          color,
          size,
          price,
          customization,
          products:product_id (id, name, image_url, price, description, available_colors, available_sizes)
        `)
        .eq('cart_token_id', cartToken.id);

      if (error) {
        throw error;
      }

      if (!cartItems || cartItems.length === 0) {
        return [];
      }

      // Map and sanitize data
      return cartItems.map(item => ({
        productId: item.products?.id,
        name: item.products?.name ? EnhancedValidationUtils.sanitizeInput(item.products.name) : '',
        price: parseFloat(item.price as unknown as string),
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image_url: item.products?.image_url,
        available_colors: item.products?.available_colors,
        available_sizes: item.products?.available_sizes,
        customization: item.customization as unknown as CartItem['customization']
      }));

    } catch (error) {
      logger.log('[SecureCart] Error getting cart items:', error);
      throw error;
    }
  }
};
