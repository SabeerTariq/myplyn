export const advertiserNav = {
  primaryAction: { label: 'New Campaign', path: '/advertiser/campaigns/new', icon: 'add' },
  primary: [
    { key: 'dashboard', label: 'Dashboard', path: '/advertiser', icon: 'dashboard' },
    { key: 'campaigns', label: 'Campaigns', path: '/advertiser/campaigns', icon: 'campaign' },
    { key: 'marketplace', label: 'Creator Marketplace', path: '/advertiser/marketplace', icon: 'storefront' },
    { key: 'proposals', label: 'Proposals', path: '/advertiser/proposals', icon: 'description', badgeKey: 'applications' },
    { key: 'collaborations', label: 'Collaborations', path: '/advertiser/collaborations', icon: 'handshake', badgeKey: 'proofsToVerify' },
    { key: 'wallet', label: 'Wallet & Payments', path: '/advertiser/wallet', icon: 'account_balance_wallet' },
    { key: 'messages', label: 'Messages', path: '/advertiser/messages', icon: 'forum', badgeKey: 'messages' },
    { key: 'settings', label: 'Settings', path: '/advertiser/settings', icon: 'settings' },
  ],
  utility: [
    { key: 'help', label: 'Help & Support', path: '/advertiser/help', icon: 'help' },
  ],
};

export const creatorNav = {
  primaryAction: { label: 'List a Page', path: '/creator/pages/new', icon: 'add' },
  primary: [
    { key: 'dashboard', label: 'Dashboard', path: '/creator', icon: 'dashboard' },
    { key: 'pages', label: 'My Pages', path: '/creator/pages', icon: 'web' },
    { key: 'marketplace', label: 'Marketplace', path: '/creator/marketplace', icon: 'storefront' },
    { key: 'applications', label: 'Proposals', path: '/creator/proposals', icon: 'description' },
    { key: 'invitations', label: 'Invitations', path: '/creator/invitations', icon: 'mail', badgeKey: 'invitations' },
    { key: 'earnings', label: 'Earnings', path: '/creator/earnings', icon: 'payments' },
    { key: 'messages', label: 'Messages', path: '/creator/messages', icon: 'forum', badgeKey: 'messages' },
    { key: 'analytics', label: 'Collaborations', path: '/creator/collaborations', icon: 'monitoring', badgeKey: 'collaborations' },
    { key: 'settings', label: 'Settings', path: '/creator/settings', icon: 'settings' },
  ],
  utility: [
    { key: 'help', label: 'Help & Support', path: '/creator/help', icon: 'help' },
  ],
};

export const adminNav = {
  primary: [
    { key: 'dashboard', label: 'Dashboard', path: '/admin', icon: 'dashboard', permission: 'dashboard.read' },
    { key: 'users', label: 'Users', path: '/admin/users', icon: 'group', permission: 'users.read' },
    { key: 'campaigns', label: 'Campaigns', path: '/admin/campaigns', icon: 'campaign', permission: 'campaigns.read' },
    { key: 'review', label: 'Review Queue', path: '/admin/review', icon: 'gavel', badgeKey: 'reviewQueue', permission: 'review.read' },
    { key: 'messages', label: 'Messages', path: '/admin/messages', icon: 'forum', badgeKey: 'messages', permission: 'dashboard.read' },
    { key: 'finance', label: 'Finance', path: '/admin/finance', icon: 'account_balance', permission: 'finance.read' },
    { key: 'reports', label: 'Reports', path: '/admin/reports', icon: 'monitoring', permission: 'reports.read' },
  ],
  utility: [
    { key: 'settings', label: 'Settings', path: '/admin/settings', icon: 'settings', permission: 'settings.read' },
    { key: 'help', label: 'Help & Support', path: '/admin/settings', icon: 'help', permission: 'settings.read' },
  ],
};

const ADMIN_PERMISSIONS = {
  SUPER: ['*'],
  MODERATOR: ['dashboard.read', 'users.read', 'users.write', 'campaigns.read', 'campaigns.write', 'review.read', 'review.write', 'settings.read'],
  FINANCE: ['dashboard.read', 'finance.read', 'finance.write', 'reports.read', 'reports.export'],
};

export const COLLAB_STATUS_LABELS = {
  REQUESTED: { label: 'Requested' },
  APPLICATION_PENDING: { label: 'Application pending' },
  ACCEPTED: { label: 'Accepted' },
  CONTENT_PROVIDED: { label: 'Content provided' },
  PUBLISHED: { label: 'Published' },
  PROOF_SUBMITTED: { label: 'Proof submitted' },
  IN_REVIEW: { label: 'In review' },
  VERIFIED: { label: 'Verified' },
  RELEASED: { label: 'Released' },
  PAID_OUT: { label: 'Paid out' },
};

export function filterAdminNav(adminRole) {
  const perms = ADMIN_PERMISSIONS[adminRole] || [];
  const has = (p) => perms.includes('*') || perms.includes(p);
  const filter = (items) => items.filter((i) => !i.permission || has(i.permission));
  return {
    primary: filter(adminNav.primary),
    utility: filter(adminNav.utility),
  };
}

export function getRoleChip(role, wallet) {
  const base = {
    display: 'flex',
    alignItems: 'center',
    gap: 9,
    height: 38,
    padding: '0 14px',
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
  };
  if (role === 'ADVERTISER') {
    return {
      style: base,
      icon: 'lock',
      iconColor: 'var(--warn)',
      label: 'In holding',
      value: `$${Number(wallet?.heldBalance || 0).toLocaleString()}`,
    };
  }
  if (role === 'CREATOR') {
    return {
      style: base,
      icon: 'account_balance_wallet',
      iconColor: 'var(--ok)',
      label: 'Available',
      value: `$${Number(wallet?.balance || 0).toLocaleString()}`,
    };
  }
  return {
    style: base,
    icon: 'admin_panel_settings',
    iconColor: 'var(--info)',
    label: 'Environment',
    value: 'Production',
  };
}
