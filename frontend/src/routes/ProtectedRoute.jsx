import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from '../components/ui/Loader'


export default function ProtectedRoute({ role }) {
  const { isAuthenticated, isBootstrapping, user } = useAuth()
  const location = useLocation()

  if (isBootstrapping) return <PageLoader />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (role && user?.role !== role) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}


export function PublicOnlyRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) return <PageLoader />
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
