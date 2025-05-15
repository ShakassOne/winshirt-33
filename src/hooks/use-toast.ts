
// Import from the Sonner package
import { toast as sonnerToast, type ToastT } from "sonner";

// Create types for the toast function
type ToastProps = {
  description?: string;
  variant?: "default" | "destructive";
  [key: string]: any;
};

// Create a wrapper for the sonner toast that accepts both our old API and the new one
export const toast = (
  titleOrMessage: string,
  props?: ToastProps
) => {
  // Map our variant to Sonner's type
  const type = props?.variant === "destructive" ? "error" : "default";
  
  return sonnerToast(titleOrMessage, {
    description: props?.description,
    // Use Sonner's format directly instead of trying to convert
    ...(props || {})
  });
};

// Create a custom useToast hook that provides the same API for compatibility
export const useToast = () => {
  const toasts: ToastT[] = []; // Simplified implementation
  return {
    toast,
    toasts,
    dismiss: (id: string) => {},
  };
};
