import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const { user, signOut } = useAuth()

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.text}>
          Signed in as <strong>{user?.email}</strong>.
        </p>
        <p style={styles.text}>
          This is a protected page. Replace or extend it with your app content.
        </p>
        <button type="button" onClick={() => signOut()} style={styles.button}>
          Sign out
        </button>
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
    maxWidth: 420,
    padding: '1.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    background: '#fff',
  },
  title: {
    margin: '0 0 1rem',
    fontSize: '1.5rem',
    fontWeight: 600,
  },
  text: {
    margin: '0 0 0.75rem',
    fontSize: '0.9375rem',
    color: '#444',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.6rem 1rem',
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
  },
  link: {
    color: '#333',
    textDecoration: 'underline',
  },
}
