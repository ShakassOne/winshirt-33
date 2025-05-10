import { supabase } from "@/integrations/supabase/client";
import { Product, Lottery, Mockup } from "@/types/supabase.types";
import { MockupWithColors, MockupColor } from "@/types/mockup.types";

// Products
export const fetchAllProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data || [];
};

export const fetchProductById = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }

  return data;
};

export const createProduct = async (productData: Partial<Product>) => {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  return data;
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }

  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};

// Lotteries
export const fetchAllLotteries = async () => {
  const { data, error } = await supabase
    .from("lotteries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching lotteries:", error);
    throw error;
  }

  return data || [];
};

export const fetchFeaturedLotteries = async () => {
  const { data, error } = await supabase
    .from("lotteries")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured lotteries:", error);
    throw error;
  }

  return data || [];
};

export const fetchLotteryById = async (id: string) => {
  const { data, error } = await supabase
    .from("lotteries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching lottery with ID ${id}:`, error);
    throw error;
  }

  return data;
};

export const createLottery = async (lotteryData: Partial<Lottery>) => {
  const { data, error } = await supabase
    .from("lotteries")
    .insert([lotteryData])
    .select()
    .single();

  if (error) {
    console.error("Error creating lottery:", error);
    throw error;
  }

  return data;
};

export const updateLottery = async (id: string, lotteryData: Partial<Lottery>) => {
  const { data, error } = await supabase
    .from("lotteries")
    .update(lotteryData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating lottery with ID ${id}:`, error);
    throw error;
  }

  return data;
};

export const deleteLottery = async (id: string) => {
  const { error } = await supabase
    .from("lotteries")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting lottery with ID ${id}:`, error);
    throw error;
  }
};

// Mockups
export const fetchAllMockups = async () => {
  const { data, error } = await supabase
    .from("mockups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching mockups:", error);
    throw error;
  }

  return data || [];
};

export const fetchMockupById = async (id: string): Promise<MockupWithColors> => {
  const { data, error } = await supabase
    .from("mockups")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching mockup with ID ${id}:`, error);
    throw error;
  }

  // Ensure colors property is an array
  let colors: MockupColor[] = [];
  if (data.colors) {
    try {
      colors = Array.isArray(data.colors) 
        ? data.colors 
        : (typeof data.colors === 'string' ? JSON.parse(data.colors) : []);
    } catch (e) {
      console.error("Error parsing mockup colors:", e);
    }
  }
  
  return {
    ...data,
    colors: Array.isArray(colors) ? colors : []
  };
};

export const createMockup = async (mockupData: Partial<MockupWithColors>) => {
  const { data, error } = await supabase
    .from("mockups")
    .insert([mockupData])
    .select()
    .single();

  if (error) {
    console.error("Error creating mockup:", error);
    throw error;
  }

  return data;
};

export const updateMockup = async (id: string, mockupData: Partial<MockupWithColors>) => {
  const { data, error } = await supabase
    .from("mockups")
    .update(mockupData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating mockup with ID ${id}:`, error);
    throw error;
  }

  return data;
};

export const deleteMockup = async (id: string) => {
  const { error } = await supabase
    .from("mockups")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting mockup with ID ${id}:`, error);
    throw error;
  }
};

// Designs
export const fetchAllDesigns = async () => {
  const { data, error } = await supabase
    .from("designs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching designs:", error);
    throw error;
  }

  return data || [];
};

export const fetchDesignById = async (id: string) => {
  const { data, error } = await supabase
    .from("designs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching design with ID ${id}:`, error);
    throw error;
  }

  return data;
};

export const createDesign = async (designData: any) => {
  const { data, error } = await supabase
    .from("designs")
    .insert([designData])
    .select()
    .single();

  if (error) {
    console.error("Error creating design:", error);
    throw error;
  }

  return data;
};

export const updateDesign = async (id: string, designData: any) => {
  const { data, error } = await supabase
    .from("designs")
    .update(designData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating design with ID ${id}:`, error);
    throw error;
  }

  return data;
};

export const deleteDesign = async (id: string) => {
  const { error } = await supabase
    .from("designs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting design with ID ${id}:`, error);
    throw error;
  }
};

// File upload
export const uploadFileToStorage = async (file: File, folder: string = "uploads"): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("public")
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error("Error uploading file:", error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage.from("public").getPublicUrl(filePath);
  return publicUrl;
};
