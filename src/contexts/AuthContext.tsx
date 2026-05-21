import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { isMockAuthEnabled } from '@/lib/authMode'
import {
  clearStoredMockSession,
  restoreMockAuth,
  signInMock,
} from '@/lib/mockAuth'
import { supabase } from '@/lib/supabase'

/** Display name: user_metadata first_name (+ last_name), else email prefix */
export function getDisplayName(user: User | null): string {
  if (!user) return ''
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const first = typeof meta?.first_name === 'string' ? meta.first_name.trim() : ''
  const last = typeof meta?.last_name === 'string' ? (meta.last_name as string).trim() : ''
  const name = [first, last].filter(Boolean).join(' ')
  if (name) return name
  const prefix = user.email?.split('@')[0]
  return prefix ?? ''
}

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  /** Display name from sign-up (first/last) or email prefix */
  displayName: string
  signUp: (
    params: { email: string; password: string },
    options?: { data?: Record<string, unknown> }
  ) => Promise<{ error: Error | null }>
  signInWithPassword: (params: {
    email: string
    password: string
  }) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isMockAuthEnabled()) {
      const restored = restoreMockAuth()
      if (restored) {
        setSession(restored.session)
        setUser(restored.user)
      }
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = useCallback(
    async (
      params: { email: string; password: string },
      options?: { data?: Record<string, unknown> }
    ) => {
      if (isMockAuthEnabled()) {
        const { user, session } = signInMock(params.email, options?.data)
        setUser(user)
        setSession(session)
        return { error: null }
      }
      const { error } = await supabase.auth.signUp({
        ...params,
        options: options ? { data: options.data } : undefined,
      })
      return { error: error ?? null }
    },
    []
  )

  const signInWithPassword = useCallback(
    async (params: { email: string; password: string }) => {
      if (isMockAuthEnabled()) {
        const { user, session } = signInMock(params.email)
        setUser(user)
        setSession(session)
        return { error: null }
      }
      const { error } = await supabase.auth.signInWithPassword(params)
      return { error: error ?? null }
    },
    []
  )

  const signOut = useCallback(async () => {
    if (isMockAuthEnabled()) {
      clearStoredMockSession()
      setUser(null)
      setSession(null)
      return
    }
    await supabase.auth.signOut()
  }, [])

  const resetPasswordForEmail = useCallback(async (email: string) => {
    if (isMockAuthEnabled()) {
      void email
      return { error: null }
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    return { error: error ?? null }
  }, [])

  const displayName = getDisplayName(user)

  const value: AuthContextValue = {
    user,
    session,
    loading,
    displayName,
    signUp,
    signInWithPassword,
    signOut,
    resetPasswordForEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx == null) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
