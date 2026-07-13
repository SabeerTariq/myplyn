import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../PageHeader';
import EmptyState from '../EmptyState';
import Icon from '../Icon';
import StatusPill from '../StatusPill';
import { PageIdentity } from './creatorUi';
import { formatCount, formatMoney } from '../../utils/creatorMetrics';
import {
  PROPOSAL_TABS, filterProposals, proposalTabCounts, formatProposalDate, proposalStatusLabel,
  formatBidDelta,
} from '../../utils/proposalUtils';
import { displayPageNiche } from '../../utils/pageForm';
import { marketplaceApi } from '../../services/api';
import '../../styles/proposals.css';

function nextStepHint(status) {
  if (status === 'PENDING') return 'Awaiting brand response';
  if (status === 'APPROVED') return 'Collaboration started';
  if (status === 'REJECTED') return 'Declined';
  return status;
}

export default function CreatorProposals() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'all');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => marketplaceApi.applications().then((r) => r.data),
  });

  const applications = data?.applications || [];
  const tabCounts = useMemo(() => proposalTabCounts(applications), [applications]);
  const filtered = useMemo(
    () => filterProposals(applications, { tab, search }),
    [applications, tab, search],
  );

  const pendingCount = tabCounts.pending;

  const setTabWithUrl = (key) => {
    setTab(key);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (key === 'all') next.delete('tab');
      else next.set('tab', key);
      return next;
    }, { replace: true });
  };

  if (!isLoading && applications.length === 0) {
    return (
      <div className="prop-page cc-animate-fade">
        <PageHeader
          title="Proposals"
          lead="Track campaigns you've applied to and monitor advertiser responses."
          actions={<Link to="/creator/marketplace" className="btn-primary prop-mobile-cta">Find campaigns</Link>}
        />
        <EmptyState
          title="No proposals yet"
          description="Browse the marketplace, find campaigns that match your pages, and submit your first proposal."
          action={<Link to="/creator/marketplace" className="btn-primary prop-mobile-cta">Browse marketplace</Link>}
        />
      </div>
    );
  }

  return (
    <div className="prop-page cc-animate-fade">
      <PageHeader
        title="Proposals"
        lead="Track submitted proposals, accepted offers, and declined applications."
        actions={<Link to="/creator/marketplace" className="btn-primary prop-mobile-cta">Find campaigns</Link>}
      />

      {pendingCount > 0 && (
        <div className="prop-alert prop-alert--info">
          <Icon name="hourglass_top" size={18} />
          <div>
            <strong>{pendingCount} proposal{pendingCount !== 1 ? 's' : ''} awaiting response</strong>
            <span>Brands typically respond within a few days.</span>
          </div>
        </div>
      )}

      <div className="prop-toolbar">
        <div className="prop-search-wrap">
          <Icon name="search" size={20} />
          <input
            type="search"
            className="prop-search"
            placeholder="Search campaign or brand…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="prop-tabs">
        {PROPOSAL_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`prop-tab ${tab === t.key ? 'active' : ''} ${t.key === 'pending' && tabCounts.pending > 0 ? 'prop-tab--attention' : ''}`}
            onClick={() => setTabWithUrl(t.key)}
          >
            {t.label}
            <span className="prop-tab-count">{tabCounts[t.key]}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="prop-list-loading">Loading proposals…</div>
      ) : filtered.length === 0 ? (
        <div className="prop-list-empty">
          <Icon name="description" size={36} style={{ opacity: 0.35, marginBottom: 8 }} />
          <p>No proposals in this category.</p>
          {tab !== 'all' && (
            <button type="button" className="btn-ghost" onClick={() => setTabWithUrl('all')}>View all</button>
          )}
        </div>
      ) : (
        <div className="prop-card-list">
          {filtered.map((app) => {
            const bidDelta = formatBidDelta(app.proposedPrice, app.campaign?.perPlacement);
            return (
              <button
                key={app.id}
                type="button"
                className="prop-card"
                onClick={() => navigate(`/creator/proposals/${app.id}`)}
              >
                <div className="prop-card-top">
                  <div className="prop-card-head">
                    <strong className="prop-card-campaign">{app.campaign?.name || 'Campaign'}</strong>
                    <span className="prop-card-sub">
                      {app.campaign?.advertiser?.companyName || 'Brand'} · {formatProposalDate(app.createdAt)}
                    </span>
                  </div>
                  <StatusPill status={app.status} label={proposalStatusLabel(app.status)} />
                </div>

                <div className="prop-card-bid-row">
                  <div className="prop-card-bid-main">
                    <span className="prop-card-bid-label">Your bid</span>
                    <strong>{formatMoney(app.proposedPrice)}</strong>
                  </div>
                  {app.campaign?.perPlacement && (
                    <div className="prop-card-bid-budget">
                      <span>Per placement</span>
                      <strong>{formatMoney(app.campaign.perPlacement)}</strong>
                    </div>
                  )}
                  {bidDelta && (
                    <span className={`prop-bid-delta prop-bid-delta--${bidDelta.tone}`}>{bidDelta.label}</span>
                  )}
                </div>

                {app.page && (
                  <div className="prop-card-page">
                    <PageIdentity page={app.page} subtitle={app.page.platform?.name} />
                  </div>
                )}

                <div className="prop-card-kpi-grid">
                  {app.page?.followers > 0 && (
                    <div className="prop-card-kpi">
                      <Icon name="groups" size={16} />
                      <span>{formatCount(app.page.followers)}</span>
                      <small>Followers</small>
                    </div>
                  )}
                  {app.campaign?.budgetTotal > 0 && (
                    <div className="prop-card-kpi">
                      <Icon name="account_balance_wallet" size={16} />
                      <span>{formatMoney(app.campaign.budgetTotal)}</span>
                      <small>Campaign budget</small>
                    </div>
                  )}
                </div>

                <div className="prop-card-footer">
                  <span className="prop-card-next">
                    <Icon name="arrow_forward" size={14} />
                    {nextStepHint(app.status)}
                  </span>
                  <Icon name="chevron_right" size={20} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
