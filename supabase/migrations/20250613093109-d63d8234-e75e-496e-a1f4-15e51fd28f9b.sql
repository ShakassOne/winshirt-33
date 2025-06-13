
-- Table pour stocker les configurations email
CREATE TABLE public.email_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  smtp_host text NOT NULL DEFAULT 'smtp.ionos.fr',
  smtp_port integer NOT NULL DEFAULT 587,
  smtp_secure boolean NOT NULL DEFAULT true,
  smtp_user text NOT NULL,
  smtp_password text NOT NULL,
  from_email text NOT NULL DEFAULT 'contact@winshirt.fr',
  from_name text NOT NULL DEFAULT 'WinShirt',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table pour stocker les templates d'email
CREATE TABLE public.email_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL, -- 'order_confirmation', 'shipping_notification', 'lottery_reminder'
  name text NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  variables jsonb NOT NULL DEFAULT '[]'::jsonb, -- Liste des variables disponibles
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(type)
);

-- Table pour l'historique des envois d'emails
CREATE TABLE public.email_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid REFERENCES public.email_templates(id),
  recipient_email text NOT NULL,
  recipient_name text,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message text,
  sent_at timestamp with time zone,
  order_id uuid REFERENCES public.orders(id),
  lottery_id uuid REFERENCES public.lotteries(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insertion des templates par défaut
INSERT INTO public.email_templates (type, name, subject, html_content, variables) VALUES
(
  'order_confirmation',
  'Confirmation de commande',
  'Confirmation de votre commande #{{order_number}}',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirmation de commande</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0;">WinShirt</h1>
    <p style="margin: 10px 0 0 0;">Votre commande est confirmée !</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333;">Bonjour {{customer_name}} !</h2>
    
    <p>Merci pour votre commande ! Nous avons bien reçu votre paiement et votre commande est en cours de traitement.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Détails de la commande</h3>
      <p><strong>Numéro de commande :</strong> #{{order_number}}</p>
      <p><strong>Date :</strong> {{order_date}}</p>
      <p><strong>Total :</strong> {{total_amount}}€</p>
    </div>
    
    <h3>Articles commandés :</h3>
    {{order_items}}
    
    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Adresse de livraison</h3>
      <p>{{shipping_address}}</p>
    </div>
    
    <p>Nous vous tiendrons informé de l''avancement de votre commande par email.</p>
    
    <p>Cordialement,<br>L''équipe WinShirt</p>
  </div>
</body>
</html>',
  '["customer_name", "order_number", "order_date", "total_amount", "order_items", "shipping_address"]'::jsonb
),
(
  'shipping_notification',
  'Notification d''expédition',
  'Votre commande #{{order_number}} a été expédiée',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Commande expédiée</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0;">WinShirt</h1>
    <p style="margin: 10px 0 0 0;">Votre commande est en route !</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333;">Bonjour {{customer_name}} !</h2>
    
    <p>Excellente nouvelle ! Votre commande a été expédiée et est maintenant en route vers vous.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Informations de suivi</h3>
      <p><strong>Numéro de commande :</strong> #{{order_number}}</p>
      <p><strong>Date d''expédition :</strong> {{shipping_date}}</p>
      {{#if tracking_number}}
      <p><strong>Numéro de suivi :</strong> {{tracking_number}}</p>
      {{/if}}
      <p><strong>Transporteur :</strong> {{carrier_name}}</p>
    </div>
    
    <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Adresse de livraison</h3>
      <p>{{shipping_address}}</p>
    </div>
    
    <p>Votre colis devrait arriver dans les prochains jours. Vous recevrez une notification lorsqu''il sera livré.</p>
    
    <p>Cordialement,<br>L''équipe WinShirt</p>
  </div>
</body>
</html>',
  '["customer_name", "order_number", "shipping_date", "tracking_number", "carrier_name", "shipping_address"]'::jsonb
),
(
  'lottery_reminder',
  'Rappel de participation aux loteries',
  'Derniers jours pour participer aux loteries WinShirt !',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Rappel loteries</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #FF6B6B 0%, #ee5a52 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0;">WinShirt</h1>
    <p style="margin: 10px 0 0 0;">N''oubliez pas nos loteries en cours !</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #eee; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333;">Bonjour {{customer_name}} !</h2>
    
    <p>Nous voulions vous rappeler que plusieurs loteries sont actuellement en cours sur WinShirt !</p>
    
    <h3>Loteries actives :</h3>
    {{lottery_list}}
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
      <p style="margin: 0;"><strong>💡 Astuce :</strong> Plus vous commandez, plus vous avez de chances de gagner ! Chaque produit acheté vous donne des tickets de participation automatiquement.</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{site_url}}/lotteries" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Voir les loteries</a>
    </div>
    
    <p>Ne manquez pas votre chance de gagner !</p>
    
    <p>Cordialement,<br>L''équipe WinShirt</p>
  </div>
</body>
</html>',
  '["customer_name", "lottery_list", "site_url"]'::jsonb
);

-- RLS pour la sécurité
ALTER TABLE public.email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policies pour les admins seulement
CREATE POLICY "Admins can manage email settings" ON public.email_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage email templates" ON public.email_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view email logs" ON public.email_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
