import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../PageHeader';
import EmptyState from '../EmptyState';
import Icon from '../Icon';
import { PageIdentity, PageStatus, ScoreRing } from './creatorUi';
import { buildPageRows, formatCount, formatMoney } from '../../utils/creatorMetrics';
import { displayPageLocation, displayPageNiche } from '../../utils/pageForm';
import { pagesApi, collaborationsApi, marketplaceApi } from '../../services/api';
import '../../styles/creator-home.css';

const TABS = [
  { key: 'all', label: 'All pages' },
  { key: 'verified', label: 'Verified' },
  { key: 'pending', label: 'Pending' },
  { key: 'rejected', label: 'Rejected' },
];

export default function CreatorMyPages() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  const { data: pagesData } = useQuery({ queryKey: ['pages'], queryFn: () => pagesApi.list().then((r) => r.data) });
  const { data: collabsData } = useQuery({ queryKey: ['cre-collabs'], queryFn: () => collaborationsApi.list().then((r) => r.data) });
  const { data: campaignsData } = useQuery({
    queryKey: ['marketplace', { view: 'best', limit: 1 }],
    queryFn: () => marketplaceApi.campaigns({ view: 'best', limit: 1 }).then((r) => r.data),
  });
  const { data: invitationsData } = useQuery({ queryKey: ['invitations'], queryFn: () => marketplaceApi.invitations().then((r) => r.data) });

  const pages = pagesData?.pages || [];
  const rows = buildPageRows(
    pages,
    collabsData?.collaborations || [],
    campaignsData?.total || 0,
    invitationsData?.invitations || [],
  );

  const filtered = useMemo(() => {
    if (tab === 'verified') return rows.filter((p) => p.verificationStatus === 'VERIFIED');
    if (tab === 'pending') return rows.filter((p) => p.verificationStatus === 'PENDING');
    if (tab === 'rejected') return rows.filter((p) => p.verificationStatus === 'REJECTED');
    return rows;
  }, [rows, tab]);

  const tabCounts = {
    all: rows.length,
    verified: rows.filter((p) => p.verificationStatus === 'VERIFIED').length,
    pending: rows.filter((p) => p.verificationStatus === 'PENDING').length,
    rejected: rows.filter((p) => p.verificationStatus === 'REJECTED').length,
  };

  if (!pages.length) {
    return (
      <EmptyState
        title="Build your creator portfolio"
        description="Add your social media pages so brands can discover you and send collaboration offers."
        action={<Link to="/creator/pages/new" className="btn-primary dashboard-pill-btn">+ List your first page</Link>}
      />
    );
  }

  const totalFollowers = pages.reduce((sum, page) => sum + Number(page.followers || 0), 0);
  const verifiedCount = tabCounts.verified;
  const totalEarnings = rows.reduce((sum, page) => sum + page.earnings, 0);

  return (
    <div className="cr-pages cc-animate-fade">
      <PageHeader
        title="My Pages"
        lead="Manage your social profiles, verification status, and per-page performance."
        actions={(
          <>
            <Link to="/creator/pages/new" className="chip-btn">+ Add page</Link>
            <Link to="/creator/marketplace" className="btn-primary dashboard-pill-btn">Find campaigns</Link>
          </>
        )}
      />

      <div className="cr-pages-summary">
        <div className="cr-pages-summary-item">
          <span>Total pages</span>
          <strong>{pages.length}</strong>
        </div>
        <div className="cr-pages-summary-item">
          <span>Total followers</span>
          <strong>{formatCount(totalFollowers)}</strong>
        </div>
        <div className="cr-pages-summary-item">
          <span>Verified · Earnings</span>
          <strong>{verifiedCount} · {formatMoney(totalEarnings)}</strong>
        </div>
      </div>

      <div className="cr-pages-toolbar">
        <div className="cr-pages-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`cr-pages-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label} ({tabCounts[t.key]})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="cr-panel">
          <div className="cr-empty-panel">
            No pages in this category.{' '}
            {tab !== 'all' && (
              <button type="button" className="btn-ghost" onClick={() => setTab('all')}>View all pages</button>
            )}
          </div>
        </div>
      ) : (
        <div className="cr-pages-grid">
          {filtered.map((page) => (
            <article key={page.id} className="cr-page-card">
              <div className="cr-page-card-head">
                <PageIdentity
                  page={page}
                  subtitle={`${page.platform?.name || 'Platform'} · ${displayPageNiche(page)}`}
                />
                <ScoreRing value={page.score} size={48} />
              </div>

              <PageStatus status={page.verificationStatus} />

              <div className="cr-page-metrics">
                <div className="cr-page-metric">
                  <span>Followers</span>
                  <strong>{formatCount(page.followers)}</strong>
                </div>
                <div className="cr-page-metric">
                  <span>Active</span>
                  <strong>{page.activeCampaigns}</strong>
                </div>
                <div className="cr-page-metric">
                  <span>Earnings</span>
                  <strong>{formatMoney(page.earnings)}</strong>
                </div>
              </div>

              {(page.country || page.pendingInvites > 0) && (
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-3)' }}>
                  {displayPageLocation(page)}
                  {page.pendingInvites > 0 && (
                    <span style={{ color: 'var(--accent-text)', fontWeight: 700 }}>
                      {' '}· {page.pendingInvites} invitation{page.pendingInvites !== 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              )}

              <div className="cr-page-card-actions">
                <button
                  type="button"
                  className="dashboard-view-btn"
                  onClick={() => navigate(`/creator/pages/${page.id}`)}
                >
                  Manage page
                </button>
                {page.verificationStatus !== 'PENDING' && (
                  <button
                    type="button"
                    className="dashboard-menu-btn"
                    aria-label="Edit page"
                    title="Edit page"
                    onClick={() => navigate(`/creator/pages/${page.id}/edit`)}
                  >
                    <Icon name="edit" size={18} />
                  </button>
                )}
                <button
                  type="button"
                  className="dashboard-menu-btn"
                  aria-label="Find campaigns for this page"
                  onClick={() => navigate('/creator/marketplace')}
                  title="Find campaigns"
                >
                  <Icon name="storefront" size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
