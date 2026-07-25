import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    !supabaseUrl.includes('placeholder')
  );
};

if (!isSupabaseConfigured()) {
  console.info(
    'Supabase notice: Running in offline mode (using localStorage fallback). To connect live Supabase database, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export async function uploadAvatarToSupabase(file, fileNamePrefix = 'avatar') {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
    const filePath = `${fileNamePrefix}_${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });
    if (error) {
      console.warn('Supabase bucket upload error:', error.message);
      return null;
    }
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Supabase storage exception:', err);
    return null;
  }
}
