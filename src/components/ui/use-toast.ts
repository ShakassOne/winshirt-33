
// Re-export sonner toast pour maintenir la compatibilité
export { toast } from "sonner";

// Créer un hook useToast pour la compatibilité avec l'ancien système
export const useToast = () => {
  return {
    toast: (options: { title: string; description?: string; variant?: "default" | "destructive" }) => {
      if (options.variant === "destructive") {
        return import("sonner").then(({ toast }) => toast.error(options.description || options.title));
      }
      return import("sonner").then(({ toast }) => toast.success(options.description || options.title));
    }
  };
};
