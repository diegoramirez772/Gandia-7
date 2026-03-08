import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase no está configurado correctamente.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession:    true,
    autoRefreshToken:  true,
    detectSessionInUrl: true,
    storageKey: 'gandia-auth-token', // ← Clave fija. Sin esto, Supabase genera
                                     //   la key dinámicamente con el projectRef
                                     //   y a veces falla al localizarla al refrescar.
    storage: window.localStorage,    // ← Forzar localStorage explícitamente.
  },
})

console.log('[SUPABASE] Cliente inicializado')