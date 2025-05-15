
// Add ThemeSetting type if it doesn't exist
export type ThemeSetting = {
  id: string;
  name: string;
  value: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};
