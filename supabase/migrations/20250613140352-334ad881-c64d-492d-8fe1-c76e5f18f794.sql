
-- Nettoyer la table email_settings en gardant seulement la configuration la plus récente
DELETE FROM public.email_settings 
WHERE id NOT IN (
  SELECT id 
  FROM public.email_settings 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- S'assurer qu'il n'y a qu'une seule configuration active
UPDATE public.email_settings 
SET is_active = true 
WHERE id = (
  SELECT id 
  FROM public.email_settings 
  ORDER BY created_at DESC 
  LIMIT 1
);
