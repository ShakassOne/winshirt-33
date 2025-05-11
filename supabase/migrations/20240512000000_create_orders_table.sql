
-- Create orders table to track customer orders and customizations
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE NULL,
  customization JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting orders 
CREATE POLICY "anyone can select orders" ON public.orders
  FOR SELECT
  USING (true);
  
-- Create policy for inserting orders
CREATE POLICY "anyone can insert orders" ON public.orders
  FOR INSERT
  WITH CHECK (true);
  
-- Create policy for updating orders
CREATE POLICY "service_role can update orders" ON public.orders
  FOR UPDATE
  USING (true);
