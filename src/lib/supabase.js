import { createClient } from '@supabase/supabase-js';

// Use placeholders that are valid URLs but won't work without actual config
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Only create the client if we have a seemingly valid URL to avoid crashing the whole app
let supabase;

try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
    console.warn('Supabase initialization failed. Using mock client.', e.message);
    supabase = {
        from: () => ({
            select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
            insert: () => ({ select: () => Promise.resolve({ data: [{}], error: null }) }),
        })
    };
}

export { supabase };
