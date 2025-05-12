
import { supabase } from "@/integrations/supabase/client";
import { Product, Lottery, Design, Mockup } from "@/types/supabase.types";

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
    const { data, error } = await supabase
      .from('designs')
      .insert([designData])
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
    const { data, error } = await supabase
      .from('mockups')
      .insert([mockupData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating mockup:", error);
    return null;
  }
};

// Update an existing mockup
export const updateMockup = async (id: string, mockupData: Partial<Mockup>): Promise<Mockup | null> => {
  try {
    const { data, error } = await supabase
      .from('mockups')
      .update(mockupData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
    return data;
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
    return data || [];
  } catch (error) {
    console.error("Error fetching all mockups:", error);
    return [];
  }
};

// Create a new product
export const createProduct = async (productData: Partial<Product>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
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
    const { data, error } = await supabase
      .from('lotteries')
      .insert([lotteryData])
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
