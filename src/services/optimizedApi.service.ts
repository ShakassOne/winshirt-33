
import { supabase } from '@/integrations/supabase/client';
import { Product, Lottery } from '@/types/supabase.types';

// Configuration pour les requêtes optimisées
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEFAULT_PAGE_SIZE = 20;

// Cache simple en mémoire pour éviter les requêtes répétées
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const apiCache = new SimpleCache();

// Fonction utilitaire pour créer des clés de cache
const createCacheKey = (base: string, page: number, limit: number, filters?: Record<string, any>) => {
  const filterStr = filters ? JSON.stringify(filters) : '';
  return `${base}_${page}_${limit}_${filterStr}`;
};

// API optimisée pour les produits avec pagination
export const fetchProductsPaginated = async (
  page: number = 1, 
  limit: number = DEFAULT_PAGE_SIZE,
  filters?: { category?: string; search?: string; isActive?: boolean }
): Promise<{ data: Product[]; total: number }> => {
  const cacheKey = createCacheKey('products', page, limit, filters);
  const cached = apiCache.get<{ data: Product[]; total: number }>(cacheKey);
  
  if (cached) {
    console.log(`📦 [Products] Cache hit for page ${page}`);
    return cached;
  }

  console.log(`🌐 [Products] Fetching page ${page}, limit ${limit}`);
  
  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', filters?.isActive ?? true)
      .order('created_at', { ascending: false });

    // Appliquer les filtres
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('[Products] Supabase error:', error);
      throw error;
    }

    const result = {
      data: data || [],
      total: count || 0
    };

    // Mettre en cache le résultat
    apiCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('[Products] Fetch error:', error);
    throw error;
  }
};

// API optimisée pour les loteries avec pagination
export const fetchLotteriesPaginated = async (
  page: number = 1, 
  limit: number = DEFAULT_PAGE_SIZE,
  filters?: { isActive?: boolean | null; search?: string }
): Promise<{ data: Lottery[]; total: number }> => {
  const cacheKey = createCacheKey('lotteries', page, limit, filters);
  const cached = apiCache.get<{ data: Lottery[]; total: number }>(cacheKey);
  
  if (cached) {
    console.log(`📦 [Lotteries] Cache hit for page ${page}`);
    return cached;
  }

  console.log(`🌐 [Lotteries] Fetching page ${page}, limit ${limit}`);
  
  try {
    let query = supabase
      .from('lotteries')
      .select('*', { count: 'exact' })
      .order('draw_date', { ascending: false });

    // Appliquer les filtres
    if (filters?.isActive !== null && filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('[Lotteries] Supabase error:', error);
      throw error;
    }

    const result = {
      data: data || [],
      total: count || 0
    };

    // Mettre en cache le résultat
    apiCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('[Lotteries] Fetch error:', error);
    throw error;
  }
};

// Fonction pour vider le cache (utile après des mises à jour)
export const clearApiCache = () => {
  apiCache.clear();
  console.log('🗑️ API Cache cleared');
};

// Hook pour récupérer les produits en vedette (pour l'accueil)
export const fetchFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  const cacheKey = `featured_products_${limit}`;
  const cached = apiCache.get<Product[]>(cacheKey);
  
  if (cached) {
    console.log(`📦 [Featured Products] Cache hit`);
    return cached;
  }

  console.log(`🌐 [Featured Products] Fetching ${limit} items`);
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Featured Products] Supabase error:', error);
      throw error;
    }

    const result = data || [];
    apiCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('[Featured Products] Fetch error:', error);
    throw error;
  }
};

// Hook pour récupérer les loteries en vedette
export const fetchFeaturedLotteries = async (): Promise<Lottery[]> => {
  const cacheKey = 'featured_lotteries';
  const cached = apiCache.get<Lottery[]>(cacheKey);
  
  if (cached) {
    console.log(`📦 [Featured Lotteries] Cache hit`);
    return cached;
  }

  console.log(`🌐 [Featured Lotteries] Fetching featured lotteries`);
  
  try {
    const { data, error } = await supabase
      .from('lotteries')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('draw_date', { ascending: true });

    if (error) {
      console.error('[Featured Lotteries] Supabase error:', error);
      throw error;
    }

    const result = data || [];
    apiCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('[Featured Lotteries] Fetch error:', error);
    throw error;
  }
};
