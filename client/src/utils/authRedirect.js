export function getPostLoginPath(user) {
  if (!user) return '/auth/login';
  if (user.role === 'ADMIN') return '/admin';
  if (!user.onboardingDone) {
    return user.role === 'ADVERTISER' ? '/advertiser/onboarding' : '/creator/onboarding';
  }
  return user.role === 'ADVERTISER' ? '/advertiser' : '/creator';
}

export function getLoginPath(role) {
  return role === 'ADMIN' ? '/admin/login' : '/auth/login';
}
