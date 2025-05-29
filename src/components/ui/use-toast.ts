
// Re-export sonner toast pour maintenir la compatibilité
export { toast } from "sonner";

// Créer un hook useToast pour la compatibilité avec l'ancien système
export const useToast = () => {
  return {
    toast: (message: string) => {
      return import("sonner").then(({ toast }) => toast.success(message));
    }
  };
};
