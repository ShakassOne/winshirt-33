-- Add preview_url and hd_url columns to orders table
ALTER TABLE public.orders
ADD COLUMN preview_url text,
ADD COLUMN hd_url text;
