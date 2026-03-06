import { AppLayout } from './AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { layoutConfig, getPageTitle } from '@/config/layout'

/**
 * App shell layout with sidebar and top bar, wired to auth (user name in header).
 * Use as the element of the protected layout route.
 */
export default function AuthenticatedLayout() {
  const { user, signOut } = useAuth()
  const userName = user?.email?.split('@')[0]

  return (
    <AppLayout
      {...layoutConfig}
      getPageTitle={getPageTitle}
      userName={userName}
      profileLabel={userName}
      profileSubtext={user?.email}
      onSignOut={signOut}
    />
  )
}
