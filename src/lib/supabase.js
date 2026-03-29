import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have valid Supabase configuration
const isConfigured = supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key';

let supabase;

if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Supabase initialization failed:', e.message);
    supabase = createMockClient();
  }
} else {
  console.info('Supabase not configured. Using mock client for local development.');
  supabase = createMockClient();
}

// Mock client for development without Supabase
function createMockClient() {
  // Simple in-memory user store for development
  let mockUser = null;
  const mockAuthListeners = new Set();

  return {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: (rows) => ({
        select: () => Promise.resolve({
          data: rows.map((r, i) => ({ ...r, id: Date.now() + i })),
          error: null
        }),
      }),
      update: (data) => ({
        eq: () => Promise.resolve({ data: [data], error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({
        data: { session: mockUser ? { user: mockUser } : null },
        error: null
      }),
      signInWithPassword: async ({ email, password }) => {
        // For development: accept any email with password "dev123"
        if (password === 'dev123') {
          mockUser = {
            id: 'mock-user-id',
            email,
            created_at: new Date().toISOString()
          };
          // Notify listeners
          mockAuthListeners.forEach(cb => cb('SIGNED_IN', { user: mockUser }));
          return { data: { user: mockUser, session: { user: mockUser } }, error: null };
        }
        return {
          data: null,
          error: { message: 'Invalid credentials. Use password "dev123" for local development.' }
        };
      },
      signInWithOtp: async ({ email }) => {
        // For development: simulate magic link by auto-signing in
        mockUser = {
          id: 'mock-user-id',
          email,
          created_at: new Date().toISOString()
        };
        // Notify listeners after a short delay to simulate email
        setTimeout(() => {
          mockAuthListeners.forEach(cb => cb('SIGNED_IN', { user: mockUser }));
        }, 1000);
        return { data: { user: null }, error: null };
      },
      signOut: async () => {
        mockUser = null;
        mockAuthListeners.forEach(cb => cb('SIGNED_OUT', { user: null }));
        return { error: null };
      },
      onAuthStateChange: (callback) => {
        mockAuthListeners.add(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => mockAuthListeners.delete(callback)
            }
          }
        };
      },
    },
    storage: {
      from: () => ({
        upload: (path) => Promise.resolve({ data: { path }, error: null }),
        getPublicUrl: (path) => ({ data: { publicUrl: `/mock-storage/${path}` } }),
      }),
    },
  };
}

export { supabase, isConfigured };
