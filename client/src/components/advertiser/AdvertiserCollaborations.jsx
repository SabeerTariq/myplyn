import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../PageHeader';
import EmptyState from '../EmptyState';
import Icon from '../Icon';
import StatusPill from '../StatusPill';
import { PageIdentity } from '../creator/creatorUi';
import { formatCount, formatMoney } from '../../utils/creatorMetrics';
import { collaborationsApi } from '../../services/api';
import '../../styles/advertiser-collabs.css';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'In progress' },
  { key: 'review', label: 'Needs review' },
  { key: 'completed', label: 'Completed' },
];

const ACTIVE_STATUSES = new Set([
  'REQUESTED', 'APPLICATION_PENDING', 'ACCEPTED', 'CONTENT_PROVIDED', 'PUBLISHED',
]);
const REVIEW_STATUSES = new Set(['PROOF_SUBMITTED', 'IN_REVIEW']);
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
  if (['REQUESTED', 'ACCEPTED'].includes(status)) return 'Provide content';
  if (status === 'CONTENT_PROVIDED') return 'Awaiting publish';
  if (status === 'PUBLISHED') return 'Awaiting proof';
  if (REVIEW_STATUSES.has(status)) return 'Review proof';
  if (COMPLETED_STATUSES.has(status)) return 'Completed';
  if (status === 'CANCELLED') return 'Cancelled';
  if (status === 'DISPUTED') return 'Disputed';
  return 'In progress';
}

export default function AdvertiserCollaborations() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const listRef = useRef(null);

  const goToTab = (key) => {
    setTab(key);
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ['adv-collabs'],
    queryFn: () => collaborationsApi.list().then((r) => r.data),
  });

  const collaborations = data?.collaborations || [];

  const tabCounts = useMemo(() => ({
    all: collaborations.length,
    active: collaborations.filter((c) => ACTIVE_STATUSES.has(c.status)).length,
    review: collaborations.filter((c) => REVIEW_STATUSES.has(c.status)).length,
    completed: collaborations.filter((c) => COMPLETED_STATUSES.has(c.status)).length,
  }), [collaborations]);

  const filtered = useMemo(() => {
    let items = collaborations;
    if (tab === 'active') items = items.filter((c) => ACTIVE_STATUSES.has(c.status));
    if (tab === 'review') items = items.filter((c) => REVIEW_STATUSES.has(c.status));
    if (tab === 'completed') items = items.filter((c) => COMPLETED_STATUSES.has(c.status));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter((c) => (
        c.campaign?.name?.toLowerCase().includes(q)
        || c.page?.name?.toLowerCase().includes(q)
        || c.page?.platform?.name?.toLowerCase().includes(q)
      ));
    }
    return items;
  }, [collaborations, tab, search]);

  const needsReview = tabCounts.review;

  if (!isLoading && collaborations.length === 0) {
    return (
      <div className="adv-collabs cc-animate-fade">
        <PageHeader
          title="Collaborations"
          lead="Manage creator partnerships from brief to payment release."
          actions={<Link to="/advertiser/campaigns/new" className="btn-primary dashboard-pill-btn">Create campaign</Link>}
        />
        <EmptyState
          title="No collaborations yet"
          description="Approve creator proposals or invite creators from the marketplace to start your first collaboration."
          action={(
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/advertiser/campaigns" className="chip-btn">View campaigns</Link>
              <Link to="/advertiser/marketplace" className="btn-primary dashboard-pill-btn">Find creators</Link>
            </div>
          )}
        />
      </div>
    );
  }

  return (
    <div className="adv-collabs cc-animate-fade">
      <PageHeader
        title="Collaborations"
        lead="Track deliverables, review proofs, and release payments to creators."
        actions={(
          <>
            <Link to="/advertiser/marketplace" className="chip-btn">Find creators</Link>
            <Link to="/advertiser/campaigns" className="btn-primary dashboard-pill-btn">Campaigns</Link>
          </>
        )}
      />

      {needsReview > 0 && (
        <div className="adv-collab-alert adv-collab-alert--warn">
          <Icon name="notifications_active" size={20} />
          <div>
            <strong>{needsReview} collaboration{needsReview !== 1 ? 's' : ''} need your review</strong>
            <span>Creators submitted proof — verify and release payment to complete.</span>
          </div>
          <button type="button" className="chip-btn" style={{ marginLeft: 'auto' }} onClick={() => goToTab('review')}>Review now</button>
        </div>
      )}

      <div className="adv-collab-summary">
        <div className="adv-collab-summary-item">
          <span>Total</span>
          <strong>{collaborations.length}</strong>
        </div>
        <div className="adv-collab-summary-item">
          <span>In progress</span>
          <strong>{tabCounts.active}</strong>
        </div>
        <div className="adv-collab-summary-item">
          <span>Needs review</span>
          <strong>{needsReview}</strong>
        </div>
        <div className="adv-collab-summary-item">
          <span>Completed</span>
          <strong>{tabCounts.completed}</strong>
        </div>
      </div>

      <div className="adv-collab-toolbar">
        <div className="adv-collab-search-wrap">
          <Icon name="search" size={20} />
          <input
            type="search"
            className="adv-collab-search"
            placeholder="Search campaign or creator page…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="adv-collab-tabs" ref={listRef}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`adv-collab-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label} ({tabCounts[t.key]})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="adv-collab-loading">Loading collaborations…</div>
      ) : filtered.length === 0 ? (
        <div className="adv-collab-empty">
          <p>No collaborations in this view.</p>
          {tab !== 'all' && <button type="button" className="btn-ghost" onClick={() => setTab('all')}>View all</button>}
        </div>
      ) : (
        <div className="adv-collab-list">
          {filtered.map((collab) => (
            <button
              key={collab.id}
              type="button"
              className="adv-collab-card"
              onClick={() => navigate(`/advertiser/collaborations/${collab.id}`)}
            >
              <div className="adv-collab-card-top">
                <div>
                  <strong>{collab.campaign?.name || 'Campaign'}</strong>
                  <span className="adv-collab-card-sub">
                    {formatMoney(collab.agreedAmount)} · Updated {formatDate(collab.updatedAt)}
                  </span>
                </div>
                <StatusPill status={collab.status} />
              </div>

              <div className="adv-collab-card-creator">
                {collab.page ? (
                  <PageIdentity
                    page={collab.page}
                    subtitle={`${collab.page.platform?.name || 'Platform'} · ${formatCount(collab.page.followers)} followers`}
                  />
                ) : (
                  <span>Creator page</span>
                )}
              </div>

              <div className="adv-collab-card-footer">
                <span className="adv-collab-next">
                  <Icon name="arrow_forward" size={14} />
                  {nextStepHint(collab.status)}
                </span>
                <Icon name="chevron_right" size={20} className="adv-collab-chevron" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
