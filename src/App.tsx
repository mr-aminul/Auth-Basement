import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthenticatedLayout } from '@/layout'
import Login from '@/pages/Login'
import SignUp from '@/pages/SignUp'
import ForgotPassword from '@/pages/ForgotPassword'
import Dashboard from '@/pages/Dashboard'
import Reports from '@/pages/Reports'
import Documents from '@/pages/Documents'
import DocumentSubPage from '@/pages/DocumentSubPage'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Loading…
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignUp />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/" replace /> : <ForgotPassword />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="documents" element={<Outlet />}>
            <Route index element={<Documents />} />
            <Route path="page-1" element={<DocumentSubPage title="Page 1" />} />
            <Route path="page-2" element={<DocumentSubPage title="Page 2" />} />
            <Route path="page-3" element={<DocumentSubPage title="Page 3" />} />
            <Route path="financial-freedom" element={<Navigate to="/documents/page-1" replace />} />
            <Route path="life-planning" element={<Navigate to="/documents/page-2" replace />} />
            <Route path="journal" element={<Navigate to="/documents/page-3" replace />} />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
