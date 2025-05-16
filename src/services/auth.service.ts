
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/supabase.types";

export const signUpUser = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error in signUpUser:", error);
    throw error;
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error in signInUser:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
  } catch (error) {
    console.error("Error in signOutUser:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (!session) {
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // Profile not found (no rows returned)
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>
) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};
