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
import { BRAND } from '../config/brand';

function NavItem({ item, collapsed, badgeCounts, expanded }) {
  const badge = item.badgeKey ? badgeCounts?.[item.badgeKey] : 0;

  return (
    <NavLink
      to={item.path}
      end={!!item.path.match(/\/(advertiser|creator|admin)$/)}
      title={collapsed ? item.label : undefined}
      className="block w-full relative"
    >
      {({ isActive: active }) => (
        <span
          className="relative w-full flex items-center transition-colors"
          style={{
            gap: 12,
            padding: '9px 11px',
            borderRadius: 9,
            fontSize: '13.5px',
            fontWeight: active ? 700 : 500,
            background: active ? 'var(--accent-soft)' : 'transparent',
            color: active ? 'var(--accent-text)' : 'var(--text-2)',
          }}
        >
          <Icon name={item.icon} size={21} filled={active} style={{ flex: 'none' }} />
          {expanded && (
            <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
          )}
          {expanded && badge > 0 && (
            <span
              className="font-mono flex items-center justify-center"
              style={{
                minWidth: 20,
                height: 20,
                padding: '0 6px',
                borderRadius: 10,
                background: 'var(--accent)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {badge}
            </span>
          )}
          {!expanded && badge > 0 && (
            <span
              className="absolute"
              style={{
                top: 7,
                left: 27,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 0 2px var(--sidebar)',
              }}
            />
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
  const { collapsed, toggle } = useSidebar();
  const expanded = !collapsed;
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
  const profileSub = user?.role === 'ADMIN' ? `${user.adminRole} admin` : user?.email;
  const avatar = getAvatarStyle(user?.email, getInitials(profileName));

  const handleLogout = async () => {
    await logout();
    navigate(role === 'ADMIN' ? '/admin/login' : '/auth/login');
  };

  const sidebarWidth = collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)';

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--bg)', fontFamily: 'var(--sans)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-none h-full overflow-hidden transition-all duration-[180ms] ease-out"
        style={{
          width: sidebarWidth,
          background: 'var(--sidebar)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-[11px] flex-none" style={{ height: 64, padding: '0 18px' }}>
          <BrandMark size={30} />
          {expanded && (
            <div className="font-extrabold whitespace-nowrap" style={{ fontSize: '15.5px', letterSpacing: '-0.02em' }}>
              {BRAND.name}
            </div>
          )}
        </div>

        {/* Primary action */}
        {nav.primaryAction && (
          <div className="flex-none" style={{ padding: '2px 12px 10px' }}>
            <button
              type="button"
              className="btn-primary-full"
              onClick={() => navigate(nav.primaryAction.path)}
              title={nav.primaryAction.label}
            >
              <Icon name={nav.primaryAction.icon} size={20} />
              {expanded && nav.primaryAction.label}
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col" style={{ padding: '4px 12px 8px', gap: 2 }}>
          {expanded && (
            <div
              className="uppercase font-bold"
              style={{ fontSize: '10.5px', letterSpacing: '0.09em', color: 'var(--text-3)', padding: '10px 10px 5px' }}
            >
              Primary
            </div>
          )}
          {(nav.primary || []).map((item) => (
            <NavItem key={item.key} item={item} collapsed={collapsed} badgeCounts={badgeCounts} expanded={expanded} />
          ))}

          <div style={{ height: 1, background: 'var(--border)', margin: '11px 6px' }} />

          {expanded && (
            <div
              className="uppercase font-bold"
              style={{ fontSize: '10.5px', letterSpacing: '0.09em', color: 'var(--text-3)', padding: '10px 10px 5px' }}
            >
              Utility
            </div>
          )}
          {(nav.utility || []).map((item) => (
            <NavItem key={item.key} item={item} collapsed={collapsed} badgeCounts={badgeCounts} expanded={expanded} />
          ))}
        </nav>

        {/* Profile cluster */}
        <div
          className="flex items-center flex-none cursor-pointer"
          style={{ borderTop: '1px solid var(--border)', padding: '11px 14px', gap: 10 }}
          onClick={handleLogout}
          title="Sign out"
        >
          <div style={avatar.style}>{avatar.initials}</div>
          {expanded && (
            <>
              <div className="flex-1 min-w-0" style={{ lineHeight: 1.25 }}>
                <div className="font-bold truncate" style={{ fontSize: 13 }}>{profileName}</div>
                <div className="truncate" style={{ fontSize: '11.5px', color: 'var(--text-3)' }}>{profileSub}</div>
              </div>
              <Icon name="unfold_more" size={19} style={{ color: 'var(--text-3)' }} />
            </>
          )}
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {banner}
        <header
          className="flex items-center flex-none z-[5]"
          style={{
            height: 64,
            gap: 14,
            padding: '0 22px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <button
            type="button"
            onClick={toggle}
            title="Collapse sidebar"
            className="flex items-center justify-center flex-none transition-colors"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-2)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Icon name={collapsed ? 'menu' : 'menu_open'} size={22} />
          </button>

          <div className="flex items-center min-w-0" style={{ gap: 7 }}>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center" style={{ gap: 7 }}>
                {i > 0 && <Icon name="chevron_right" size={17} style={{ color: 'var(--text-3)' }} />}
                {b.path ? (
                  <Link to={b.path} className="text-sm hover:text-[var(--accent-text)]" style={{ color: i === breadcrumbs.length - 1 ? 'var(--text)' : 'var(--text-3)', fontWeight: i === breadcrumbs.length - 1 ? 600 : 400 }}>
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-sm" style={{ color: 'var(--text)', fontWeight: 600 }}>{b.label}</span>
                )}
              </span>
            ))}
          </div>

          <div className="flex-1" />

          <div className="search-bar hidden md:flex">
            <Icon name="search" size={19} />
            <span>Search…</span>
          </div>

          <NotificationsPanel />

          {(role === 'ADVERTISER' || role === 'CREATOR' || role === 'ADMIN') && (
            <div style={roleChip.style}>
              <Icon name={roleChip.icon} size={18} style={{ color: roleChip.iconColor }} />
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {roleChip.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)' }}>{roleChip.value}</div>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto cc-animate-fade" style={{ padding: '26px 30px 72px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
