const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (import.meta.env.DEV && (!url || !anonKey)) {
  throw new Error(
    'Missing Supabase env. Copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

export const env = {
  VITE_SUPABASE_URL: url as string,
  VITE_SUPABASE_ANON_KEY: anonKey as string,
}
