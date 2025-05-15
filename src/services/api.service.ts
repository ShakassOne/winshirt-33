import { supabase } from "@/integrations/supabase/client";
import { Product, Lottery, Design, Mockup, PrintArea } from "@/types/supabase.types";
import { Json } from "@/integrations/supabase/types";

// Fetch all products
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
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
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching lotteries:", error);
    return [];
  }
};

// Fetch featured lotteries
export const fetchFeaturedLotteries = async (): Promise<Lottery[]> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching featured lotteries:", error);
    return [];
  }
};

// Fetch a single lottery by ID
export const fetchLotteryById = async (id: string): Promise<Lottery | null> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error("Error fetching lottery by ID:", error);
    return null;
  }
};

// Add the missing fetchRelatedProducts function
export const fetchRelatedProducts = async (productId: string, limit: number = 4) => {
  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('category')
      .eq('id', productId)
      .single();
      
    if (productError) throw productError;
    
    // Get products in same category excluding current product
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', productId)
      .eq('is_active', true)
      .limit(limit);
      
    if (error) throw error;
    
    if (data && data.length < limit) {
      // If not enough related products in same category, get more from other categories
      const { data: moreProducts, error: moreError } = await supabase
        .from('products')
        .select('*')
        .neq('id', productId)
        .neq('category', product.category)
        .eq('is_active', true)
        .limit(limit - data.length);
        
      if (!moreError && moreProducts) {
        return [...data, ...moreProducts];
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};

// Create a new design
export const createDesign = async (designData: Partial<Design>): Promise<Design | null> => {
  try {
    // Make sure required fields are present
    if (!designData.name || !designData.image_url || !designData.category) {
      throw new Error("Missing required fields for design");
    }
    
    const { data, error } = await supabase
      .from('designs')
      .insert([{
        name: designData.name,
        image_url: designData.image_url,
        category: designData.category,
        is_active: designData.is_active || true
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating design:", error);
    return null;
  }
};

// Update an existing design
export const updateDesign = async (id: string, designData: Partial<Design>): Promise<Design | null> => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .update(designData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating design:", error);
    return null;
  }
};

// Delete a design
export const deleteDesign = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting design:", error);
    return false;
  }
};

// Fetch all designs
export const fetchAllDesigns = async (): Promise<Design[]> => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching all designs:", error);
    return [];
  }
};

// Create a new mockup
export const createMockup = async (mockupData: Partial<Mockup>): Promise<Mockup | null> => {
  try {
    // Make sure required fields are present
    if (!mockupData.name || !mockupData.category || !mockupData.svg_front_url) {
      throw new Error("Missing required fields for mockup");
    }
    
    // Handle the print_areas array type
    const dataToInsert = {
      name: mockupData.name,
      category: mockupData.category,
      svg_front_url: mockupData.svg_front_url,
      svg_back_url: mockupData.svg_back_url,
      price_a3: mockupData.price_a3 || 0,
      price_a4: mockupData.price_a4 || 0,
      price_a5: mockupData.price_a5 || 0,
      price_a6: mockupData.price_a6 || 0,
      text_price_front: mockupData.text_price_front || 0,
      text_price_back: mockupData.text_price_back || 0,
      is_active: mockupData.is_active !== false,
      // Convert PrintArea[] to JSON if needed
      print_areas: mockupData.print_areas ? JSON.stringify(mockupData.print_areas) : JSON.stringify([]),
      // Handle colors array if present
      colors: mockupData.colors ? JSON.stringify(mockupData.colors) : null
    };
    
    const { data, error } = await supabase
      .from('mockups')
      .insert([dataToInsert])
      .select()
      .single();
    
    if (error) throw error;
    
    // Parse the JSON data back to arrays
    const result = {
      ...data,
      print_areas: data.print_areas ? JSON.parse(data.print_areas as string) : [],
      colors: data.colors ? JSON.parse(data.colors as string) : []
    };
    
    return result as Mockup;
  } catch (error) {
    console.error("Error creating mockup:", error);
    return null;
  }
};

