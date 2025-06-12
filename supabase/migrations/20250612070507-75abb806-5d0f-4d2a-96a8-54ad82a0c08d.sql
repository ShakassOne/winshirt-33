
-- Ajouter les colonnes visual_front_url et visual_back_url à la table order_items
ALTER TABLE public.order_items 
ADD COLUMN visual_front_url text,
ADD COLUMN visual_back_url text;
