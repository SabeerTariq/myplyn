import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../PageHeader';
import EmptyState from '../EmptyState';
import Icon from '../Icon';
import StatusPill from '../StatusPill';
import Modal from '../Modal';
import { PageIdentity } from '../creator/creatorUi';
import { formatCount, formatMoney } from '../../utils/creatorMetrics';
import {
  PROPOSAL_TABS,
  filterProposals,
  proposalTabCounts,
  formatProposalDate,
  proposalStatusLabel,
  formatBidDelta,
} from '../../utils/proposalUtils';
import { displayPageNiche } from '../../utils/pageForm';
import { marketplaceApi } from '../../services/api';
import '../../styles/proposals.css';

const ADV_TABS = PROPOSAL_TABS.map((t) => (
  t.key === 'pending' ? { ...t, label: 'Pending review' } : t
));

export default function AdvertiserProposals() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const campaignFilter = searchParams.get('campaign') || '';
  const [tab, setTab] = useState(searchParams.get('tab') || 'all');
  const [search, setSearch] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const listRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ['adv-proposals'],
    queryFn: () => marketplaceApi.proposals().then((r) => r.data),
  });

  const applications = data?.applications || [];
  const tabCounts = useMemo(() => proposalTabCounts(applications), [applications]);
  const filtered = useMemo(
    () => filterProposals(applications, { tab, search, campaignId: campaignFilter || undefined }),
    [applications, tab, search, campaignFilter],
  );

  const pendingCount = tabCounts.pending;
  const compareItems = applications.filter((a) => compareIds.includes(a.id));

  const campaignName = useMemo(() => {
    if (!campaignFilter) return '';
    const match = applications.find(
      (a) => a.campaignId === campaignFilter || a.campaign?.id === campaignFilter,
    );
    return match?.campaign?.name || 'Campaign';
  }, [applications, campaignFilter]);

  const setTabWithUrl = (key) => {
    setTab(key);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (key === 'all') next.delete('tab');
      else next.set('tab', key);
      return next;
    }, { replace: true });
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const clearCampaignFilter = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('campaign');
      return next;
    }, { replace: true });
  };

  const toggleCompare = (id, e) => {
    e.stopPropagation();
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  if (!isLoading && applications.length === 0) {
    return (
      <div className="prop-page cc-animate-fade">
        <PageHeader
          title="Proposals"
          lead="Review creator applications across all your campaigns."
        actions={(
          <>
            <Link to="/advertiser/marketplace" className="chip-btn">Find creators</Link>
            <Link to="/advertiser/campaigns/new" className="btn-primary prop-mobile-cta">Create campaign</Link>
          </>
        )}
        />
        <EmptyState
          title="No proposals yet"
          description="When creators apply to your campaigns, their proposals will appear here for review."
          action={(
            <div className="prop-empty-actions">
              <Link to="/advertiser/campaigns" className="chip-btn">View campaigns</Link>
              <Link to="/advertiser/marketplace" className="btn-primary prop-mobile-cta">Invite creators</Link>
            </div>
          )}
        />
      </div>
    );
  }

  return (
    <div className="prop-page cc-animate-fade">
      <PageHeader
        title="Proposals"
        lead="Review, compare, and accept creator applications."
        actions={(
          <button
            type="button"
            className={`chip-btn prop-compare-toggle ${compareMode ? 'is-active' : ''}`}
            onClick={() => { setCompareMode((v) => !v); setCompareIds([]); }}
          >
            <Icon name="compare" size={16} />
            <span className="prop-compare-toggle__label">{compareMode ? 'Done' : 'Compare'}</span>
          </button>
        )}
      />

      {pendingCount > 0 && tab !== 'pending' && (
        <div className="prop-alert prop-alert--warn">
          <Icon name="inbox" size={18} />
          <div>
            <strong>{pendingCount} proposal{pendingCount !== 1 ? 's' : ''} need review</strong>
            <span>Accept to start collaborations or decline with optional feedback.</span>
          </div>
          <button type="button" className="chip-btn prop-alert-action" onClick={() => setTabWithUrl('pending')}>
            Review now
          </button>
        </div>
      )}

      {campaignFilter && (
        <div className="prop-filter-chip">
          <Icon name="campaign" size={16} />
          <span>Filtered by: <strong>{campaignName}</strong></span>
          <button type="button" className="prop-filter-chip-clear" onClick={clearCampaignFilter} aria-label="Clear campaign filter">
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <div className="prop-toolbar">
        <div className="prop-search-wrap">
          <Icon name="search" size={20} />
          <input
            type="search"
            className="prop-search"
            placeholder="Search campaign or creator…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="prop-tabs" ref={listRef}>
        {ADV_TABS.map((t) => (
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
          <p>No proposals in this view.</p>
          {(tab !== 'all' || campaignFilter || search) && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setTabWithUrl('all');
                setSearch('');
                clearCampaignFilter();
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="prop-card-list">
          {filtered.map((app) => {
            const selected = compareIds.includes(app.id);
            const bidDelta = formatBidDelta(app.proposedPrice, app.campaign?.perPlacement);
            const niche = displayPageNiche(app.page);
            return (
              <button
                key={app.id}
                type="button"
                className={`prop-card ${selected ? 'prop-card--selected' : ''}`}
                onClick={() => navigate(`/advertiser/proposals/${app.id}`)}
              >
                {compareMode && app.status === 'PENDING' && (
                  <label className="prop-compare-check" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => toggleCompare(app.id, e)}
                    />
                    Compare
                  </label>
                )}

                <div className="prop-card-top">
                  <div className="prop-card-head">
                    {app.page ? (
                      <PageIdentity
                        page={app.page}
                        subtitle={`${app.campaign?.name || 'Campaign'} · ${formatProposalDate(app.createdAt)}`}
                      />
                    ) : (
                      <div>
                        <strong className="prop-card-campaign">{app.campaign?.name || 'Campaign'}</strong>
                        <span className="prop-card-sub">{formatProposalDate(app.createdAt)}</span>
                      </div>
                    )}
                  </div>
                  <StatusPill status={app.status} label={proposalStatusLabel(app.status)} />
                </div>

                <div className="prop-card-bid-row">
                  <div className="prop-card-bid-main">
                    <span className="prop-card-bid-label">Bid</span>
                    <strong>{formatMoney(app.proposedPrice)}</strong>
                  </div>
                  {app.campaign?.perPlacement && (
                    <div className="prop-card-bid-budget">
                      <span>Budget</span>
                      <strong>{formatMoney(app.campaign.perPlacement)}</strong>
                    </div>
                  )}
                  {bidDelta && (
                    <span className={`prop-bid-delta prop-bid-delta--${bidDelta.tone}`}>
                      {bidDelta.label}
                    </span>
                  )}
                </div>

                <div className="prop-card-kpi-grid">
                  {app.page?.followers > 0 && (
                    <div className="prop-card-kpi">
                      <Icon name="groups" size={16} />
                      <span>{formatCount(app.page.followers)}</span>
                      <small>Followers</small>
                    </div>
                  )}
                  {app.page?.engagement > 0 && (
                    <div className="prop-card-kpi">
                      <Icon name="trending_up" size={16} />
                      <span>{Number(app.page.engagement).toFixed(1)}%</span>
                      <small>Engagement</small>
                    </div>
                  )}
                  {app.page?.platform?.name && (
                    <div className="prop-card-kpi">
                      <Icon name="public" size={16} />
                      <span>{app.page.platform.name}</span>
                      <small>Platform</small>
                    </div>
                  )}
                  {niche !== '—' && (
                    <div className="prop-card-kpi">
                      <Icon name="category" size={16} />
                      <span>{niche}</span>
                      <small>Niche</small>
                    </div>
                  )}
                </div>

                <div className="prop-card-metrics prop-card-metrics--legacy">
                  <span className="prop-card-metric">
                    <Icon name="payments" size={14} />
                    Bid {formatMoney(app.proposedPrice)}
                  </span>
                  {app.campaign?.perPlacement && (
                    <span className="prop-card-metric">
                      <Icon name="account_balance_wallet" size={14} />
                      Budget {formatMoney(app.campaign.perPlacement)}
                    </span>
                  )}
                  {app.page?.followers > 0 && (
                    <span className="prop-card-metric">
                      <Icon name="groups" size={14} />
                      {formatCount(app.page.followers)}
                    </span>
                  )}
                  {app.page?.platform?.name && (
                    <span className="prop-card-metric">
                      <Icon name="public" size={14} />
                      {app.page.platform.name}
                    </span>
                  )}
                  {niche !== '—' && (
                    <span className="prop-card-metric">{niche}</span>
                  )}
                </div>

                {app.message && (
                  <p className="prop-card-excerpt">{app.message.slice(0, 100)}{app.message.length > 100 ? '…' : ''}</p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {compareMode && compareIds.length > 0 && (
        <div className="prop-compare-bar">
          <span>{compareIds.length} of 3 selected</span>
          <button type="button" className="btn-primary dashboard-pill-btn" onClick={() => setShowCompare(true)}>
            Compare
          </button>
          <button type="button" className="btn-ghost" onClick={() => setCompareIds([])}>Clear</button>
        </div>
      )}

      <Modal open={showCompare} onClose={() => setShowCompare(false)} title="Compare proposals" size="xl">
        <div className="prop-compare-grid">
          {compareItems.map((app) => {
            const bidDelta = formatBidDelta(app.proposedPrice, app.campaign?.perPlacement);
            return (
              <div key={app.id} className="prop-compare-col">
                {app.page && <PageIdentity page={app.page} subtitle={app.campaign?.name} />}
                <dl className="prop-compare-dl">
                  <div><dt>Bid</dt><dd>{formatMoney(app.proposedPrice)}</dd></div>
                  <div><dt>Budget</dt><dd>{app.campaign?.perPlacement ? formatMoney(app.campaign.perPlacement) : '—'}</dd></div>
                  {bidDelta && <div><dt>vs budget</dt><dd className={`prop-bid-delta prop-bid-delta--${bidDelta.tone}`}>{bidDelta.label}</dd></div>}
                  <div><dt>Followers</dt><dd>{formatCount(app.page?.followers)}</dd></div>
                  <div><dt>Engagement</dt><dd>{app.page?.engagement ? `${Number(app.page.engagement).toFixed(1)}%` : '—'}</dd></div>
                  <div><dt>Platform</dt><dd>{app.page?.platform?.name || '—'}</dd></div>
                  <div><dt>Niche</dt><dd>{displayPageNiche(app.page)}</dd></div>
                </dl>
                {app.message && <p className="prop-cover-letter">{app.message}</p>}
                <Link
                  to={`/advertiser/proposals/${app.id}`}
                  className="btn-primary dashboard-pill-btn"
                  onClick={() => setShowCompare(false)}
                >
                  Open proposal
                </Link>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