// Update an existing mockup
export const updateMockup = async (id: string, mockupData: Partial<Mockup>): Promise<Mockup | null> => {
  try {
    // Handle arrays that need to be stringified
    const dataToUpdate: any = { ...mockupData };
    
    if (mockupData.print_areas) {
      dataToUpdate.print_areas = JSON.stringify(mockupData.print_areas);
    }
    
    if (mockupData.colors) {
      dataToUpdate.colors = JSON.stringify(mockupData.colors);
    }
    
    const { data, error } = await supabase
      .from('mockups')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Parse JSON fields back to arrays
    const result = {
      ...data,
      print_areas: data.print_areas ? JSON.parse(data.print_areas as string) : [],
      colors: data.colors ? JSON.parse(data.colors as string) : []
    };
    
    return result as Mockup;
  } catch (error) {
    console.error("Error updating mockup:", error);
    return null;
  }
};

// Fetch mockup by ID
export const fetchMockupById = async (id: string): Promise<Mockup | null> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Parse JSON fields
    const result = {
      ...data,
      print_areas: data.print_areas ? JSON.parse(data.print_areas as string) : [],
      colors: data.colors ? JSON.parse(data.colors as string) : []
    };
    
    return result as Mockup;
  } catch (error) {
    console.error("Error fetching mockup by ID:", error);
    return null;
  }
};

// Fetch all mockups
export const fetchAllMockups = async (): Promise<Mockup[]> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data) return [];
    
    // Parse JSON fields for all mockups
    const result = data.map(item => ({
      ...item,
      print_areas: item.print_areas ? JSON.parse(item.print_areas as string) : [],
      colors: item.colors ? JSON.parse(item.colors as string) : []
    }));
    
    return result as Mockup[];
  } catch (error) {
    console.error("Error fetching all mockups:", error);
    return [];
  }
};

// Create a new product
export const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  try {
    // Make sure required fields are present
    if (!productData.name || !productData.description || !productData.price || 
        !productData.image_url || !productData.category) {
      throw new Error("Missing required fields for product");
    }
    
    // Create a valid product object with all required fields
    const dataToInsert = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      image_url: productData.image_url,
      category: productData.category,
      is_customizable: productData.is_customizable || false,
      available_colors: productData.available_colors || [],
      available_sizes: productData.available_sizes || [],
      color: productData.color || null,
      tickets_offered: productData.tickets_offered || 0,
      is_active: productData.is_active !== false,
      mockup_id: productData.mockup_id || null
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert([dataToInsert])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};

// Update an existing product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
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
    return false;
  }
};

// Create a new lottery
export const createLottery = async (lotteryData: Partial<Lottery>): Promise<Lottery | null> => {
  try {
    // Make sure required fields are present
    if (!lotteryData.title || !lotteryData.description || !lotteryData.image_url || 
        lotteryData.value === undefined || lotteryData.goal === undefined || !lotteryData.draw_date) {
      throw new Error("Missing required fields for lottery");
    }
    
    const dataToInsert = {
      title: lotteryData.title,
      description: lotteryData.description,
      image_url: lotteryData.image_url,
      value: lotteryData.value,
      goal: lotteryData.goal,
      participants: lotteryData.participants || 0,
      draw_date: lotteryData.draw_date,
      is_active: lotteryData.is_active !== false,
      is_featured: lotteryData.is_featured || false
    };
    
    const { data, error } = await supabase
      .from('lotteries')
      .insert([dataToInsert])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating lottery:", error);
    return null;
  }
};

// Update an existing lottery
export const updateLottery = async (id: string, lotteryData: Partial<Lottery>): Promise<Lottery | null> => {
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .update(lotteryData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating lottery:", error);
    return null;
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
    return false;
  }
};

// Upload file to Supabase storage
export const uploadFileToStorage = async (file: File, folder: string = 'uploads'): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('public')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;

    const { data } = supabase.storage.from('public').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
