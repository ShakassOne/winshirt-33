
// Configuration Supabase optimisée pour la production
export const SUPABASE_URL = 'https://gyprtpqgeukcoxbfxtfg.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cHJ0cHFnZXVrY294YmZ4dGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NzY1MDQsImV4cCI6MjA2MjM1MjUwNH0.sm-yWpvwGPvEFHdKomFsE-YKF0BHzry2W4Gma2hpY_4';

// Fonction pour obtenir l'URL de base
export const getBaseURL = () => {
  // En développement
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return window.location.origin;
  }
  
  // En production
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'winshirt.fr' || hostname === 'www.winshirt.fr') {
      return 'https://winshirt.fr';
    }
  }
  
  // Fallback
  return 'https://winshirt.fr';
};
