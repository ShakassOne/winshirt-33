
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "@/integrations/supabase/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

// Add the missing uploadFileToStorage function
export async function uploadFileToStorage(file: File, targetFolder: string = 'uploads'): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${targetFolder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(targetFolder)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(targetFolder)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Unexpected error uploading file:", error);
    throw error;
  }
}
