import type { Session, User } from '@supabase/supabase-js'

export const MOCK_TEST_EMAIL = 'test@example.com'
export const MOCK_TEST_PASSWORD = 'testpassword123'

const STORAGE_KEY = 'auth-basement-mock-session'

type StoredMockSession = {
  email: string
  userMetadata?: Record<string, unknown>
}

export function createMockUser(
  email: string,
  userMetadata: Record<string, unknown> = {}
): User {
  const now = new Date().toISOString()
  return {
    id: 'mock-user-id',
    aud: 'authenticated',
    role: 'authenticated',
    email,
    email_confirmed_at: now,
    phone: '',
    confirmed_at: now,
    last_sign_in_at: now,
    app_metadata: { provider: 'mock' },
    user_metadata: userMetadata,
    identities: [],
    created_at: now,
    updated_at: now,
    is_anonymous: false,
  } as User
}

export function createMockSession(user: User): Session {
  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24
  return {
    access_token: 'mock-access-token',
    token_type: 'bearer',
    expires_in: 60 * 60 * 24,
    expires_at: expiresAt,
    refresh_token: 'mock-refresh-token',
    user,
  } as Session
}

export function readStoredMockSession(): StoredMockSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredMockSession
    if (typeof parsed.email !== 'string' || !parsed.email) return null
    return parsed
  } catch {
    return null
  }
}

export function persistMockSession(email: string, userMetadata?: Record<string, unknown>) {
  const stored: StoredMockSession = { email, userMetadata }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
}

export function clearStoredMockSession() {
  localStorage.removeItem(STORAGE_KEY)
}

export function restoreMockAuth(): { user: User; session: Session } | null {
  const stored = readStoredMockSession()
  if (!stored) return null
  const user = createMockUser(stored.email, stored.userMetadata ?? {})
  return { user, session: createMockSession(user) }
}

export function signInMock(
  email: string,
  userMetadata?: Record<string, unknown>
): { user: User; session: Session } {
  const user = createMockUser(email, userMetadata ?? {})
  persistMockSession(email, userMetadata)
  return { user, session: createMockSession(user) }
}
