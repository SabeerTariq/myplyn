import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../PageHeader';
import EmptyState from '../EmptyState';
import Icon from '../Icon';
import StatusPill from '../StatusPill';
import { PageIdentity } from './creatorUi';
import { formatMoney } from '../../utils/creatorMetrics';
import { collaborationsApi } from '../../services/api';
import '../../styles/creator-collabs.css';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'action', label: 'Your turn' },
  { key: 'waiting', label: 'Awaiting brand' },
  { key: 'completed', label: 'Completed' },
];

const ACTION_STATUSES = new Set(['CONTENT_PROVIDED', 'PUBLISHED']);
const WAITING_STATUSES = new Set(['REQUESTED', 'APPLICATION_PENDING', 'ACCEPTED', 'PROOF_SUBMITTED', 'IN_REVIEW']);
const COMPLETED_STATUSES = new Set(['VERIFIED', 'RELEASED', 'PAID_OUT']);

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  const diffDays = Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function nextStepHint(status) {
  if (['REQUESTED', 'ACCEPTED', 'APPLICATION_PENDING'].includes(status)) return 'Waiting for brand assets';
  if (status === 'CONTENT_PROVIDED') return 'Mark as published';
  if (status === 'PUBLISHED') return 'Submit proof';
  if (['PROOF_SUBMITTED', 'IN_REVIEW'].includes(status)) return 'Awaiting brand review';
  if (COMPLETED_STATUSES.has(status)) return 'Paid out';
  if (status === 'CANCELLED') return 'Cancelled';
  if (status === 'DISPUTED') return 'Disputed';
  return 'In progress';
}

export default function CreatorCollaborations() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['cre-collabs'],
    queryFn: () => collaborationsApi.list().then((r) => r.data),
  });

  const collaborations = data?.collaborations || [];

  const tabCounts = useMemo(() => ({
    all: collaborations.length,
    action: collaborations.filter((c) => ACTION_STATUSES.has(c.status)).length,
    waiting: collaborations.filter((c) => WAITING_STATUSES.has(c.status)).length,
    completed: collaborations.filter((c) => COMPLETED_STATUSES.has(c.status)).length,
  }), [collaborations]);

  const filtered = useMemo(() => {
    let items = collaborations;
    if (tab === 'action') items = items.filter((c) => ACTION_STATUSES.has(c.status));
    if (tab === 'waiting') items = items.filter((c) => WAITING_STATUSES.has(c.status));
    if (tab === 'completed') items = items.filter((c) => COMPLETED_STATUSES.has(c.status));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((c) => (
        c.campaign?.name?.toLowerCase().includes(q)
        || c.campaign?.advertiser?.companyName?.toLowerCase().includes(q)
        || c.page?.name?.toLowerCase().includes(q)
      ));
    }
    return items;
  }, [collaborations, tab, search]);

  const actionCount = tabCounts.action;

  if (!isLoading && collaborations.length === 0) {
    return (
      <div className="cr-collabs cc-animate-fade">
        <PageHeader
          title="Collaborations"
          lead="Manage active brand deals from brief to payout."
          actions={<Link to="/creator/marketplace" className="btn-primary dashboard-pill-btn">Find campaigns</Link>}
        />
        <EmptyState
          title="No collaborations yet"
          description="Submit proposals in the marketplace or accept brand invitations to start earning."
          action={(
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/creator/marketplace" className="btn-primary dashboard-pill-btn">Browse marketplace</Link>
              <Link to="/creator/proposals" className="chip-btn">My proposals</Link>
            </div>
          )}
        />
      </div>
    );
  }

  return (
    <div className="cr-collabs cc-animate-fade">
      <PageHeader
        title="Collaborations"
        lead="Track deliverables, submit proof, and get paid for completed campaigns."
        actions={(
          <>
            <Link to="/creator/proposals" className="chip-btn">My proposals</Link>
            <Link to="/creator/marketplace" className="btn-primary dashboard-pill-btn">Find campaigns</Link>
          </>
        )}
      />

      {actionCount > 0 && (
        <div className="cr-collab-alert cr-collab-alert--warn">
          <Icon name="pending_actions" size={20} />
          <div>
            <strong>{actionCount} collaboration{actionCount !== 1 ? 's' : ''} need your action</strong>
            <span>Publish your post or submit proof to keep the collaboration moving.</span>
          </div>
          <button type="button" className="chip-btn" onClick={() => setTab('action')}>Take action</button>
        </div>
      )}

      <div className="cr-collab-summary">
        <div className="cr-collab-summary-item">
          <span>Total</span>
          <strong>{collaborations.length}</strong>
        </div>
        <div className="cr-collab-summary-item">
          <span>Your turn</span>
          <strong>{actionCount}</strong>
        </div>
        <div className="cr-collab-summary-item">
          <span>Awaiting brand</span>
          <strong>{tabCounts.waiting}</strong>
        </div>
        <div className="cr-collab-summary-item">
          <span>Completed</span>
          <strong>{tabCounts.completed}</strong>
        </div>
      </div>

      <div className="cr-collab-toolbar">
        <div className="cr-collab-search-wrap">
          <Icon name="search" size={20} />
          <input
            type="search"
            className="cr-collab-search"
            placeholder="Search campaign or brand…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="cr-collab-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`cr-collab-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label} ({tabCounts[t.key]})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="cr-collab-loading">Loading collaborations…</div>
      ) : filtered.length === 0 ? (
        <div className="cr-collab-empty">
          <p>No collaborations in this view.</p>
          {tab !== 'all' && <button type="button" className="btn-ghost" onClick={() => setTab('all')}>View all</button>}
        </div>
      ) : (
        <div className="cr-collab-list">
          {filtered.map((collab) => (
            <button
              key={collab.id}
              type="button"
              className="cr-collab-card"
              onClick={() => navigate(`/creator/collaborations/${collab.id}`)}
            >
              <div className="cr-collab-card-top">
                <div>
                  <strong>{collab.campaign?.name || 'Campaign'}</strong>
                  <span className="cr-collab-card-sub">
                    {collab.campaign?.advertiser?.companyName || 'Brand'} · {formatMoney(collab.agreedAmount)} · {formatDate(collab.updatedAt)}
                  </span>
                </div>
                <StatusPill status={collab.status} />
              </div>

              {collab.page && (
                <div className="cr-collab-card-page">
                  <PageIdentity page={collab.page} subtitle={collab.page.platform?.name} />
                </div>
              )}

              <div className="cr-collab-card-footer">
                <span className={`cr-collab-next ${ACTION_STATUSES.has(collab.status) ? 'cr-collab-next--action' : ''}`}>
                  <Icon name="arrow_forward" size={14} />
                  {nextStepHint(collab.status)}
                </span>
                <Icon name="chevron_right" size={20} className="cr-collab-chevron" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
