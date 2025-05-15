
// Import from the Sonner package
import { toast as sonnerToast, type ToastT } from "sonner";

// Create a type that combines Sonner's toast options with our legacy options
type ToastProps = {
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  [key: string]: any;
};

// Create a wrapper for the sonner toast that accepts both string and object formats
export const toast = (
  titleOrOptions: string | ToastProps,
  options?: ToastProps
) => {
  // If we receive a string as first argument, use it as title
  if (typeof titleOrOptions === 'string') {
    return sonnerToast(titleOrOptions, options);
  } 
  
  // If we receive an object, extract title and the rest of options
  const { title, description, variant, ...rest } = titleOrOptions as ToastProps;
  
  // Map our variant to Sonner's type
  const type = variant === "destructive" ? "error" : "default";
  
  // Call Sonner's toast with the extracted values
  return sonnerToast(
    title as string,
    { 
      description, 
      ...rest 
    }
  );
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
