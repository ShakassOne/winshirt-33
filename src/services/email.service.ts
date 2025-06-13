import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface EmailTemplate {
  id: string;
  type: string;
  name: string;
  subject: string;
  html_content: string;
  variables: Json;
  is_active: boolean;
}

export interface EmailSettings {
  id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean;
  smtp_user: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
  is_active: boolean;
}

export interface EmailLog {
  id: string;
  template_id: string | null;
  recipient_email: string;
  recipient_name?: string | null;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  error_message?: string | null;
  sent_at?: string | null;
  order_id?: string | null;
  lottery_id?: string | null;
  created_at: string;
}

// Service principal pour la gestion des emails
export class EmailService {
  
  // Récupérer tous les templates
  static async getTemplates(): Promise<EmailTemplate[]> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('type');
    
    if (error) throw error;
    return (data || []) as EmailTemplate[];
  }

  // Récupérer un template par type
  static async getTemplateByType(type: string): Promise<EmailTemplate | null> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Erreur récupération template:', error);
      return null;
    }
    return data as EmailTemplate;
  }

  // Créer ou mettre à jour un template
  static async upsertTemplate(template: Omit<EmailTemplate, 'id'> & { id?: string }): Promise<EmailTemplate> {
    const { data, error } = await supabase
      .from('email_templates')
      .upsert({
        ...template,
        variables: template.variables || []
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as EmailTemplate;
  }

  // Récupérer les paramètres SMTP
  static async getEmailSettings(): Promise<EmailSettings | null> {
    const { data, error } = await supabase
      .from('email_settings')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Erreur récupération settings:', error);
      return null;
    }
    return data as EmailSettings | null;
  }

  // Créer ou mettre à jour les paramètres avec les valeurs IONOS correctes
  static async upsertEmailSettings(settings: Omit<EmailSettings, 'id'> & { id?: string }): Promise<EmailSettings> {
    // Forcer les paramètres IONOS corrects selon la documentation
    const ionosSettings = {
      ...settings,
      smtp_host: 'smtp.ionos.fr',
      smtp_port: 465, // Port SSL selon IONOS
      smtp_secure: true, // SSL activé
      smtp_user: 'admin@winshirt.fr',
      from_email: 'admin@winshirt.fr',
      from_name: 'WinShirt',
      is_active: true
    };

    console.log('🔍 [EmailService] Mise à jour paramètres SMTP avec:', {
      host: ionosSettings.smtp_host,
      port: ionosSettings.smtp_port,
      secure: ionosSettings.smtp_secure,
      user: ionosSettings.smtp_user
    });

    const { data, error } = await supabase
      .from('email_settings')
      .upsert(ionosSettings)
      .select()
      .single();
    
    if (error) throw error;
    return data as EmailSettings;
  }

  // Récupérer les logs d'envoi
  static async getEmailLogs(limit: number = 50): Promise<EmailLog[]> {
    const { data, error } = await supabase
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data || []) as EmailLog[];
  }

  // Remplacer les variables dans le template
  static replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value || ''));
    });
    
    return result;
  }

  // Envoyer un email de confirmation de commande
  static async sendOrderConfirmation(orderId: string): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('send-order-confirmation', {
        body: { orderId }
      });

      if (error) {
        console.error('Erreur envoi email confirmation:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      return false;
    }
  }

  // Envoyer une notification d'expédition
  static async sendShippingNotification(orderId: string, trackingNumber?: string): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('send-shipping-notification', {
        body: { orderId, trackingNumber }
      });

      if (error) {
        console.error('Erreur envoi notification expédition:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      return false;
    }
  }

  // Envoyer des rappels de loteries
  static async sendLotteryReminders(): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('send-lottery-reminders');

      if (error) {
        console.error('Erreur envoi rappels loterie:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      return false;
    }
  }

  // Tester l'envoi d'un email avec debug amélioré
  static async testEmail(
    recipientEmail: string,
    templateType: string
  ): Promise<{ success: boolean; message?: string; debug?: any }> {
    try {
      console.log(`🔍 [EmailService] Test email ${templateType} vers ${recipientEmail}`);
      
      const { data, error } = await supabase.functions.invoke('test-email', {
        body: { recipientEmail, templateType }
      });

      console.log(`🔍 [EmailService] Réponse fonction:`, { data, error });

      if (error) {
        console.error('❌ [EmailService] Erreur fonction:', error);
        return { 
          success: false, 
          message: `Erreur de la fonction: ${error.message}`,
          debug: { 
            functionError: error,
            errorContext: error.context || 'Aucun contexte disponible'
          }
        };
      }

      if (data && typeof data === 'object') {
        if ('error' in data && data.error) {
          console.error('❌ [EmailService] Erreur dans la réponse:', data);
          return { 
            success: false, 
            message: data.error,
            debug: data.debug || {}
          };
        }

        if ('success' in data && data.success) {
          console.log('✅ [EmailService] Email envoyé avec succès');
          return { 
            success: true, 
            message: data.message,
            debug: data.debug || {}
          };
        }
      }

      // Si on arrive ici, la réponse est inattendue
      console.warn('⚠️ [EmailService] Réponse inattendue:', data);
      return { 
        success: false, 
        message: 'Réponse inattendue de la fonction',
        debug: { unexpectedResponse: data }
      };

    } catch (error: any) {
      console.error('❌ [EmailService] Exception:', error);
      return { 
        success: false, 
        message: error.message || 'Erreur inconnue',
        debug: { exception: error.name, stack: error.stack }
      };
    }
  }
}
