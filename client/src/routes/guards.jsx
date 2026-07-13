import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getPostLoginPath } from '../utils/authRedirect';

function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div
        className="animate-spin rounded-full"
        style={{
          width: 32,
          height: 32,
          border: '4px solid var(--border)',
          borderTopColor: 'var(--accent)',
        }}
      />
    </div>
  );
}

export function ProtectedRoute({ roles, requireOnboarding = true }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoading />;

  if (!user) {
    const isAdmin = roles?.includes('ADMIN');
    return <Navigate to={isAdmin ? '/admin/login' : '/auth/login'} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={getPostLoginPath(user)} replace />;
  }

  if (requireOnboarding && !user.onboardingDone && user.role !== 'ADMIN') {
    const onboardingPath = user.role === 'ADVERTISER' ? '/advertiser/onboarding' : '/creator/onboarding';
    if (!location.pathname.startsWith(onboardingPath)) {
      return <Navigate to={onboardingPath} replace />;
    }
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoading />;

  if (user) {
    return <Navigate to={getPostLoginPath(user)} replace />;
  }

  return <Outlet />;
}

export function AdminGuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoading />;

  if (user) {
    return <Navigate to={getPostLoginPath(user)} replace />;
  }

  return <Outlet />;
}
