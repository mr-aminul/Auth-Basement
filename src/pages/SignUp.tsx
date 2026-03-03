import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { signUp } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setSubmitting(true)
    const { error: err } = await signUp({ email, password })
    setSubmitting(false)
    if (err) {
      setError(err.message)
      return
    }
    setMessage(
      'Account created. If your project has email confirmation enabled, check your inbox to confirm. Otherwise you can sign in now.'
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign up</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error} role="alert">
              {error}
            </div>
          )}
          {message && (
            <div style={styles.message} role="status">
              {message}
            </div>
          )}
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
              style={styles.input}
            />
          </label>
          <button type="submit" disabled={submitting} style={styles.button}>
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
        <p style={styles.footer}>
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    padding: '1.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    background: '#fff',
  },
  title: {
    margin: '0 0 1.25rem',
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  error: {
    padding: '0.5rem 0.75rem',
    background: '#fee',
    color: '#c00',
    borderRadius: 4,
    fontSize: '0.875rem',
  },
  message: {
    padding: '0.5rem 0.75rem',
    background: '#efe',
    color: '#060',
    borderRadius: 4,
    fontSize: '0.875rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  input: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #ccc',
    borderRadius: 4,
    fontSize: '1rem',
  },
  button: {
    padding: '0.6rem 1rem',
    marginTop: '0.25rem',
    background: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  footer: {
    margin: '1rem 0 0',
    fontSize: '0.875rem',
    color: '#666',
    textAlign: 'center',
  },
  link: {
    color: '#333',
    textDecoration: 'underline',
  },
}
