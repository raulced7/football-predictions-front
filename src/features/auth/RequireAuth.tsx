import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './useAuth';

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
}
