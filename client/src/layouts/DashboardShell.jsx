import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../hooks/useSidebar';
import { useBadgeCounts } from '../hooks/useBadgeCounts';
import { filterAdminNav, getRoleChip } from '../config/navigation';
import { getAvatarStyle, getInitials } from '../utils/avatar';
import { walletApi } from '../services/api';
import Icon from '../components/Icon';
import NotificationsPanel from '../components/NotificationsPanel';
import BrandMark from '../components/BrandMark';

function dashboardFirstName(user, role) {
  if (role === 'ADVERTISER') {
    const raw = user?.advertiserProfile?.companyName || user?.email?.split('@')[0] || 'there';
    return raw.split(/\s+/)[0];
  }
  if (role === 'ADMIN') {
    const raw = user?.email?.split('@')[0] || 'Admin';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  const raw = user?.email?.split('@')[0] || 'Creator';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function NavItem({ item, badgeCounts, expanded, onNavigate }) {
  const badge = item.badgeKey ? badgeCounts?.[item.badgeKey] : 0;

  return (
    <NavLink
      to={item.path}
      end={!!item.path.match(/\/(advertiser|creator|admin)$/)}
      title={expanded ? undefined : item.label}
      className="block w-full relative dashboard-nav-item"
      onClick={onNavigate}
    >
      {({ isActive: active }) => (
        <span
          className={`relative w-full flex items-center transition-colors dashboard-nav-link${active ? ' dashboard-nav-link--active' : ''}`}
        >
          <Icon name={item.icon} size={21} filled={active} style={{ flex: 'none' }} />
          {expanded && (
            <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
          )}
          {expanded && badge > 0 && (
            <span className="dashboard-nav-badge font-mono">
              {badge}
            </span>
          )}
          {!expanded && badge > 0 && (
            <span className="dashboard-nav-badge-dot" />
          )}
        </span>
      )}
    </NavLink>
  );
}

export default function DashboardShell({
  navConfig,
  role,
  breadcrumbs = [],
  children,
  banner,
}) {
  const { user, logout } = useAuth();
  const { collapsed, toggle, isDesktop, mobileOpen, closeMobile, expanded } = useSidebar();
  const { data: badgeCounts } = useBadgeCounts();
  const navigate = useNavigate();

  const nav = role === 'ADMIN' ? filterAdminNav(user?.adminRole) : navConfig;

  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletApi.get().then((r) => r.data.wallet),
    enabled: role === 'ADVERTISER' || role === 'CREATOR',
  });

  const roleChip = getRoleChip(role, walletData);
  const profileName = user?.advertiserProfile?.companyName || user?.email?.split('@')[0] || 'Account';
  const avatar = getAvatarStyle(user?.email, getInitials(profileName));
  const showWalletChip = role === 'ADVERTISER' || role === 'CREATOR';

  const handleLogout = async () => {
    closeMobile();
    await logout();
    navigate(role === 'ADMIN' ? '/admin/login' : '/auth/login');
  };

  const handleNavClick = () => {
    if (!isDesktop) closeMobile();
  };

  const sidebarClasses = [
    'dashboard-sidebar',
    'flex flex-col h-full overflow-hidden transition-all duration-[180ms] ease-out',
    !isDesktop ? 'dashboard-sidebar--drawer' : 'flex-none',
    !isDesktop && mobileOpen ? 'dashboard-sidebar--open' : '',
  ].filter(Boolean).join(' ');

  const sidebarWidth = isDesktop
    ? (collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)')
    : 'var(--sidebar-width)';

  const menuIcon = isDesktop ? (collapsed ? 'menu' : 'menu_open') : 'menu';
  const menuLabel = isDesktop ? 'Collapse sidebar' : 'Open menu';

  return (
    <div className="dashboard-shell flex h-[100dvh] w-full overflow-hidden" style={{ background: 'var(--bg)', fontFamily: 'var(--sans)' }}>
      {!isDesktop && mobileOpen && (
        <button
          type="button"
          className="dashboard-sidebar-backdrop"
          onClick={closeMobile}
          aria-label="Close menu"
        />
      )}

      <aside
        className={sidebarClasses}
        style={{
          width: sidebarWidth,
          background: 'var(--sidebar)',
          borderRight: isDesktop ? '1px solid var(--border)' : undefined,
        }}
        aria-hidden={!isDesktop && !mobileOpen}
      >
        <div className="dashboard-sidebar-head flex items-center flex-none">
          <Link to={role === 'ADMIN' ? '/admin' : `/${role.toLowerCase()}`} onClick={handleNavClick}>
            <BrandMark size={expanded ? 40 : 34} />
          </Link>
          {!isDesktop && (
            <button
              type="button"
              className="dashboard-icon-btn dashboard-sidebar-close"
              onClick={closeMobile}
              aria-label="Close menu"
            >
              <Icon name="close" size={22} />
            </button>
          )}
        </div>

        {nav.primaryAction && (
          <div className="flex-none dashboard-sidebar-primary">
            <button
              type="button"
              className="btn-primary-full"
              onClick={() => { navigate(nav.primaryAction.path); handleNavClick(); }}
              title={nav.primaryAction.label}
            >
              <Icon name={nav.primaryAction.icon} size={20} />
              {expanded && nav.primaryAction.label}
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col dashboard-sidebar-nav">
          {(nav.primary || []).map((item) => (
            <NavItem key={item.key} item={item} badgeCounts={badgeCounts} expanded={expanded} onNavigate={handleNavClick} />
          ))}

          <div className="flex-1" />

          {(nav.utility || []).map((item) => (
            <NavItem key={item.key} item={item} badgeCounts={badgeCounts} expanded={expanded} onNavigate={handleNavClick} />
          ))}

          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="block w-full dashboard-nav-item"
            style={{ marginTop: 4 }}
          >
            <span className="w-full flex items-center transition-colors dashboard-nav-link dashboard-nav-link--logout">
              <Icon name="logout" size={21} style={{ flex: 'none' }} />
              {expanded && <span>Log out</span>}
            </span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {banner}
        <header className="dashboard-topbar flex items-center flex-none z-[5]">
          <button
            type="button"
            onClick={toggle}
            title={menuLabel}
            aria-expanded={!isDesktop ? mobileOpen : !collapsed}
            aria-label={menuLabel}
            className="dashboard-icon-btn touch-target"
          >
            <Icon name={menuIcon} size={22} />
          </button>

          {nav.primaryAction && !isDesktop && (
            <button
              type="button"
              className="dashboard-header-fab hide-above-tablet"
              onClick={() => navigate(nav.primaryAction.path)}
              title={nav.primaryAction.label}
              aria-label={nav.primaryAction.label}
            >
              <Icon name={nav.primaryAction.icon} size={20} />
            </button>
          )}

          <div className="dashboard-header-greeting hide-mobile">
            Welcome back, {dashboardFirstName(user, role)}! 👋
          </div>

          <div className="flex-1 min-w-0" />

          <NotificationsPanel />

          {showWalletChip && (
            <div className="dashboard-wallet-chip" style={roleChip.style}>
              <Icon name={roleChip.icon} size={18} style={{ color: roleChip.iconColor, flex: 'none' }} />
              <div className="dashboard-wallet-chip__text" style={{ lineHeight: 1.15 }}>
                <div className="dashboard-wallet-chip__label hide-below-desktop">
                  {roleChip.label}
                </div>
                <div className="dashboard-wallet-chip__value">{roleChip.value}</div>
              </div>
            </div>
          )}

          {role === 'ADMIN' && (
            <div className="dashboard-wallet-chip" style={roleChip.style}>
              <Icon name={roleChip.icon} size={18} style={{ color: roleChip.iconColor, flex: 'none' }} />
              <div className="dashboard-wallet-chip__text" style={{ lineHeight: 1.15 }}>
                <div className="dashboard-wallet-chip__label hide-below-desktop">
                  {roleChip.label}
                </div>
                <div className="dashboard-wallet-chip__value">{roleChip.value}</div>
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn-ghost dashboard-pill-btn hide-below-desktop"
            onClick={handleLogout}
            title="Log out"
          >
            <Icon name="logout" size={18} />
            Log out
          </button>

          <button
            type="button"
            className="dashboard-header-avatar touch-target"
            onClick={() => navigate(role === 'ADMIN' ? '/admin' : `/${role.toLowerCase()}`)}
            title={profileName}
            style={avatar.style}
          >
            {avatar.initials}
          </button>
        </header>

        <main className="dashboard-main flex-1 overflow-y-auto cc-animate-fade">
          {breadcrumbs.length > 0 && (
            <div className="dashboard-breadcrumbs">
              {breadcrumbs.map((b, i) => (
                <span key={i} className="flex items-center" style={{ gap: 7 }}>
                  {i > 0 && <Icon name="chevron_right" size={17} style={{ color: 'var(--text-3)' }} />}
                  {b.path ? (
                    <Link to={b.path}>{b.label}</Link>
                  ) : (
                    <span>{b.label}</span>
                  )}
                </span>
              ))}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
