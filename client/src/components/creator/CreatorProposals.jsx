import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../PageHeader';
import EmptyState from '../EmptyState';
import Icon from '../Icon';
import StatusPill from '../StatusPill';
import { PageIdentity } from './creatorUi';
import { formatMoney } from '../../utils/creatorMetrics';
import {
  PROPOSAL_TABS, filterProposals, proposalTabCounts, formatProposalDate, proposalStatusLabel,
} from '../../utils/proposalUtils';
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
  const [searchParams] = useSearchParams();
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

  if (!isLoading && applications.length === 0) {
    return (
      <div className="prop-page cc-animate-fade">
        <PageHeader
          title="Proposals"
          lead="Track campaigns you've applied to and monitor advertiser responses."
          actions={<Link to="/creator/marketplace" className="btn-primary dashboard-pill-btn">Find campaigns</Link>}
        />
        <EmptyState
          title="No proposals yet"
          description="Browse the marketplace, find campaigns that match your pages, and submit your first proposal."
          action={<Link to="/creator/marketplace" className="btn-primary dashboard-pill-btn">Browse marketplace</Link>}
        />
      </div>
    );
  }

  return (
    <div className="prop-page cc-animate-fade">
      <PageHeader
        title="Proposals"
        lead="Track submitted proposals, accepted offers, and declined applications."
        actions={<Link to="/creator/marketplace" className="btn-primary dashboard-pill-btn">Find campaigns</Link>}
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
            placeholder="Search by campaign, brand, or page…"
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
            className={`prop-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
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
          <p>No proposals in this category.</p>
          {tab !== 'all' && <button type="button" className="btn-ghost" onClick={() => setTab('all')}>View all</button>}
        </div>
      ) : (
        <div className="prop-card-list">
          {filtered.map((app) => (
            <button
              key={app.id}
              type="button"
              className="prop-card"
              onClick={() => navigate(`/creator/proposals/${app.id}`)}
            >
              <div className="prop-card-top">
                <div>
                  <strong>{app.campaign?.name || 'Campaign'}</strong>
                  <span className="prop-card-sub">
                    {app.campaign?.advertiser?.companyName || 'Brand'} · {formatMoney(app.proposedPrice)}
                  </span>
                </div>
                <StatusPill status={app.status} label={proposalStatusLabel(app.status)} />
              </div>
              {app.page && (
                <div className="prop-card-page">
                  <PageIdentity page={app.page} subtitle={app.page.platform?.name} />
                </div>
              )}
              <div className="prop-card-footer">
                <span className="prop-card-next">
                  <Icon name="arrow_forward" size={14} />
                  {nextStepHint(app.status)} · {formatProposalDate(app.createdAt)}
                </span>
                <Icon name="chevron_right" size={20} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
