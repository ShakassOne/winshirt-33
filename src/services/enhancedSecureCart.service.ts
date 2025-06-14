import logger from '@/utils/logger';
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/supabase.types";
import { enhancedErrorUtils, enhancedRateLimiter, inputSanitizer } from '@/utils/enhancedSecurityHeaders';

// Enhanced secure cart service with comprehensive validation
export const enhancedSecureCartService = {
  // Validate cart token format with enhanced security
  validateCartToken(token: string): { isValid: boolean; error?: string } {
    if (!token || typeof token !== 'string') {
      return { isValid: false, error: 'Token de panier requis' };
    }
    
    if (token.length < 32 || token.length > 128) {
      return { isValid: false, error: 'Format de token invalide' };
    }
    
    // Token should contain only alphanumeric and safe characters
    const tokenRegex = /^[a-zA-Z0-9_-]+$/;
    if (!tokenRegex.test(token)) {
      return { isValid: false, error: 'Caractères invalides dans le token' };
    }

    return { isValid: true };
  },

  // Enhanced cart item validation
  validateCartItem(item: CartItem): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Product ID validation
    if (!item.productId || typeof item.productId !== 'string') {
      errors.push('Product ID invalide');
    } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.productId)) {
      errors.push('Format Product ID invalide');
    }

    // Name validation
    if (!item.name || typeof item.name !== 'string') {
      errors.push('Nom de produit requis');
    } else if (item.name.length > 200) {
      errors.push('Nom de produit trop long (max 200 caractères)');
    } else if (item.name.trim().length < 2) {
      errors.push('Nom de produit trop court (min 2 caractères)');
    }

    // Price validation
    if (typeof item.price !== 'number' || isNaN(item.price)) {
      errors.push('Prix invalide');
    } else if (item.price < 0) {
      errors.push('Prix ne peut pas être négatif');
    } else if (item.price > 10000) {
      errors.push('Prix trop élevé (max 10000€)');
    }

    // Quantity validation
    if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity)) {
      errors.push('Quantité invalide');
    } else if (item.quantity < 1) {
      errors.push('Quantité minimum : 1');
    } else if (item.quantity > 100) {
      errors.push('Quantité maximum : 100');
    }

    // Color validation
    if (item.color && (typeof item.color !== 'string' || item.color.length > 50)) {
      errors.push('Couleur invalide');
    }

    // Size validation
    if (item.size && (typeof item.size !== 'string' || item.size.length > 20)) {
      errors.push('Taille invalide');
    }

    // Customization validation
    if (item.customization) {
      if (item.customization.customText && item.customization.customText.length > 500) {
        errors.push('Texte personnalisé trop long (max 500 caractères)');
      }
      
      if (item.customization.designName && item.customization.designName.length > 100) {
        errors.push('Nom de design trop long (max 100 caractères)');
      }

      // Validate design URL if present
      if (item.customization.designUrl && 
          (!item.customization.designUrl.startsWith('https://') || item.customization.designUrl.length > 500)) {
        errors.push('URL de design invalide');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Secure add to cart with enhanced validation and rate limiting
  async addToCart(token: string, item: CartItem, userId?: string) {
    try {
      // Rate limiting check
      const rateLimitKey = `addcart_${userId || token}`;
      const rateCheck = enhancedRateLimiter.checkRateLimit(rateLimitKey, 10, 60000); // 10 items per minute
      
      if (!rateCheck.allowed) {
        throw new Error('Trop d\'ajouts au panier. Veuillez patienter.');
      }

      // Validate token
      const tokenValidation = this.validateCartToken(token);
      if (!tokenValidation.isValid) {
        enhancedErrorUtils.logSecurityEvent('Invalid cart token', { token: token.substring(0, 8) + '...' });
        throw new Error(tokenValidation.error || 'Token de panier invalide');
      }

      // Validate item
      const itemValidation = this.validateCartItem(item);
      if (!itemValidation.isValid) {
        enhancedErrorUtils.logSecurityEvent('Invalid cart item', { errors: itemValidation.errors });
        throw new Error(`Données invalides: ${itemValidation.errors.join(', ')}`);
      }

      // Sanitize text inputs
      const sanitizedItem = {
        ...item,
        name: inputSanitizer.sanitizeUserInput(item.name, 200),
        color: item.color ? inputSanitizer.sanitizeUserInput(item.color, 50) : null,
        size: item.size ? inputSanitizer.sanitizeUserInput(item.size, 20) : null,
        customization: item.customization ? {
          ...item.customization,
          customText: item.customization.customText 
            ? inputSanitizer.sanitizeUserInput(item.customization.customText, 500)
            : undefined,
          designName: item.customization.designName
            ? inputSanitizer.sanitizeUserInput(item.customization.designName, 100)
            : undefined
        } : null
      };

      // Verify product exists and is active
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, is_active, price')
        .eq('id', sanitizedItem.productId)
        .eq('is_active', true)
        .single();

      if (productError || !product) {
        enhancedErrorUtils.logSecurityEvent('Product not found or inactive', { productId: sanitizedItem.productId });
        throw new Error('Produit non trouvé ou indisponible');
      }

      // Verify price consistency (prevent price manipulation)
      if (Math.abs(product.price - sanitizedItem.price) > 0.01) {
        enhancedErrorUtils.logSecurityEvent('Price manipulation attempt', { 
          expectedPrice: product.price, 
          submittedPrice: sanitizedItem.price 
        });
        throw new Error('Prix invalide');
      }

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

      // Check cart item count limit
      const { count: itemCount } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('cart_token_id', tokenId);

      if (itemCount && itemCount >= 50) {
        throw new Error('Panier plein (maximum 50 articles)');
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
          throw new Error('Quantité maximale dépassée (100 par article)');
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

      logger.log('[EnhancedSecureCart] Item added successfully');
      return true;

    } catch (error) {
      logger.log('[EnhancedSecureCart] Error adding item:', error);
      enhancedErrorUtils.logSecurityEvent('Cart add error', error);
      throw error;
    }
  },

  // Secure get cart items with enhanced validation
  async getCartItems(token: string, userId?: string): Promise<CartItem[]> {
    try {
      const tokenValidation = this.validateCartToken(token);
      if (!tokenValidation.isValid) {
        enhancedErrorUtils.logSecurityEvent('Invalid cart token on get', { token: token.substring(0, 8) + '...' });
        throw new Error(tokenValidation.error || 'Token de panier invalide');
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
          products:product_id (id, name, image_url, price, description, available_colors, available_sizes, is_active)
        `)
        .eq('cart_token_id', cartToken.id);

      if (error) {
        throw error;
      }

      if (!cartItems || cartItems.length === 0) {
        return [];
      }

      // Filter out inactive products and sanitize data
      return cartItems
        .filter(item => item.products?.is_active)
        .map(item => ({
          productId: item.products?.id,
          name: item.products?.name ? inputSanitizer.sanitizeUserInput(item.products.name, 200) : '',
          price: parseFloat(item.price as unknown as string),
          quantity: item.quantity,
          color: item.color ? inputSanitizer.sanitizeUserInput(item.color, 50) : null,
          size: item.size ? inputSanitizer.sanitizeUserInput(item.size, 20) : null,
          image_url: item.products?.image_url,
          available_colors: item.products?.available_colors,
          available_sizes: item.products?.available_sizes,
          customization: item.customization as unknown as CartItem['customization']
        }));

    } catch (error) {
      logger.log('[EnhancedSecureCart] Error getting cart items:', error);
      enhancedErrorUtils.logSecurityEvent('Cart get error', error);
      throw error;
    }
  }
};
