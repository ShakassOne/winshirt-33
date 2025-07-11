-- Créer une table pour stocker les personnalisations utilisateur
CREATE TABLE public.user_customizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  customization JSONB NOT NULL,
  preview_url TEXT,
  hd_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.user_customizations ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Users can view their own customizations" 
ON public.user_customizations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customizations" 
ON public.user_customizations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customizations" 
ON public.user_customizations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customizations" 
ON public.user_customizations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Créer une fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_user_customizations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour updated_at
CREATE TRIGGER update_user_customizations_updated_at
BEFORE UPDATE ON public.user_customizations
FOR EACH ROW
EXECUTE FUNCTION public.update_user_customizations_updated_at();