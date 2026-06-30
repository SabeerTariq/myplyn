const ADMIN_PERMISSIONS = {
  SUPER: ['*'],
  MODERATOR: [
    'dashboard.read',
    'users.read', 'users.write',
    'campaigns.read', 'campaigns.write',
    'review.read', 'review.write',
    'settings.read',
  ],
  FINANCE: [
    'dashboard.read',
    'finance.read', 'finance.write',
    'reports.read', 'reports.export',
  ],
};

export function getAdminPermissions(adminRole) {
  return ADMIN_PERMISSIONS[adminRole] || [];
}

export function hasPermission(user, permission) {
  if (user.role !== 'ADMIN') return false;
  const perms = getAdminPermissions(user.adminRole);
  return perms.includes('*') || perms.includes(permission);
}

export function requirePermission(...permissions) {
  return (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    const allowed = permissions.some((p) => hasPermission(req.user, p));
    if (!allowed) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
}

export const ADMIN_NAV_PERMISSIONS = {
  dashboard: 'dashboard.read',
  users: 'users.read',
  campaigns: 'campaigns.read',
  review: 'review.read',
  finance: 'finance.read',
  reports: 'reports.read',
  settings: 'settings.read',
};

export function filterAdminNav(user, navItems) {
  if (user.adminRole === 'SUPER') return navItems;
  return navItems.filter((item) => {
    const perm = ADMIN_NAV_PERMISSIONS[item.key];
    return perm && hasPermission(user, perm);
  });
}
