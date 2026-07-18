import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from '../Icon';
import Select from '../Select';
import { PageIdentity } from '../creator/creatorUi';
import { formatCount, formatMoney } from '../../utils/creatorMetrics';
import { displayPageNiche } from '../../utils/pageForm';
import { getPageNumbers } from '../../utils/pagination';
import { campaignsApi, marketplaceApi, taxonomyApi } from '../../services/api';
import '../../styles/marketplace.css';

const PAGE_SIZE = 10;

function MatchBadge({ score, level }) {
  if (!score) return null;
  const label = level === 'high' ? 'Best fit' : level === 'medium' ? 'Good fit' : 'Possible fit';
  return (
    <span className={`mp-match-badge mp-match-badge--${level || 'low'}`}>
      <Icon name="auto_awesome" size={14} />
      {label} · {score}%
    </span>
  );
}

function CreatorDetailPanel({ pageId, onClose, liveCampaigns }) {
  const qc = useQueryClient();
  const [inviteForm, setInviteForm] = useState({ campaignId: '', offeredAmount: '', message: '' });
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['marketplace-creator', pageId],
    queryFn: () => marketplaceApi.creatorPage(pageId).then((r) => r.data.page),
    enabled: !!pageId,
  });

  useEffect(() => {
    if (!data || inviteForm.campaignId) return;
    const firstCampaign = liveCampaigns?.[0];
    if (firstCampaign) {
      setInviteForm({
        campaignId: firstCampaign.id,
        offeredAmount: String(firstCampaign.perPlacement || firstCampaign.budgetTotal || ''),
        message: '',
      });
    }
  }, [data, liveCampaigns, inviteForm.campaignId]);

  const saveMut = useMutation({
    mutationFn: (save) => (
      save
        ? marketplaceApi.saveCreator(data.creator.userId)
        : marketplaceApi.unsaveCreator(data.creator.userId)
    ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adv-marketplace'] });
      qc.invalidateQueries({ queryKey: ['marketplace-creator', pageId] });
      qc.invalidateQueries({ queryKey: ['adv-saved-creators'] });
    },
  });

  const inviteMut = useMutation({
    mutationFn: () => marketplaceApi.invite({
      campaignId: inviteForm.campaignId,
      creatorUserId: data.creator.userId,
      pageId: data.id,
      message: inviteForm.message.trim() || undefined,
      offeredAmount: parseFloat(inviteForm.offeredAmount),
    }),
    onSuccess: () => {
      setInviteSuccess(true);
      setInviteError('');
      qc.invalidateQueries({ queryKey: ['adv-marketplace'] });
    },
    onError: (err) => setInviteError(err.response?.data?.error || 'Invitation failed'),
  });

  if (!pageId) return null;

  if (isLoading) {
    return (
      <aside className="mp-detail">
        <div className="mp-detail-body"><p className="text-muted">Loading creator…</p></div>
      </aside>
    );
  }

  if (!data) return null;

  const selectedCampaign = liveCampaigns?.find((c) => c.id === inviteForm.campaignId);

  return (
    <aside className="mp-detail">
      <div className="mp-detail-header">
        <button type="button" className="mp-mobile-detail-back" onClick={onClose}>
          <Icon name="arrow_back" size={18} /> Back to results
        </button>

        <div className="mp-creator-detail-hero">
          <PageIdentity
            page={data}
            subtitle={`${data.platform?.name || 'Platform'} · ${formatCount(data.followers)} followers`}
          />
          <button
            type="button"
            className={`mp-job-save ${data.isSaved ? 'saved' : ''}`}
            onClick={() => saveMut.mutate(!data.isSaved)}
            disabled={saveMut.isPending}
            aria-label={data.isSaved ? 'Unsave creator' : 'Save creator'}
          >
            <Icon name={data.isSaved ? 'bookmark' : 'bookmark_border'} size={22} filled={data.isSaved} />
          </button>
        </div>

        <div className="mp-job-meta" style={{ paddingBottom: 16 }}>
          {data.country && <span><Icon name="location_on" size={15} /> {data.city ? `${data.city}, ` : ''}{data.country}</span>}
          {data.niche?.name && <span><Icon name="category" size={15} /> {data.niche.name}</span>}
          {data.verificationStatus === 'VERIFIED' && (
            <span style={{ color: 'var(--good)', fontWeight: 700 }}><Icon name="verified" size={15} /> Verified</span>
          )}
        </div>
      </div>

      <div className="mp-detail-body">
        <div style={{ marginBottom: 14 }}>
          <MatchBadge score={data.matchScore} level={data.matchLevel} />
        </div>

        <div className="mp-detail-stats mp-detail-stats--3">
          <div className="mp-stat-box">
            <span>Followers</span>
            <strong>{formatCount(data.followers)}</strong>
          </div>
          <div className="mp-stat-box">
            <span>Avg reach</span>
            <strong>{data.avgReach ? formatCount(data.avgReach) : '—'}</strong>
          </div>
          <div className="mp-stat-box">
            <span>Engagement</span>
            <strong>{data.engagement ? `${Number(data.engagement).toFixed(1)}%` : '—'}</strong>
          </div>
        </div>

        {data.matchReasons?.length > 0 && (
          <div className="mp-detail-section">
            <h4>Why this creator fits</h4>
            <div className="mp-job-tags">
              {data.matchReasons.map((r) => <span key={r} className="mp-tag">{r}</span>)}
            </div>
          </div>
        )}

        {data.url && (
          <div className="mp-detail-section">
            <h4>Profile</h4>
            <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-accent-link" style={{ fontSize: 14, fontWeight: 700 }}>
              View public page →
            </a>
          </div>
        )}

        {inviteSuccess ? (
          <div className="mp-stat-box mp-invite-success">
            <span>Status</span>
            <strong style={{ color: 'var(--accent-text)' }}>Invitation sent!</strong>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--text-2)' }}>
              The creator will see your offer in their invitations inbox.
            </p>
            <Link to="/advertiser/collaborations" className="text-accent-link" style={{ display: 'inline-block', marginTop: 8, fontSize: 13, fontWeight: 700 }}>
              View collaborations →
            </Link>
          </div>
        ) : (
          <form
            className="mp-apply-form"
            onSubmit={(e) => {
              e.preventDefault();
              setInviteError('');
              if (!inviteForm.campaignId) {
                setInviteError('Select a live campaign to invite this creator.');
                return;
              }
              inviteMut.mutate();
            }}
          >
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Send collaboration invite</h4>

            {liveCampaigns?.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--warn)' }}>
                You need a live campaign to invite creators.{' '}
                <Link to="/advertiser/campaigns/new">Create campaign →</Link>
              </p>
            ) : (
              <>
                <div>
                  <label htmlFor="invite-campaign">Campaign</label>
                  <Select
                    id="invite-campaign"
                    required
                    value={inviteForm.campaignId}
                    onChange={(e) => {
                      const campaign = liveCampaigns.find((c) => c.id === e.target.value);
                      setInviteForm({
                        ...inviteForm,
                        campaignId: e.target.value,
                        offeredAmount: String(campaign?.perPlacement || campaign?.budgetTotal || inviteForm.offeredAmount),
                      });
                    }}
                  >
                    <option value="">Select campaign</option>
                    {liveCampaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} · {formatMoney(c.perPlacement || c.budgetTotal)}
                      </option>
                    ))}
                  </Select>
                  {selectedCampaign && (
                    <p className="mp-invite-hint">
                      Budget {formatMoney(selectedCampaign.budgetTotal)}
                      {selectedCampaign.perPlacement ? ` · ${formatMoney(selectedCampaign.perPlacement)}/placement` : ''}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="invite-amount">Offered amount ($)</label>
                  <input
                    id="invite-amount"
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={inviteForm.offeredAmount}
                    onChange={(e) => setInviteForm({ ...inviteForm, offeredAmount: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="invite-message">Message (optional)</label>
                  <textarea
                    id="invite-message"
                    placeholder="Tell the creator why you'd like to work together…"
                    value={inviteForm.message}
                    onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  />
                </div>
                {inviteError && <p style={{ color: 'var(--bad)', fontSize: 13, margin: 0 }}>{inviteError}</p>}
                <button type="submit" className="btn-primary dashboard-pill-btn" disabled={inviteMut.isPending}>
                  {inviteMut.isPending ? 'Sending…' : 'Send invite'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </aside>
  );
}

export default function AdvertiserMarketplace() {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState('best_match');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    platformId: '',
    nicheId: '',
    country: '',
    minFollowers: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: platforms } = useQuery({
    queryKey: ['platforms'],
    queryFn: () => taxonomyApi.platforms().then((r) => r.data.platforms),
  });
  const { data: niches } = useQuery({
    queryKey: ['niches'],
    queryFn: () => taxonomyApi.niches().then((r) => r.data.niches),
  });
  const { data: campaignsData } = useQuery({
    queryKey: ['adv-campaigns-live'],
    queryFn: () => campaignsApi.list({ status: 'LIVE' }).then((r) => r.data),
  });
  const { data: savedData } = useQuery({
    queryKey: ['adv-saved-creators'],
    queryFn: () => marketplaceApi.saved().then((r) => r.data),
  });

  const liveCampaigns = campaignsData?.campaigns || [];
  const savedUserIds = useMemo(
    () => new Set(savedData?.creatorUserIds || []),
    [savedData],
  );

  const queryParams = useMemo(() => ({
    q: search || undefined,
    sort,
    page: tab === 'saved' ? 1 : page,
    limit: tab === 'saved' ? 100 : PAGE_SIZE,
    platformId: filters.platformId || undefined,
    nicheId: filters.nicheId || undefined,
    country: filters.country || undefined,
    minFollowers: filters.minFollowers || undefined,
  }), [search, sort, page, filters, tab]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['adv-marketplace', queryParams],
    queryFn: () => marketplaceApi.creators(queryParams).then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const creators = useMemo(() => {
    const all = data?.creators || [];
    if (tab !== 'saved') return all;
    return all.filter((c) => savedUserIds.has(c.creator?.userId) || c.isSaved);
  }, [data, tab, savedUserIds]);

  const total = tab === 'saved' ? creators.length : (data?.total || 0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageNumbers = getPageNumbers(page, totalPages);
  const savedCount = data?.savedCount ?? savedUserIds.size;

  const clearFilters = () => {
    setFilters({ platformId: '', nicheId: '', country: '', minFollowers: '' });
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  const activeFilterCount = [
    filters.platformId,
    filters.nicheId,
    filters.country,
    filters.minFollowers,
    search,
  ].filter(Boolean).length;

  return (
    <div className="mp-page cc-animate-fade">
      <div className="dashboard-page-header" style={{ marginBottom: 8 }}>
        <div>
          <h1 className="page-title">Creator Marketplace</h1>
          <p className="dashboard-page-lead">
            Discover verified creators, filter by audience and niche, and send collaboration invites.
          </p>
        </div>
        <div className="dashboard-page-actions">
          <Link to="/advertiser/proposals" className="btn-ghost dashboard-pill-btn">Proposals</Link>
          <Link to="/advertiser/campaigns/new" className="btn-primary dashboard-pill-btn">New campaign</Link>
        </div>
      </div>

      {data?.liveCampaignCount === 0 && (
        <div className="mp-alert mp-alert--info">
          <Icon name="campaign" size={20} />
          <div>
            <strong>Publish a campaign to unlock better creator matches</strong>
            <span>Live campaigns help us rank creators that fit your brief, platform, and budget.</span>
          </div>
          <Link to="/advertiser/campaigns/new" className="chip-btn" style={{ marginLeft: 'auto' }}>Create campaign</Link>
        </div>
      )}

      <div className="mp-toolbar">
        <button
          type="button"
          className="mp-filter-toggle"
          onClick={() => setFiltersOpen(true)}
        >
          <Icon name="tune" size={18} />
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
        <div className="mp-search-wrap">
          <Icon name="search" size={20} />
          <input
            className="mp-search"
            placeholder="Search creators, pages, or locations…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Select className="select--compact mp-sort" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="best_match">Best fit</option>
          <option value="followers_high">Most followers</option>
          <option value="engagement_high">Highest engagement</option>
          <option value="newest">Recently listed</option>
        </Select>
      </div>

      <div className="mp-tabs">
        {[
          { key: 'all', label: 'All creators' },
          { key: 'saved', label: `Saved (${savedCount})` },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            className={`mp-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => { setTab(t.key); setPage(1); setSelectedId(null); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={`mp-layout ${selectedId ? 'mp-layout--detail' : ''}`}>
        {filtersOpen && (
          <button
            type="button"
            className="mp-filters-backdrop"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
          />
        )}
        <aside className={`mp-filters${filtersOpen ? ' mp-filters--open' : ''}`}>
          <div className="mp-filters-head">
            <h3>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</h3>
            <button
              type="button"
              className="mp-filters-close"
              onClick={() => setFiltersOpen(false)}
              aria-label="Close filters"
            >
              <Icon name="close" size={20} />
            </button>
          </div>

          <div className="mp-filter-group">
            <span className="mp-filter-label">Platform</span>
            <Select
              value={filters.platformId}
              onChange={(e) => { setFilters({ ...filters, platformId: e.target.value }); setPage(1); }}
            >
              <option value="">Any platform</option>
              {platforms?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </div>

          <div className="mp-filter-group">
            <span className="mp-filter-label">Niche</span>
            <Select
              value={filters.nicheId}
              onChange={(e) => { setFilters({ ...filters, nicheId: e.target.value }); setPage(1); }}
            >
              <option value="">Any niche</option>
              {niches?.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
            </Select>
          </div>

          <div className="mp-filter-group">
            <span className="mp-filter-label">Country</span>
            <input
              className="mp-filter-input"
              placeholder="e.g. United States"
              value={filters.country}
              onChange={(e) => { setFilters({ ...filters, country: e.target.value }); setPage(1); }}
            />
          </div>

          <div className="mp-filter-group">
            <span className="mp-filter-label">Min followers</span>
            <input
              className="mp-filter-input"
              type="number"
              placeholder="e.g. 10000"
              value={filters.minFollowers}
              onChange={(e) => { setFilters({ ...filters, minFollowers: e.target.value }); setPage(1); }}
            />
          </div>

          <button type="button" className="mp-clear-btn" onClick={clearFilters}>Clear all filters</button>
        </aside>

        <div>
          <div className="mp-results-meta">
            <span>
              {isFetching ? 'Updating…' : (
                <><strong>{total}</strong> creator{total !== 1 ? 's' : ''} found</>
              )}
            </span>
          </div>

          {isLoading ? (
            <div className="mp-empty"><p>Loading creators…</p></div>
          ) : creators.length === 0 ? (
            <div className="mp-empty">
              <Icon name="person_off" size={40} style={{ color: 'var(--text-3)' }} />
              <h3>No creators found</h3>
              <p>
                {tab === 'saved'
                  ? 'Save creators you like to build a shortlist for future campaigns.'
                  : 'Try widening your filters or search terms.'}
              </p>
              {tab === 'saved' && (
                <button type="button" className="btn-primary dashboard-pill-btn" onClick={() => setTab('all')}>
                  Browse all creators
                </button>
              )}
            </div>
          ) : (
            <div className="mp-list">
              {creators.map((creator) => {
                const nicheLabel = displayPageNiche(creator);
                return (
                <article
                  key={creator.id}
                  className={`mp-job-card mp-creator-card ${selectedId === creator.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(creator.id)}
                >
                  <div className="mp-creator-card-main">
                    <PageIdentity
                      page={creator}
                      subtitle={`${creator.platform?.name || 'Platform'} · ${formatCount(creator.followers)} followers`}
                    />
                    <div className="mp-creator-card-meta">
                      {creator.country && (
                        <span><Icon name="location_on" size={14} /> {creator.city ? `${creator.city}, ` : ''}{creator.country}</span>
                      )}
                      {nicheLabel !== '—' && (
                        <span><Icon name="category" size={14} /> {nicheLabel}</span>
                      )}
                      {creator.engagement > 0 && (
                        <span><Icon name="trending_up" size={14} /> {Number(creator.engagement).toFixed(1)}% eng.</span>
                      )}
                    </div>
                  </div>

                  <div className="mp-job-footer">
                    <MatchBadge score={creator.matchScore} level={creator.matchLevel} />
                    <div className="mp-creator-card-actions">
                      {creator.isSaved && <span className="mp-saved-pill">Saved</span>}
                      <Icon name="chevron_right" size={20} className="adv-collab-chevron" />
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          )}

          {tab !== 'saved' && totalPages > 1 && (
            <div className="mp-pagination">
              <button type="button" className="mp-page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <Icon name="chevron_left" size={18} />
              </button>
              {pageNumbers[0] > 1 && (
                <>
                  <button type="button" className="mp-page-btn" onClick={() => setPage(1)}>1</button>
                  {pageNumbers[0] > 2 && <span className="mp-page-ellipsis">…</span>}
                </>
              )}
              {pageNumbers.map((p) => (
                <button key={p} type="button" className={`mp-page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="mp-page-ellipsis">…</span>}
                  <button type="button" className="mp-page-btn" onClick={() => setPage(totalPages)}>{totalPages}</button>
                </>
              )}
              <button type="button" className="mp-page-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <Icon name="chevron_right" size={18} />
              </button>
            </div>
          )}
        </div>

        {selectedId && (
          <CreatorDetailPanel
            pageId={selectedId}
            onClose={() => setSelectedId(null)}
            liveCampaigns={liveCampaigns}
          />
        )}
      </div>
    </div>
  );
}
