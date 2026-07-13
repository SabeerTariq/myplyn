import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from '../Icon';
import Select from '../Select';
import MediaTrigger from '../MediaViewer';
import { marketplaceApi, pagesApi, taxonomyApi } from '../../services/api';
import { getPageNumbers } from '../../utils/pagination';
import '../../styles/marketplace.css';

const SAVED_KEY = 'myplyn-saved-campaigns';
const PAGE_SIZE = 10;

function loadSavedIds() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
  } catch {
    return [];
  }
}

function persistSavedIds(ids) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
}

function formatMoney(value) {
  const n = Number(value || 0);
  return n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n.toLocaleString()}`;
}

function MatchBadge({ score, level }) {
  if (!score) return null;
  const label = level === 'high' ? 'Best match' : level === 'medium' ? 'Good match' : 'Possible match';
  return (
    <span className={`mp-match-badge mp-match-badge--${level || 'low'}`}>
      <Icon name="auto_awesome" size={14} />
      {label} · {score}%
    </span>
  );
}

function CampaignDetailPanel({ campaignId, onClose, pages }) {
  const qc = useQueryClient();
  const [applyForm, setApplyForm] = useState({ pageId: '', message: '', proposedPrice: '' });
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['marketplace-campaign', campaignId],
    queryFn: () => marketplaceApi.campaign(campaignId).then((r) => r.data.campaign),
    enabled: !!campaignId,
  });

  useEffect(() => {
    if (data?.bestMatchingPage?.id && !applyForm.pageId) {
      setApplyForm((f) => ({ ...f, pageId: data.bestMatchingPage.id, proposedPrice: String(data.perPlacement || data.budgetTotal || '') }));
    }
  }, [data, applyForm.pageId]);

  const applyMut = useMutation({
    mutationFn: () => marketplaceApi.apply({
      campaignId: data.id,
      pageId: applyForm.pageId,
      message: applyForm.message,
      proposedPrice: parseFloat(applyForm.proposedPrice),
    }),
    onSuccess: () => {
      setApplySuccess(true);
      qc.invalidateQueries({ queryKey: ['marketplace'] });
      qc.invalidateQueries({ queryKey: ['marketplace-campaign', campaignId] });
      qc.invalidateQueries({ queryKey: ['applications'] });
    },
    onError: (err) => setApplyError(err.response?.data?.error || 'Application failed'),
  });

  if (!campaignId) return null;

  if (isLoading) {
    return (
      <aside className="mp-detail">
        <div className="mp-detail-body"><p className="text-muted">Loading campaign…</p></div>
      </aside>
    );
  }

  if (!data) return null;

  const verifiedPages = pages?.pages?.filter((p) => p.verificationStatus === 'VERIFIED') || [];

  return (
    <aside className="mp-detail">
      <div className="mp-detail-header">
        <button type="button" className="mp-mobile-detail-back" onClick={onClose}>
          <Icon name="arrow_back" size={18} /> Back to results
        </button>
        <h2 className="mp-job-title" style={{ marginBottom: 10 }}>{data.name}</h2>
        <div className="mp-job-meta" style={{ paddingBottom: 16 }}>
          <span><Icon name="business" size={15} /> {data.advertiser?.companyName || 'Brand'}</span>
          <span><Icon name="schedule" size={15} /> {data.postedAgo || 'Recently'}</span>
          <span><Icon name="group" size={15} /> {data.applicationCount} proposals</span>
        </div>
      </div>

      <div className="mp-detail-body">
        <div style={{ marginBottom: 14 }}>
          <MatchBadge score={data.matchScore} level={data.matchLevel} />
        </div>

        <div className="mp-detail-stats">
          <div className="mp-stat-box">
            <span>Budget</span>
            <strong>{formatMoney(data.budgetTotal)}</strong>
          </div>
          <div className="mp-stat-box">
            <span>Per placement</span>
            <strong>{data.perPlacement ? formatMoney(data.perPlacement) : '—'}</strong>
          </div>
        </div>

        {data.matchReasons?.length > 0 && (
          <div className="mp-detail-section">
            <h4>Why this matches you</h4>
            <div className="mp-job-tags">
              {data.matchReasons.map((r) => <span key={r} className="mp-tag">{r}</span>)}
            </div>
          </div>
        )}

        <div className="mp-job-tags" style={{ marginBottom: 18 }}>
          {data.platforms?.map((p) => (
            <span key={p.platformId || p.platform?.id} className="mp-tag mp-tag--platform">{p.platform?.name}</span>
          ))}
          {data.niches?.map((n) => (
            <span key={n.nicheId || n.niche?.id} className="mp-tag">{n.niche?.name}</span>
          ))}
        </div>

        <div className="mp-detail-section">
          <h4>About this campaign</h4>
          <p>{data.description || 'No description provided.'}</p>
        </div>

        {data.requirements && (
          <div className="mp-detail-section">
            <h4>Requirements</h4>
            <p>{data.requirements}</p>
          </div>
        )}

        {data.assets?.length > 0 && (
          <div className="mp-detail-section">
            <h4>Campaign assets</h4>
            <div className="mp-asset-grid">
              {data.assets.map((asset) => {
                const url = asset.filePath || asset.url;
                const label = asset.fileName || asset.name || 'Asset';
                const isImage = /\.(jpe?g|png|gif|webp)$/i.test(url || '');
                return (
                  <MediaTrigger key={asset.id} url={url} label={label} className="mp-asset-tile">
                    {isImage ? (
                      <>
                        <img src={url} alt={label} />
                        <span>{label}</span>
                      </>
                    ) : (
                      <span style={{ display: 'block', padding: 16 }}>{label}</span>
                    )}
                  </MediaTrigger>
                );
              })}
            </div>
          </div>
        )}

        {data.alreadyApplied || applySuccess ? (
          <div className="mp-stat-box" style={{ background: 'var(--accent-soft)', borderColor: 'color-mix(in oklch, var(--accent) 25%, var(--border))' }}>
            <span>Status</span>
            <strong style={{ color: 'var(--accent-text)' }}>
              {applySuccess ? 'Proposal submitted!' : 'Already applied'}
            </strong>
            {applySuccess && (
              <Link to="/creator/proposals" className="text-accent-link" style={{ display: 'block', marginTop: 8, fontSize: 13, fontWeight: 700 }}>
                View my proposals →
              </Link>
            )}
          </div>
        ) : (
          <form
            className="mp-apply-form"
            onSubmit={(e) => {
              e.preventDefault();
              setApplyError('');
              applyMut.mutate();
            }}
          >
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Submit a proposal</h4>

            {verifiedPages.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--warn)' }}>
                You need a verified page to apply. <Link to="/creator/pages/new">List a page →</Link>
              </p>
            ) : (
              <>
                <div>
                  <label htmlFor="apply-page">Your page</label>
                  <Select
                    id="apply-page"
                    required
                    value={applyForm.pageId}
                    onChange={(e) => setApplyForm({ ...applyForm, pageId: e.target.value })}
                  >
                    <option value="">Select page</option>
                    {verifiedPages.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} · {p.platform?.name}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label htmlFor="apply-price">Your price ($)</label>
                  <input
                    id="apply-price"
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={applyForm.proposedPrice}
                    onChange={(e) => setApplyForm({ ...applyForm, proposedPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="apply-pitch">Cover letter</label>
                  <textarea
                    id="apply-pitch"
                    placeholder="Explain why you're a great fit for this campaign…"
                    value={applyForm.message}
                    onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                  />
                </div>
                {applyError && <p style={{ color: 'var(--bad)', fontSize: 13, margin: 0 }}>{applyError}</p>}
                <button type="submit" className="btn-primary dashboard-pill-btn" disabled={applyMut.isPending}>
                  {applyMut.isPending ? 'Submitting…' : 'Submit proposal'}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </aside>
  );
}

export default function CreatorMarketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState('best');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState('best_match');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedIds, setSavedIds] = useState(loadSavedIds);
  const [filters, setFilters] = useState({
    platformId: '',
    nicheId: '',
    country: '',
    minBudget: '',
    maxPrice: '',
  });

  useEffect(() => {
    const campaignId = searchParams.get('campaign');
    if (campaignId) {
      setSelectedId(campaignId);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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
  const { data: pages } = useQuery({
    queryKey: ['pages'],
    queryFn: () => pagesApi.list().then((r) => r.data),
  });

  const queryParams = useMemo(() => ({
    q: search || undefined,
    view: tab === 'best' ? 'best' : 'all',
    sort: tab === 'best' ? 'best_match' : sort,
    page: tab === 'saved' ? 1 : page,
    limit: tab === 'saved' ? 100 : PAGE_SIZE,
    platformId: filters.platformId || undefined,
    nicheId: filters.nicheId || undefined,
    country: filters.country || undefined,
    minBudget: filters.minBudget || undefined,
    maxPrice: filters.maxPrice || undefined,
  }), [search, tab, sort, page, filters]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['marketplace', queryParams],
    queryFn: () => marketplaceApi.campaigns(queryParams).then((r) => r.data),
    placeholderData: (prev) => prev,
  });

  const campaigns = useMemo(() => {
    if (tab !== 'saved') return data?.campaigns || [];
    const all = data?.campaigns || [];
    return all.filter((c) => savedIds.includes(c.id));
  }, [data, tab, savedIds]);

  const total = tab === 'saved' ? campaigns.length : (data?.total || 0);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const displayedCampaigns = tab === 'saved'
    ? campaigns.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : campaigns;
  const savedTotalPages = Math.max(1, Math.ceil(campaigns.length / PAGE_SIZE));

  const toggleSaved = (e, id) => {
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      persistSavedIds(next);
      return next;
    });
  };

  const clearFilters = () => {
    setFilters({ platformId: '', nicheId: '', country: '', minBudget: '', maxPrice: '' });
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  const activeFilterCount = [
    filters.platformId,
    filters.nicheId,
    filters.country,
    filters.minBudget,
    filters.maxPrice,
    search,
  ].filter(Boolean).length;

  return (
    <div className="mp-page cc-animate-fade">
      <div className="dashboard-page-header" style={{ marginBottom: 8 }}>
        <div>
          <h1 className="page-title">Campaign Marketplace</h1>
          <p className="dashboard-page-lead">
            Browse brand campaigns, filter by niche and platform, and submit proposals — like Upwork for creators.
          </p>
        </div>
        <div className="dashboard-page-actions">
          <Link to="/creator/proposals" className="btn-ghost dashboard-pill-btn">My proposals</Link>
          <Link to="/creator/invitations" className="btn-ghost dashboard-pill-btn">Invitations</Link>
        </div>
      </div>

      <div className="mp-toolbar">
        <button
          type="button"
          className="mp-filter-toggle"
          onClick={() => setFiltersOpen(true)}
        >
          <Icon name="tune" size={18} />
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
        <form
          className="mp-search-wrap"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(searchInput.trim());
            setPage(1);
          }}
        >
          <Icon name="search" size={20} />
          <input
            className="mp-search"
            placeholder="Search campaigns, brands, or keywords…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        {tab !== 'best' && tab !== 'saved' && (
          <Select className="select--compact mp-sort" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
            <option value="newest">Newest first</option>
            <option value="best_match">Best match</option>
            <option value="budget_high">Highest budget</option>
            <option value="budget_low">Lowest budget</option>
          </Select>
        )}
      </div>

      <div className="mp-tabs">
        {[
          { key: 'best', label: 'Best matches' },
          { key: 'all', label: 'All campaigns' },
          { key: 'saved', label: `Saved (${savedIds.length})` },
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
            <div className="mp-filter-chips mp-filter-chips--scroll">
              <button
                type="button"
                className={`mp-chip ${!filters.nicheId ? 'active' : ''}`}
                onClick={() => { setFilters({ ...filters, nicheId: '' }); setPage(1); }}
              >
                All
              </button>
              {niches?.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`mp-chip ${filters.nicheId === n.id ? 'active' : ''}`}
                  onClick={() => { setFilters({ ...filters, nicheId: n.id }); setPage(1); }}
                >
                  {n.name}
                </button>
              ))}
            </div>
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
            <span className="mp-filter-label">Budget range ($)</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input
                className="mp-filter-input"
                type="number"
                placeholder="Min budget"
                value={filters.minBudget}
                onChange={(e) => { setFilters({ ...filters, minBudget: e.target.value }); setPage(1); }}
              />
              <input
                className="mp-filter-input"
                type="number"
                placeholder="Max budget"
                value={filters.maxPrice}
                onChange={(e) => { setFilters({ ...filters, maxPrice: e.target.value }); setPage(1); }}
              />
            </div>
          </div>

          <button type="button" className="mp-clear-btn" onClick={clearFilters}>Clear all filters</button>
        </aside>

        <div>
          <div className="mp-results-meta">
            <span>
              {isFetching ? 'Updating…' : (
                <><strong>{total}</strong> campaign{total !== 1 ? 's' : ''} found</>
              )}
            </span>
            {data?.creatorPageCount === 0 && (
              <Link to="/creator/pages/new" style={{ color: 'var(--accent-text)', fontWeight: 700, fontSize: 13 }}>
                Add a page for better matches →
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="mp-empty"><p>Loading campaigns…</p></div>
          ) : campaigns.length === 0 ? (
            <div className="mp-empty">
              <Icon name="work_off" size={40} style={{ color: 'var(--text-3)' }} />
              <h3>No campaigns found</h3>
              <p>
                {tab === 'saved'
                  ? 'Save campaigns you like to review them later.'
                  : tab === 'best'
                    ? 'No strong matches yet. Try listing a verified page or browse all campaigns.'
                    : 'Try adjusting your filters or search terms.'}
              </p>
              {tab === 'best' && (
                <button type="button" className="btn-primary dashboard-pill-btn" onClick={() => setTab('all')}>
                  Browse all campaigns
                </button>
              )}
            </div>
          ) : (
            <div className="mp-list">
              {displayedCampaigns.map((c) => (
                <article
                  key={c.id}
                  className={`mp-job-card ${selectedId === c.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(c.id)}
                >
                  <div className="mp-job-top">
                    <h3 className="mp-job-title">{c.name}</h3>
                    <button
                      type="button"
                      className={`mp-job-save ${savedIds.includes(c.id) ? 'saved' : ''}`}
                      onClick={(e) => toggleSaved(e, c.id)}
                      aria-label={savedIds.includes(c.id) ? 'Unsave' : 'Save'}
                    >
                      <Icon name={savedIds.includes(c.id) ? 'bookmark' : 'bookmark_border'} size={22} filled={savedIds.includes(c.id)} />
                    </button>
                  </div>

                  <div className="mp-job-meta">
                    <span><Icon name="verified" size={15} /> {c.advertiser?.companyName || 'Brand'}</span>
                    <span><Icon name="schedule" size={15} /> Posted {c.postedAgo || 'recently'}</span>
                    <span><Icon name="group" size={15} /> {c.applicationCount || 0} proposals</span>
                    {c.alreadyApplied && <span style={{ color: 'var(--accent-text)', fontWeight: 700 }}>Applied</span>}
                  </div>

                  <p className="mp-job-desc">{c.description || c.requirements || 'No description available.'}</p>

                  <div className="mp-job-tags">
                    {c.platforms?.slice(0, 3).map((p) => (
                      <span key={p.platformId || p.platform?.id} className="mp-tag mp-tag--platform">{p.platform?.name}</span>
                    ))}
                    {c.niches?.slice(0, 3).map((n) => (
                      <span key={n.nicheId || n.niche?.id} className="mp-tag">{n.niche?.name}</span>
                    ))}
                  </div>

                  <div className="mp-job-footer">
                    <MatchBadge score={c.matchScore} level={c.matchLevel} />
                    <div className="mp-budget">
                      {formatMoney(c.budgetTotal)}
                      {c.perPlacement && <small> · {formatMoney(c.perPlacement)}/post</small>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {((tab === 'saved' && savedTotalPages > 1) || (tab !== 'saved' && totalPages > 1)) && (
            <div className="mp-pagination">
              <button type="button" className="mp-page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <Icon name="chevron_left" size={18} />
              </button>
              {(() => {
                const pages = tab === 'saved' ? getPageNumbers(page, savedTotalPages) : getPageNumbers(page, totalPages);
                const lastPage = tab === 'saved' ? savedTotalPages : totalPages;
                return (
                  <>
                    {pages[0] > 1 && (
                      <>
                        <button type="button" className="mp-page-btn" onClick={() => setPage(1)}>1</button>
                        {pages[0] > 2 && <span className="mp-page-ellipsis">…</span>}
                      </>
                    )}
                    {pages.map((p) => (
                      <button key={p} type="button" className={`mp-page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>
                        {p}
                      </button>
                    ))}
                    {pages[pages.length - 1] < lastPage && (
                      <>
                        {pages[pages.length - 1] < lastPage - 1 && <span className="mp-page-ellipsis">…</span>}
                        <button type="button" className="mp-page-btn" onClick={() => setPage(lastPage)}>{lastPage}</button>
                      </>
                    )}
                  </>
                );
              })()}
              <button
                type="button"
                className="mp-page-btn"
                disabled={page >= (tab === 'saved' ? savedTotalPages : totalPages)}
                onClick={() => setPage((p) => p + 1)}
              >
                <Icon name="chevron_right" size={18} />
              </button>
            </div>
          )}
        </div>

        {selectedId && (
          <CampaignDetailPanel
            campaignId={selectedId}
            onClose={() => setSelectedId(null)}
            pages={pages}
          />
        )}
      </div>
    </div>
  );
}
