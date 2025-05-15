
// Import from the Sonner package instead of Radix UI
import { toast } from "sonner";

// Re-export the toast function
export { toast };

// Create a custom useToast hook that provides the same API
export const useToast = () => {
  const toasts = []; // Simplified implementation
  return {
    toast,
    toasts,
    dismiss: (id: string) => {},
  };
};
