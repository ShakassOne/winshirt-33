
import { supabase } from '@/integrations/supabase/client';
import { Product, Lottery, Mockup, Design, SocialNetwork } from '@/types/supabase.types';

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

export const fetchProductsWithTickets = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .gt('tickets_offered', 0)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
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

export const fetchLotteryById = async (id: string): Promise<Lottery | null> => {
  const { data, error } = await supabase
    .from('lotteries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const fetchFeaturedLotteries = async (): Promise<Lottery[]> => {
  const { data, error } = await supabase
    .from('lotteries')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('draw_date', { ascending: true });

  if (error) throw error;
  return data || [];
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

export const createMockup = async (mockup: Omit<Mockup, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('mockups')
    .insert([mockup])
    .select()
    .single();

  if (error) throw error;
  
  cache.delete('mockups');
  return data;
};

export const updateMockup = async (id: string, mockup: Partial<Mockup>) => {
  const { data, error } = await supabase
    .from('mockups')
    .update(mockup)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  cache.delete('mockups');
  return data;
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

export const createDesign = async (design: Omit<Design, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('designs')
    .insert([design])
    .select()
    .single();

  if (error) throw error;
  
  cache.delete('designs');
  return data;
};

export const updateDesign = async (id: string, design: Partial<Design>) => {
  const { data, error } = await supabase
    .from('designs')
    .update(design)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  cache.delete('designs');
  return data;
};

export const deleteDesign = async (id: string) => {
  const { error } = await supabase
    .from('designs')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  cache.delete('designs');
};

// Social Networks
export const fetchAllSocialNetworks = async (): Promise<SocialNetwork[]> => {
  const { data, error } = await supabase
    .from('social_networks')
    .select('*')
    .order('priority', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const fetchActiveSocialNetworks = async (): Promise<SocialNetwork[]> => {
  const { data, error } = await supabase
    .from('social_networks')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createSocialNetwork = async (socialNetwork: Omit<SocialNetwork, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('social_networks')
    .insert([socialNetwork])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSocialNetwork = async (id: string, socialNetwork: Partial<SocialNetwork>) => {
  const { data, error } = await supabase
    .from('social_networks')
    .update(socialNetwork)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSocialNetwork = async (id: string) => {
  const { error } = await supabase
    .from('social_networks')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// CRUD Operations
export const createProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  
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
  
  cache.delete('products');
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  cache.delete('products');
};

export const createLottery = async (lottery: Omit<Lottery, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('lotteries')
    .insert([lottery])
    .select()
    .single();

  if (error) throw error;
  
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
  
  cache.delete('lotteries');
  return data;
};

export const deleteLottery = async (id: string) => {
  const { error } = await supabase
    .from('lotteries')
    .delete()
    .eq('id', id);

  if (error) throw error;
  
  cache.delete('lotteries');
};

// Upload function
export const uploadToExternalScript = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.example.com/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const result = await response.json();
  return result.url;
};

// Design generation function  
export const generateDesign = async (prompt: string): Promise<string> => {
  // Mock implementation - replace with actual API call
  return `https://api.example.com/generate/${encodeURIComponent(prompt)}`;
};

// Cache utilities
export const clearCache = () => {
  cache.clear();
};

export const clearCacheKey = (key: string) => {
  cache.delete(key);
};
