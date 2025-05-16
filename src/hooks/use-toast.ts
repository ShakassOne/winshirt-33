
import { toast as sonnerToast } from "sonner";
import React from "react";

type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
  action?: React.ReactNode;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
};

const useToast = () => {
  const toasts: ToastProps[] = [];

  return {
    toasts,
    toast: (title: string, options?: Omit<ToastProps, "title">) => sonnerToast(title, options),
    dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
  };
};

// Compatibility function for both formats
const toast = (titleOrOptions: string | ToastProps, options?: Omit<ToastProps, "title">) => {
  if (typeof titleOrOptions === "string") {
    return sonnerToast(titleOrOptions, options);
  } else {
    const { title, description, ...restOptions } = titleOrOptions;
    return sonnerToast(title || "", { description, ...restOptions });
  }
};

export { useToast, toast };
