
import { supabase } from "@/integrations/supabase/client";
import { Product, Lottery, Design } from "@/types/supabase.types";

export const fetchFeaturedLotteries = async (): Promise<Lottery[]> => {
  try {
    console.log("Fetching featured lotteries...");
    const { data, error } = await supabase
      .from("lotteries")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching featured lotteries:", error);
      throw error;
    }

    console.log("Fetched featured lotteries:", data);
    return data || [];
  } catch (err) {
    console.error("Exception while fetching featured lotteries:", err);
    return [];
  }
};

export const fetchProductsByCategory = async (category?: string): Promise<Product[]> => {
  try {
    console.log(`Fetching products by category: ${category || 'all'}`);
    let query = supabase.from("products").select("*");
    
    if (category) {
      query = query.eq("category", category);
    }

    // Add filter for active products
    query = query.eq("is_active", true);

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} products by category:`, data);
    return data || [];
  } catch (err) {
    console.error("Exception while fetching products by category:", err);
    return [];
  }
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    console.log("Fetching all products...");
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} products:`, data);
    return data || [];
  } catch (err) {
    console.error("Exception while fetching all products:", err);
    return [];
  }
};

export const fetchAllLotteries = async (): Promise<Lottery[]> => {
  try {
    console.log("Fetching all lotteries...");
    const { data, error } = await supabase
      .from("lotteries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all lotteries:", error);
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} lotteries:`, data);
    return data || [];
  } catch (err) {
    console.error("Exception while fetching all lotteries:", err);
    return [];
  }
};

export const fetchDesigns = async (): Promise<Design[]> => {
  try {
    console.log("Fetching designs...");
    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching designs:", error);
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} designs:`, data);
    return data || [];
  } catch (err) {
    console.error("Exception while fetching designs:", err);
    return [];
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log(`Fetching product with id: ${id}`);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return null;
    }

    console.log("Fetched product by id:", data);
    return data;
  } catch (err) {
    console.error("Exception while fetching product by id:", err);
    return null;
  }
};

export const fetchLotteryById = async (id: string): Promise<Lottery | null> => {
  try {
    console.log(`Fetching lottery with id: ${id}`);
    const { data, error } = await supabase
      .from("lotteries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching lottery:", error);
      return null;
    }

    console.log("Fetched lottery by id:", data);
    return data;
  } catch (err) {
    console.error("Exception while fetching lottery by id:", err);
    return null;
  }
};
