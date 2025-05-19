import { supabase } from "@/integrations/supabase/client";
import { Design, Lottery, Mockup, Product } from "@/types/supabase.types";
import { PrintArea } from "@/types/mockup.types";
import { Json } from "@/integrations/supabase/types";

// Fetch all products
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchAllProducts:", error);
    throw error;
  }
};

// Fetch a product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error(`Error in fetchProductById for ID ${id}:`, error);
    return null;
  }
};

// Fetch all lotteries
export const fetchAllLotteries = async (): Promise<Lottery[]> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching lotteries:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchAllLotteries:", error);
    throw error;
  }
};

// Fetch a lottery by ID
export const fetchLotteryById = async (id: string): Promise<Lottery | null> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching lottery with ID ${id}:`, error);
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error(`Error in fetchLotteryById for ID ${id}:`, error);
    return null;
  }
};

// Fetch all designs
export const fetchAllDesigns = async () => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching designs:", error);
    throw error;
  }
};

// Create a new design
export const createDesign = async (design: Omit<Design, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .insert([design])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating design:", error);
    throw error;
  }
};

// Update an existing design
export const updateDesign = async (id: string, updates: Partial<Design>) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating design:", error);
    throw error;
  }
};

// Delete a design
export const deleteDesign = async (id: string) => {
  try {
    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting design:", error);
    throw error;
  }
};

// Fetch featured lotteries
export const fetchFeaturedLotteries = async () => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching featured lotteries:", error);
    throw error;
  }
};

// Fetch all mockups
export const fetchAllMockups = async () => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Convert the data to proper format
    const mockups = data?.map(mockup => ({
      ...mockup,
      print_areas: typeof mockup.print_areas === 'string' 
        ? JSON.parse(mockup.print_areas as string) 
        : mockup.print_areas,
      colors: typeof mockup.colors === 'string' 
        ? JSON.parse(mockup.colors as string) 
        : mockup.colors
    })) as unknown as Mockup[];
    
    return mockups || [];
  } catch (error) {
    console.error("Error fetching mockups:", error);
    throw error;
  }
};

export const fetchMockupById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Convert the data to proper format
    const mockup = {
      ...data,
      print_areas: typeof data.print_areas === 'string' 
        ? JSON.parse(data.print_areas as string) 
        : data.print_areas,
      colors: typeof data.colors === 'string' 
        ? JSON.parse(data.colors as string) 
        : data.colors
    } as unknown as Mockup;
    
    return mockup;
  } catch (error) {
    console.error("Error fetching mockup:", error);
    throw error;
  }
};

// Upload file to storage
export const uploadFileToStorage = async (
  file: File, 
  bucket: string = 'designs', 
  path: string = ''
): Promise<string> => {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Create a new lottery
export const createLottery = async (lottery: Partial<Lottery>): Promise<Lottery> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .insert([lottery])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating lottery:", error);
    throw error;
  }
};

// Update an existing lottery
export const updateLottery = async (id: string, updates: Partial<Lottery>): Promise<Lottery> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating lottery:", error);
    throw error;
  }
};

// Delete a lottery
export const deleteLottery = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lotteries')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting lottery:", error);
    throw error;
  }
};

// Create a new mockup
export const createMockup = async (mockup: any): Promise<Mockup> => {
  try {
    // Transform mockup data if needed
    const mockupData = {
      ...mockup,
      print_areas: Array.isArray(mockup.print_areas) ? JSON.stringify(mockup.print_areas) : mockup.print_areas,
      colors: mockup.colors ? JSON.stringify(mockup.colors) : null
    };
    
    const { data, error } = await supabase
      .from('mockups')
      .insert([mockupData])
      .select()
      .single();
      
    if (error) throw error;
    
    // Convert the data to proper format
    const result = {
      ...data,
      print_areas: typeof data.print_areas === 'string' ? JSON.parse(data.print_areas as string) : data.print_areas,
      colors: typeof data.colors === 'string' ? JSON.parse(data.colors as string) : data.colors
    } as unknown as Mockup;
    
    return result;
  } catch (error) {
    console.error("Error creating mockup:", error);
    throw error;
  }
};

// Update an existing mockup
export const updateMockup = async (id: string, mockup: any): Promise<Mockup> => {
  try {
    // Transform mockup data if needed
    const mockupData = {
      ...mockup,
      print_areas: Array.isArray(mockup.print_areas) ? JSON.stringify(mockup.print_areas) : mockup.print_areas,
      colors: mockup.colors ? JSON.stringify(mockup.colors) : null
    };
    
    const { data, error } = await supabase
      .from('mockups')
      .update(mockupData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    // Convert the data to proper format
    const result = {
      ...data,
      print_areas: typeof data.print_areas === 'string' ? JSON.parse(data.print_areas as string) : data.print_areas,
      colors: typeof data.colors === 'string' ? JSON.parse(data.colors as string) : data.colors
    } as unknown as Mockup;
    
    return result;
  } catch (error) {
    console.error("Error updating mockup:", error);
    throw error;
  }
};
