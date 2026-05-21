const PLACEHOLDER_URL = 'your-project-ref'
const PLACEHOLDER_KEY = 'your-anon-key'

export function isMockAuthEnabled(): boolean {
  const flag = import.meta.env.VITE_AUTH_MOCK
  if (flag === 'true') return true
  if (flag === 'false') return false

  if (!import.meta.env.DEV) return false

  const url = import.meta.env.VITE_SUPABASE_URL ?? ''
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''
  return (
    !url ||
    !key ||
    url.includes(PLACEHOLDER_URL) ||
    key === PLACEHOLDER_KEY
  )
}
