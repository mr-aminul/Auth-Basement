import { useSettings } from '@/contexts/SettingsContext'

export default function Settings() {
  const { settings, setNotifications, setLanguage } = useSettings()

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.pageTitle}>Settings</h2>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Notifications</h3>
        <p style={styles.hint}>Show in-app notifications and updates.</p>
        <label style={styles.switchLabel}>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            style={styles.checkbox}
          />
          <span style={styles.switchText}>Enable in-app notifications</span>
        </label>
      </section>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Language</h3>
        <p style={styles.hint}>Preferred language for the interface.</p>
        <select
          value={settings.language}
          onChange={(e) => setLanguage(e.target.value)}
          style={styles.select}
          aria-label="Language"
        >
          <option value="en">English</option>
        </select>
      </section>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    padding: '0.25rem 0',
    maxWidth: '36rem',
  },
  pageTitle: {
    margin: '0 0 1.5rem',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#111827',
  },
  section: {
    marginBottom: '1.75rem',
    paddingBottom: '1.75rem',
    borderBottom: '1px solid #e5e7eb',
  },
  sectionTitle: {
    margin: '0 0 0.25rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#111827',
  },
  hint: {
    margin: '0 0 0.75rem',
    fontSize: '0.875rem',
    color: '#4b5563',
  },
  switchLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  checkbox: {
    width: '1.125rem',
    height: '1.125rem',
    accentColor: '#111827',
  },
  switchText: {
    fontSize: '0.9375rem',
    color: '#111827',
  },
  select: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.9375rem',
    color: '#111827',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    minWidth: '10rem',
  },
}
