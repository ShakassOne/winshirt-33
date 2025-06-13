
import { useCallback } from 'react';
import { EmailService } from '@/services/email.service';
import { useToast } from '@/hooks/use-toast';

export const useEmailNotifications = () => {
  const { toast } = useToast();

  const sendOrderConfirmation = useCallback(async (orderId: string) => {
    try {
      console.log(`📧 [EmailNotifications] Envoi confirmation commande ${orderId}`);
      const success = await EmailService.sendOrderConfirmation(orderId);
      
      if (success) {
        console.log(`✅ [EmailNotifications] Confirmation envoyée pour ${orderId}`);
        toast({
          title: "Email envoyé",
          description: "Confirmation de commande envoyée au client"
        });
      } else {
        console.error(`❌ [EmailNotifications] Échec envoi confirmation ${orderId}`);
      }
      
      return success;
    } catch (error) {
      console.error(`❌ [EmailNotifications] Erreur envoi confirmation ${orderId}:`, error);
      return false;
    }
  }, [toast]);

  const sendShippingNotification = useCallback(async (orderId: string, trackingNumber?: string) => {
    try {
      console.log(`📧 [EmailNotifications] Envoi notification expédition ${orderId}`);
      const success = await EmailService.sendShippingNotification(orderId, trackingNumber);
      
      if (success) {
        console.log(`✅ [EmailNotifications] Notification expédition envoyée pour ${orderId}`);
        toast({
          title: "Email envoyé",
          description: "Notification d'expédition envoyée au client"
        });
      } else {
        console.error(`❌ [EmailNotifications] Échec envoi notification ${orderId}`);
      }
      
      return success;
    } catch (error) {
      console.error(`❌ [EmailNotifications] Erreur envoi notification ${orderId}:`, error);
      return false;
    }
  }, [toast]);

  const sendLotteryReminders = useCallback(async () => {
    try {
      console.log(`📧 [EmailNotifications] Envoi rappels loteries`);
      const success = await EmailService.sendLotteryReminders();
      
      if (success) {
        console.log(`✅ [EmailNotifications] Rappels loteries envoyés`);
        toast({
          title: "Rappels envoyés",
          description: "Rappels de loteries envoyés aux clients"
        });
      } else {
        console.error(`❌ [EmailNotifications] Échec envoi rappels`);
      }
      
      return success;
    } catch (error) {
      console.error(`❌ [EmailNotifications] Erreur envoi rappels:`, error);
      return false;
    }
  }, [toast]);

  return {
    sendOrderConfirmation,
    sendShippingNotification,
    sendLotteryReminders
  };
};
