
import { supabase } from "@/integrations/supabase/client";
import { Product, Lottery, Design } from "@/types/supabase.types";

export const fetchFeaturedLotteries = async (): Promise<Lottery[]> => {
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

export const fetchProductsByCategory = async (category?: string): Promise<Product[]> => {
  let query = supabase.from("products").select("*");
  
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data || [];
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data || [];
};

export const fetchAllLotteries = async (): Promise<Lottery[]> => {
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

export const fetchDesigns = async (): Promise<Design[]> => {
  const { data, error } = await supabase
    .from("designs")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching designs:", error);
    throw error;
  }

  return data || [];
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  return data;
};

export const fetchLotteryById = async (id: string): Promise<Lottery | null> => {
  const { data, error } = await supabase
    .from("lotteries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching lottery:", error);
    return null;
  }

  return data;
};
