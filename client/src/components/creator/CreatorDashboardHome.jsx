import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import Icon from '../Icon';
import EmptyState from '../EmptyState';
import { QuickActionCard } from './creatorUi';
import { buildPageRows, formatCount, formatMoney, profileStrength } from '../../utils/creatorMetrics';
import { pagesApi, collaborationsApi, marketplaceApi, walletApi } from '../../services/api';
import { COLLAB_STATUS_LABELS } from '../../config/navigation';
import '../../styles/creator-home.css';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function collabLabel(status) {
  return COLLAB_STATUS_LABELS[status]?.label || status?.replace(/_/g, ' ').toLowerCase();
}

export default function CreatorDashboardHome() {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] || 'Creator';

  const { data: pagesData } = useQuery({ queryKey: ['pages'], queryFn: () => pagesApi.list().then((r) => r.data) });
  const { data: collabsData } = useQuery({ queryKey: ['cre-collabs'], queryFn: () => collaborationsApi.list().then((r) => r.data) });
  const { data: marketplaceData } = useQuery({
    queryKey: ['marketplace', { view: 'best', limit: 3 }],
    queryFn: () => marketplaceApi.campaigns({ view: 'best', limit: 3 }).then((r) => r.data),
  });
  const { data: invitationsData } = useQuery({ queryKey: ['invitations'], queryFn: () => marketplaceApi.invitations().then((r) => r.data) });
  const { data: applicationsData } = useQuery({ queryKey: ['applications'], queryFn: () => marketplaceApi.applications().then((r) => r.data) });
  const { data: earnings } = useQuery({ queryKey: ['earnings'], queryFn: () => walletApi.earnings().then((r) => r.data) });
  const { data: wallet } = useQuery({ queryKey: ['wallet'], queryFn: () => walletApi.get().then((r) => r.data.wallet) });

  const pages = pagesData?.pages || [];
  const collabs = collabsData?.collaborations || [];
  const activeCollabs = collabs.filter((c) => !['PAID_OUT', 'CANCELLED'].includes(c.status));
  const pendingInvites = (invitationsData?.invitations || []).filter((i) => i.status === 'PENDING');
  const pendingApps = (applicationsData?.applications || []).filter((a) => a.status === 'PENDING');
  const recommended = marketplaceData?.campaigns || [];

  const rows = buildPageRows(pages, collabs, marketplaceData?.total || 0, invitationsData?.invitations || []);
  const totalEarnings = rows.reduce((sum, p) => sum + p.earnings, 0) || Number(earnings?.lifetime?.net || 0);
  const availableBalance = Number(wallet?.balance || 0);
  const strength = profileStrength(pages, user?.creatorProfile?.connectStatus);

  if (!pages.length) {
    return (
      <EmptyState
        title="Welcome to Myplyn"
        description="List your first social page to unlock the dashboard, marketplace matches, and brand collaborations."
        action={<Link to="/creator/pages/new" className="btn-primary dashboard-pill-btn">+ List your first page</Link>}
      />
    );
  }

  return (
    <div className="cr-home cc-animate-fade">
      <div className="cr-home-hero">
        <div>
          <div className="cr-home-greeting">{greeting()}</div>
          <h1 className="cr-home-title">Welcome back, {firstName}</h1>
          <p className="cr-home-sub">
            Here&apos;s an overview of your active work, earnings, and campaigns matched to your pages.
          </p>
        </div>
        <div className="dashboard-page-actions">
          <Link to="/creator/marketplace" className="btn-primary dashboard-pill-btn">Browse marketplace</Link>
        </div>
      </div>

      {(pendingInvites.length > 0 || user?.creatorProfile?.connectStatus !== 'CONNECTED') && (
        <div className="cr-alert-strip">
          <p>
            {pendingInvites.length > 0 && (
              <><strong>{pendingInvites.length} brand invitation{pendingInvites.length !== 1 ? 's' : ''}</strong> waiting for your response. </>
            )}
            {user?.creatorProfile?.connectStatus !== 'CONNECTED' && (
              <>Connect payouts to withdraw earnings.</>
            )}
          </p>
          <div className="dashboard-page-actions">
            {pendingInvites.length > 0 && (
              <Link to="/creator/invitations" className="btn-ghost dashboard-pill-btn">View invitations</Link>
            )}
            {user?.creatorProfile?.connectStatus !== 'CONNECTED' && (
              <Link to="/creator/earnings" className="btn-primary dashboard-pill-btn">Connect Stripe</Link>
            )}
          </div>
        </div>
      )}

      <div className="cr-stat-grid">
        <div className="cr-stat-card">
          <div className="cr-stat-card-top">
            <span className="cr-stat-label">Available balance</span>
            <Icon name="account_balance_wallet" size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="cr-stat-value">{formatMoney(availableBalance)}</div>
          <div className="cr-stat-meta">Ready to withdraw</div>
        </div>
        <div className="cr-stat-card">
          <div className="cr-stat-card-top">
            <span className="cr-stat-label">Lifetime earnings</span>
            <Icon name="payments" size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="cr-stat-value">{formatMoney(totalEarnings)}</div>
          <div className="cr-stat-meta">Across all pages</div>
        </div>
        <div className="cr-stat-card">
          <div className="cr-stat-card-top">
            <span className="cr-stat-label">Active work</span>
            <Icon name="handshake" size={18} style={{ color: 'var(--info)' }} />
          </div>
          <div className="cr-stat-value">{activeCollabs.length}</div>
          <div className="cr-stat-meta">{pendingApps.length} proposal{pendingApps.length !== 1 ? 's' : ''} pending</div>
        </div>
        <div className="cr-stat-card">
          <div className="cr-stat-card-top">
            <span className="cr-stat-label">Best matches</span>
            <Icon name="auto_awesome" size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="cr-stat-value">{marketplaceData?.total || 0}</div>
          <div className="cr-stat-meta">Campaigns for you</div>
        </div>
      </div>

      <div className="cr-home-grid">
        <div className="cr-panel">
          <div className="cr-panel-head">
            <h2>Active collaborations</h2>
            <Link to="/creator/collaborations" className="cr-panel-link">View all</Link>
          </div>
          <div className="cr-panel-body">
            {activeCollabs.length === 0 ? (
              <div className="cr-empty-panel">
                No active collaborations yet.{' '}
                <Link to="/creator/marketplace" style={{ color: 'var(--accent-text)', fontWeight: 700 }}>Find campaigns →</Link>
              </div>
            ) : (
              activeCollabs.slice(0, 5).map((c) => (
                <Link key={c.id} to={`/creator/collaborations/${c.id}`} className="cr-work-item">
                  <div className="cr-work-main">
                    <strong>{c.campaign?.name}</strong>
                    <span>{c.page?.name} · {c.campaign?.advertiser?.companyName || 'Brand'}</span>
                  </div>
                  <div className="cr-work-side">
                    <span className="cr-work-amount">{formatMoney(c.agreedAmount)}</span>
                    <span className="cr-work-status">{collabLabel(c.status)}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="cr-panel">
            <div className="cr-panel-head">
              <h2>Quick actions</h2>
            </div>
            <div className="cr-quick-stack">
              <QuickActionCard
                icon="storefront"
                title="Find campaigns"
                desc="Browse marketplace and submit proposals"
                to="/creator/marketplace"
                accent
              />
              <QuickActionCard
                icon="add_circle"
                title="List a new page"
                desc="Add another social profile to your portfolio"
                to="/creator/pages/new"
              />
              <QuickActionCard
                icon="description"
                title="My proposals"
                desc={`${pendingApps.length} pending · track applications`}
                to="/creator/proposals"
              />
              <QuickActionCard
                icon="web"
                title="Manage pages"
                desc={`${pages.length} page${pages.length !== 1 ? 's' : ''} in your portfolio`}
                to="/creator/pages"
              />
            </div>
          </div>

          <div className="cr-panel">
            <div className="cr-strength">
              <div className="cr-strength-top">
                <strong>Profile strength</strong>
                <span>{strength}%</span>
              </div>
              <div className="cr-strength-bar"><span style={{ width: `${strength}%` }} /></div>
              <div className="cr-strength-list">
                <div className={`cr-strength-item ${pages.length > 0 ? 'done' : ''}`}>
                  <Icon name={pages.length > 0 ? 'check_circle' : 'radio_button_unchecked'} size={16} />
                  List at least one page
                </div>
                <div className={`cr-strength-item ${pages.some((p) => p.verificationStatus === 'VERIFIED') ? 'done' : ''}`}>
                  <Icon name={pages.some((p) => p.verificationStatus === 'VERIFIED') ? 'check_circle' : 'radio_button_unchecked'} size={16} />
                  Get a page verified
                </div>
                <div className={`cr-strength-item ${user?.creatorProfile?.connectStatus === 'CONNECTED' ? 'done' : ''}`}>
                  <Icon name={user?.creatorProfile?.connectStatus === 'CONNECTED' ? 'check_circle' : 'radio_button_unchecked'} size={16} />
                  Connect payout account
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cr-panel">
        <div className="cr-panel-head">
          <h2>Recommended for you</h2>
          <Link to="/creator/marketplace" className="cr-panel-link">See all matches</Link>
        </div>
        {recommended.length === 0 ? (
          <div className="cr-empty-panel">No matches yet — add more page details or browse all campaigns.</div>
        ) : (
          <div className="cr-job-scroll">
            {recommended.map((c) => (
              <Link key={c.id} to="/creator/marketplace" className="cr-job-card">
                {c.matchScore >= 45 && (
                  <span className="cr-job-match">{c.matchScore}% match</span>
                )}
                <h3>{c.name}</h3>
                <p>{c.advertiser?.companyName} · Posted {c.postedAgo || 'recently'}</p>
                <span className="cr-job-budget">
                  {formatMoney(c.budgetTotal)}
                  {c.perPlacement ? ` · ${formatMoney(c.perPlacement)}/post` : ''}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
