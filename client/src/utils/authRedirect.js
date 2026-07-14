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

/** Advertiser-intent CTAs (Start a campaign / Start as a Business). */
export function getAdvertiserStartPath(user) {
  if (!user) return '/auth/signup/advertiser';
  if (user.role === 'ADVERTISER') {
    return user.onboardingDone ? '/advertiser/campaigns/new' : '/advertiser/onboarding';
  }
  // Logged-in creator (or other) — offer role choice instead of bouncing into creator onboarding
  return '/auth/signup';
}
