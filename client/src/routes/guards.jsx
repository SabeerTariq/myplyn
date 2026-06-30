import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ roles, requireOnboarding = true }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!user) {
    const isAdmin = roles?.includes('ADMIN');
    return <Navigate to={isAdmin ? '/admin/login' : '/auth/login'} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const redirect = user.role === 'ADVERTISER' ? '/advertiser' : user.role === 'CREATOR' ? '/creator' : '/admin';
    return <Navigate to={redirect} replace />;
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
  if (loading) return null;
  if (user) {
    const redirect = user.role === 'ADVERTISER' ? '/advertiser' : user.role === 'CREATOR' ? '/creator' : '/admin';
    return <Navigate to={redirect} replace />;
  }
  return <Outlet />;
}
