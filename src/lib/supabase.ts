import { createClient } from '@supabase/supabase-js';

// These will be replaced with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Debug logging
console.log('🔧 Supabase Configuration:');
console.log('URL:', supabaseUrl);
console.log('Key available:', supabaseAnonKey ? 'Yes' : 'No');
console.log('Environment:', import.meta.env.MODE);

// Check if we have real Supabase credentials
const hasValidCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';

console.log('✅ Supabase available:', hasValidCredentials);

export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database table names
export const TABLES = {
  USERS: 'users',
  PROJECTS: 'projects',
  APPLICATIONS: 'applications',
  MATERIALS: 'materials',
  PROJECT_MATERIALS: 'project_materials',
  PROJECT_ASSIGNMENTS: 'project_assignments',
} as const;

// Helper to check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabase !== null && hasValidCredentials;
}; 