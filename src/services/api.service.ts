import { supabase } from "@/integrations/supabase/client";
import { Product, Lottery, Mockup } from "@/types/supabase.types";
import { MockupWithColors, MockupColor } from "@/types/mockup.types";

// Products
export const fetchAllProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Critical error in fetchAllProducts:", err);
    return [];
  }
};

export const fetchProductById = async (id: string) => {
  try {
    if (!id) {
      console.error("Invalid product ID provided");
      return null;
    }
    
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
  } catch (err) {
    console.error(`Critical error in fetchProductById for ID ${id}:`, err);
    return null;
  }
};

export const createProduct = async (productData: Partial<Product>) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([productData as any])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Critical error in createProduct:", err);
    throw err;
  }
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update(productData as any)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`Critical error in updateProduct for ID ${id}:`, err);
    throw err;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  } catch (err) {
    console.error(`Critical error in deleteProduct for ID ${id}:`, err);
    throw err;
  }
};

// Lotteries
export const fetchAllLotteries = async () => {
  try {
    const { data, error } = await supabase
      .from("lotteries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching lotteries:", error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Critical error in fetchAllLotteries:", err);
    return [];
  }
};

export const fetchFeaturedLotteries = async () => {
  try {
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
  } catch (err) {
    console.error("Critical error in fetchFeaturedLotteries:", err);
    return [];
  }
};

export const fetchLotteryById = async (id: string) => {
  try {
    if (!id) {
      console.error("Invalid lottery ID provided");
      return null;
    }
    
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
  } catch (err) {
    console.error(`Critical error in fetchLotteryById for ID ${id}:`, err);
    return null;
  }
};

export const createLottery = async (lotteryData: Partial<Lottery>) => {
  try {
    const { data, error } = await supabase
      .from("lotteries")
      .insert([lotteryData as any]) // Cast to any to avoid type errors
      .select()
      .single();

    if (error) {
      console.error("Error creating lottery:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error during lottery creation:", error);
    throw error;
  }
};

export const updateLottery = async (id: string, lotteryData: Partial<Lottery>) => {
  try {
    const { data, error } = await supabase
      .from("lotteries")
      .update(lotteryData as any) // Cast to any to avoid type errors
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating lottery with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error during lottery update:`, error);
    throw error;
  }
};

export const deleteLottery = async (id: string) => {
  try {
    const { error } = await supabase
      .from("lotteries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting lottery with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error during lottery deletion:`, error);
    throw error;
  }
};

// Mockups
export const fetchAllMockups = async () => {
  try {
    const { data, error } = await supabase
      .from("mockups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching mockups:", error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Critical error in fetchAllMockups:", err);
    return [];
  }
};

export const fetchMockupById = async (id: string): Promise<MockupWithColors | null> => {
  try {
    if (!id) {
      console.error("Invalid mockup ID provided");
      return null;
    }
    
    const { data, error } = await supabase
      .from("mockups")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching mockup with ID ${id}:`, error);
      throw error;
    }

    // Process the print_areas from JSON to array
    let printAreas: any[] = [];
    if (data.print_areas) {
      try {
        printAreas = Array.isArray(data.print_areas) 
          ? data.print_areas 
          : (typeof data.print_areas === 'string' ? JSON.parse(data.print_areas) : []);
      } catch (e) {
        console.error("Error parsing mockup print_areas:", e);
      }
    }

    // Handle colors property
    let colorsArray: MockupColor[] = [];
    // Add safe check for colors property 
    const rawColors = (data as any).colors;
    if (rawColors) {
      try {
        colorsArray = Array.isArray(rawColors) 
          ? rawColors 
          : (typeof rawColors === 'string' ? JSON.parse(rawColors) : []);
      } catch (e) {
        console.error("Error parsing mockup colors:", e);
      }
    }
    
    return {
      ...data,
      print_areas: printAreas,
      colors: colorsArray
    } as MockupWithColors;
  } catch (err) {
    console.error(`Critical error in fetchMockupById for ID ${id}:`, err);
    return null;
  }
};

export const createMockup = async (mockupData: Partial<MockupWithColors>) => {
  try {
    // Need to ensure the data structure is compatible with Supabase
    const supabaseData = {
      ...mockupData,
      print_areas: Array.isArray(mockupData.print_areas) ? mockupData.print_areas : [],
      colors: Array.isArray(mockupData.colors) ? mockupData.colors : []
    };

    const { data, error } = await supabase
      .from("mockups")
      .insert([supabaseData as any]) // Cast to any to avoid type errors
      .select()
      .single();

    if (error) {
      console.error("Error creating mockup:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error during mockup creation:", error);
    throw error;
  }
};

export const updateMockup = async (id: string, mockupData: Partial<MockupWithColors>) => {
  try {
    // Need to ensure the data structure is compatible with Supabase
    const supabaseData = {
      ...mockupData,
      print_areas: Array.isArray(mockupData.print_areas) ? mockupData.print_areas : [],
      colors: Array.isArray(mockupData.colors) ? mockupData.colors : []
    };

    const { data, error } = await supabase
      .from("mockups")
      .update(supabaseData as any) // Cast to any to avoid type errors
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating mockup with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error during mockup update:", error);
    throw error;
  }
};

export const deleteMockup = async (id: string) => {
  try {
    const { error } = await supabase
      .from("mockups")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting mockup with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error("Error during mockup deletion:", error);
    throw error;
  }
};

// Designs
export const fetchAllDesigns = async () => {
  try {
    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching designs:", error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Critical error in fetchAllDesigns:", err);
    return [];
  }
};

export const fetchDesignById = async (id: string) => {
  try {
    if (!id) {
      console.error("Invalid design ID provided");
      return null;
    }
    
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
  } catch (err) {
    console.error(`Critical error in fetchDesignById for ID ${id}:`, err);
    return null;
  }
};

export const createDesign = async (designData: any) => {
  try {
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
  } catch (error) {
    console.error("Error during design creation:", error);
    throw error;
  }
};

export const updateDesign = async (id: string, designData: any) => {
  try {
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
  } catch (error) {
    console.error("Error during design update:", error);
    throw error;
  }
};

export const deleteDesign = async (id: string) => {
  try {
    const { error } = await supabase
      .from("designs")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting design with ID ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error("Error during design deletion:", error);
    throw error;
  }
};

// File upload
export const uploadFileToStorage = async (file: File, folder: string = "uploads"): Promise<string> => {
  try {
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
  } catch (error) {
    console.error("Error during file upload:", error);
    throw error;
  }
};
