
// Supabase configuration
export const SUPABASE_URL = 'https://gyprtpqgeukcoxbfxtfg.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cHJ0cHFnZXVrY294YmZ4dGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NzY1MDQsImV4cCI6MjA2MjM1MjUwNH0.sm-yWpvwGPvEFHdKomFsE-YKF0BHzry2W4Gma2hpY_4';

// Configuration pour l'optimisation des performances
export const SUPABASE_OPTIONS = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    // Désactiver les mises à jour en temps réel si non utilisées
    enabled: false
  },
  global: {
    // Configuration des timeouts
    headers: {
      'X-Client-Info': 'supabase-js/2.x'
    }
  }
};
