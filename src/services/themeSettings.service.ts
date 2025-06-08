
import { supabase } from '@/integrations/supabase/client';

export interface ThemeSettings {
  id?: string;
  primary_color: string;
  accent_color: string;
  background_image?: string;
  star_density: number;
  border_radius: number;
  glassmorphism_intensity: number;
  button_style: string;
}

export const fetchThemeSettings = async (): Promise<ThemeSettings | null> => {
  console.log('Fetching theme settings...');
  try {
    const { data, error } = await supabase
      .from('theme_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching theme settings:', error);
      throw error;
    }

    console.log('Theme settings fetched:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch theme settings:', error);
    return null;
  }
};

export const saveThemeSettings = async (settings: Partial<ThemeSettings>): Promise<ThemeSettings> => {
  console.log('Saving theme settings:', settings);
  try {
    // First, try to get existing settings
    const existing = await fetchThemeSettings();
    
    if (existing?.id) {
      // Update existing settings
      const { data, error } = await supabase
        .from('theme_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating theme settings:', error);
        throw error;
      }

      console.log('Theme settings updated:', data);
      return data;
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('theme_settings')
        .insert([settings])
        .select()
        .single();

      if (error) {
        console.error('Error creating theme settings:', error);
        throw error;
      }

      console.log('Theme settings created:', data);
      return data;
    }
  } catch (error) {
    console.error('Failed to save theme settings:', error);
    throw error;
  }
};

export const applyThemeSettings = (settings: ThemeSettings) => {
  console.log('Applying theme settings:', settings);
  
  // Apply CSS custom properties
  const root = document.documentElement;
  
  // Update CSS variables for colors
  root.style.setProperty('--primary', settings.primary_color);
  root.style.setProperty('--accent', settings.accent_color);
  
  // Apply background image
  if (settings.background_image) {
    document.body.style.backgroundImage = `url(${settings.background_image})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  } else {
    document.body.style.backgroundImage = '';
  }
  
  // Apply border radius
  root.style.setProperty('--radius', `${settings.border_radius}px`);
  
  console.log('Theme settings applied successfully');
};
