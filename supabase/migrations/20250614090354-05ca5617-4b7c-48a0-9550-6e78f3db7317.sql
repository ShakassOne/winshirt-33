
-- Phase 1: Fix critical RLS policies (with proper existence checks)

-- 1. Drop ALL existing policies first
DROP POLICY IF EXISTS "Anyone can view cart tokens" ON public.cart_tokens;
DROP POLICY IF EXISTS "Anyone can create cart tokens" ON public.cart_tokens;
DROP POLICY IF EXISTS "Users can view their own cart tokens" ON public.cart_tokens;
DROP POLICY IF EXISTS "Users can create cart tokens" ON public.cart_tokens;
DROP POLICY IF EXISTS "Users can update their own cart tokens" ON public.cart_tokens;

DROP POLICY IF EXISTS "Users can view items in their cart tokens" ON public.cart_items;
DROP POLICY IF EXISTS "Users can add items to their cart tokens" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update items in their cart tokens" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete items from their cart tokens" ON public.cart_items;

DROP POLICY IF EXISTS "Anyone can view designs" ON public.designs;
DROP POLICY IF EXISTS "Anyone can view active designs" ON public.designs;
DROP POLICY IF EXISTS "Admins can manage designs" ON public.designs;

DROP POLICY IF EXISTS "Anyone can view lotteries" ON public.lotteries;
DROP POLICY IF EXISTS "Anyone can view active lotteries" ON public.lotteries;
DROP POLICY IF EXISTS "Admins can manage lotteries" ON public.lotteries;

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

DROP POLICY IF EXISTS "Anyone can view shipping options" ON public.shipping_options;
DROP POLICY IF EXISTS "Anyone can view active shipping options" ON public.shipping_options;
DROP POLICY IF EXISTS "Admins can manage shipping options" ON public.shipping_options;

DROP POLICY IF EXISTS "Users can view their own AI generations" ON public.ai_generations;
DROP POLICY IF EXISTS "Authenticated users can create AI generations" ON public.ai_generations;

-- 2. Enable RLS on tables that don't have it
ALTER TABLE public.cart_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

-- 3. Create secure policies for cart_tokens
CREATE POLICY "Users can view their own cart tokens"
  ON public.cart_tokens
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create cart tokens"
  ON public.cart_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own cart tokens"
  ON public.cart_tokens
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 4. Create secure policies for cart_items
CREATE POLICY "Users can view items in their cart tokens"
  ON public.cart_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cart_tokens 
      WHERE cart_tokens.id = cart_items.cart_token_id 
      AND (cart_tokens.user_id = auth.uid() OR cart_tokens.user_id IS NULL)
    )
  );

CREATE POLICY "Users can add items to their cart tokens"
  ON public.cart_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cart_tokens 
      WHERE cart_tokens.id = cart_items.cart_token_id 
      AND (cart_tokens.user_id = auth.uid() OR cart_tokens.user_id IS NULL)
    )
  );

CREATE POLICY "Users can update items in their cart tokens"
  ON public.cart_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.cart_tokens 
      WHERE cart_tokens.id = cart_items.cart_token_id 
      AND (cart_tokens.user_id = auth.uid() OR cart_tokens.user_id IS NULL)
    )
  );

CREATE POLICY "Users can delete items from their cart tokens"
  ON public.cart_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.cart_tokens 
      WHERE cart_tokens.id = cart_items.cart_token_id 
      AND (cart_tokens.user_id = auth.uid() OR cart_tokens.user_id IS NULL)
    )
  );

-- 5. Secure admin-only tables with proper role checks
CREATE POLICY "Anyone can view active designs"
  ON public.designs
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage designs"
  ON public.designs
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active lotteries"
  ON public.lotteries
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage lotteries"
  ON public.lotteries
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active products"
  ON public.products
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active shipping options"
  ON public.shipping_options
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage shipping options"
  ON public.shipping_options
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Secure AI generations with user ownership
CREATE POLICY "Users can view their own AI generations"
  ON public.ai_generations
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Authenticated users can create AI generations"
  ON public.ai_generations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
