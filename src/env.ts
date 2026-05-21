import { isMockAuthEnabled } from '@/lib/authMode'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (import.meta.env.DEV && !isMockAuthEnabled() && (!url || !anonKey)) {
  throw new Error(
    'Missing Supabase env. Copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or set VITE_AUTH_MOCK=true for local testing.'
  )
}

export const env = {
  VITE_SUPABASE_URL: (url as string) || 'https://placeholder.supabase.co',
  VITE_SUPABASE_ANON_KEY: (anonKey as string) || 'placeholder-anon-key',
}

export { isMockAuthEnabled }
