import { Product, Lottery, Mockup } from "@/types/supabase.types";
import { supabase } from "@/integrations/supabase/client";
import { MockupWithColors, convertJsonToMockupColors, convertJsonToPrintAreas } from "@/types/mockup.types";

// Products
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching product with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error fetching product with id ${id}:`, error);
    return null;
  }
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating product:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error creating product:", error);
    return null;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating product with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error updating product with id ${id}:`, error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting product with id ${id}:`, error);
    return false;
  }
};

// Lotteries
export const fetchAllLotteries = async (): Promise<Lottery[]> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching lotteries:", error);
    return [];
  }
};

export const fetchLotteryById = async (id: string): Promise<Lottery | null> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching lottery with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error fetching lottery with id ${id}:`, error);
    return null;
  }
};

export const createLottery = async (lottery: Omit<Lottery, 'id'>): Promise<Lottery | null> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .insert([lottery])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating lottery:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error creating lottery:", error);
    return null;
  }
};

export const updateLottery = async (id: string, updates: Partial<Lottery>): Promise<Lottery | null> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating lottery with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error updating lottery with id ${id}:`, error);
    return null;
  }
};

export const deleteLottery = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lotteries')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting lottery with id ${id}:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting lottery with id ${id}:`, error);
    return false;
  }
};

// Mockups
export const fetchAllMockups = async (): Promise<Mockup[]> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching mockups:", error);
    return [];
  }
};

export const fetchMockupById = async (id: string): Promise<Mockup | null> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching mockup with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error fetching mockup with id ${id}:`, error);
    return null;
  }
};

export const createMockup = async (mockup: Omit<Mockup, 'id'>): Promise<Mockup | null> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .insert([mockup])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating mockup:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Unexpected error creating mockup:", error);
    return null;
  }
};

export const updateMockup = async (id: string, updates: Partial<Mockup>): Promise<Mockup | null> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating mockup with id ${id}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Unexpected error updating mockup with id ${id}:`, error);
    return null;
  }
};

export const deleteMockup = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mockups')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting mockup with id ${id}:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Unexpected error deleting mockup with id ${id}:`, error);
    return false;
  }
};

export const uploadMockupImage = async (file: File, targetFolder: string = 'mockups'): Promise<string | null> => {
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
      console.error("Error uploading mockup image:", error);
      return null;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(targetFolder)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Unexpected error uploading mockup image:", error);
    return null;
  }
};

export const updateMockupImage = async (mockupId: string, imageUrl: string): Promise<Mockup | null> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .update({ image_url: imageUrl })
      .eq('id', mockupId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating mockup image for mockup with id ${mockupId}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Unexpected error updating mockup image for mockup with id ${mockupId}:`, error);
    return null;
  }
};

export const fetchMockupWithColorsById = async (id: string): Promise<MockupWithColors | null> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching mockup with id ${id}:`, error);
      return null;
    }
    
    if (!data) {
      return null;
    }

    // Use the conversion functions to properly convert the JSON data
    const printAreas = convertJsonToPrintAreas(data.print_areas);
    const colors = convertJsonToMockupColors(data.colors);
    
    return {
      ...data,
      print_areas: printAreas,
      colors: colors
    } as MockupWithColors;
  } catch (error) {
    console.error(`Unexpected error fetching mockup with id ${id}:`, error);
    return null;
  }
};

export const updateMockupWithColors = async (id: string, updates: Partial<MockupWithColors>): Promise<MockupWithColors | null> => {
  try {
    // Use the conversion functions to properly handle the print_areas
    const printAreas = updates.print_areas 
      ? Array.isArray(updates.print_areas) 
        ? updates.print_areas 
        : convertJsonToPrintAreas(updates.print_areas as any)
      : [];
    
    const { data, error } = await supabase
      .from('mockups')
      .update({
        ...updates,
        print_areas: printAreas
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating mockup with id ${id}:`, error);
      return null;
    }
    
    // Convert the returned data
    const returnedPrintAreas = convertJsonToPrintAreas(data.print_areas);
    const returnedColors = convertJsonToMockupColors(data.colors);
    
    return {
      ...data,
      print_areas: returnedPrintAreas,
      colors: returnedColors
    } as MockupWithColors;
  } catch (error) {
    console.error(`Unexpected error updating mockup with id ${id}:`, error);
    return null;
  }
};
