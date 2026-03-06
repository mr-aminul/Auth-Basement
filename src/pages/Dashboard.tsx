import { useAuth } from '@/contexts/AuthContext'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { displayName } = useAuth()
  const name = displayName || 'there'

  return (
    <div style={styles.wrapper}>
      <p style={styles.greeting}>
        {getGreeting()}, <strong>{name}</strong>
      </p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    maxWidth: '35rem',
  },
  greeting: {
    margin: 0,
    fontSize: '1.125rem',
    color: '#4B5563',
  },
}
