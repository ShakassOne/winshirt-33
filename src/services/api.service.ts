
import { supabase } from '@/integrations/supabase/client';
import { Product, Lottery, Mockup, Design } from '@/types/supabase.types';

// Cache simple pour éviter les requêtes répétées
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = <T>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

// Products
export const fetchAllProducts = async (): Promise<Product[]> => {
  const cacheKey = 'products';
  const cached = getCachedData<Product[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  const products = data || [];
  setCachedData(cacheKey, products);
  return products;
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Lotteries
export const fetchAllLotteries = async (): Promise<Lottery[]> => {
  const cacheKey = 'lotteries';
  const cached = getCachedData<Lottery[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('lotteries')
    .select('*')
    .eq('is_active', true)
    .order('draw_date', { ascending: true });

  if (error) throw error;
  
  const lotteries = data || [];
  setCachedData(cacheKey, lotteries);
  return lotteries;
};

// Mockups
export const fetchAllMockups = async (): Promise<Mockup[]> => {
  const cacheKey = 'mockups';
  const cached = getCachedData<Mockup[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('mockups')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  
  const mockups = data || [];
  setCachedData(cacheKey, mockups);
  return mockups;
};

// Designs
export const fetchAllDesigns = async (): Promise<Design[]> => {
  const cacheKey = 'designs';
  const cached = getCachedData<Design[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from('designs')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  
  const designs = data || [];
  setCachedData(cacheKey, designs);
  return designs;
};

// CRUD Operations
export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  
  // Invalider le cache
  cache.delete('products');
  return data;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  // Invalider le cache
  cache.delete('products');
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  // Invalider le cache
  cache.delete('products');
};

export const createLottery = async (lottery: Omit<Lottery, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('lotteries')
    .insert([lottery])
    .select()
    .single();

  if (error) throw error;
  
  // Invalider le cache
  cache.delete('lotteries');
  return data;
};

export const updateLottery = async (id: string, lottery: Partial<Lottery>) => {
  const { data, error } = await supabase
    .from('lotteries')
    .update(lottery)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  // Invalider le cache
  cache.delete('lotteries');
  return data;
};

export const deleteLottery = async (id: string) => {
  const { error } = await supabase
    .from('lotteries')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  // Invalider le cache
  cache.delete('lotteries');
};

// Cache utilities
export const clearCache = () => {
  cache.clear();
};

export const clearCacheKey = (key: string) => {
  cache.delete(key);
};
