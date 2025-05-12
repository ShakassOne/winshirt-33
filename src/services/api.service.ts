import { supabase } from "@/integrations/supabase/client";
import { Product, Lottery } from "@/types/supabase.types";

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
