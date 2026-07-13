import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from '../Icon';
import StatusPill from '../StatusPill';
import { ConfirmModal } from '../Modal';
import { PageIdentity, PageStatus, ScoreRing } from './creatorUi';
import { computeScore, formatCount, formatMoney } from '../../utils/creatorMetrics';
import { displayPageLocation, displayPageNiche } from '../../utils/pageForm';
import { pagesApi, collaborationsApi } from '../../services/api';
import '../../styles/creator-home.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function StatusBanner({ page }) {
  if (page.verificationStatus === 'VERIFIED') {
    return (
      <div className="cr-page-alert cr-page-alert--success">
        <Icon name="verified" size={20} />
        <div>
          <strong>Verified page</strong>
          <span>This page is live in the marketplace. You can apply to campaigns and receive invitations.</span>
        </div>
      </div>
    );
  }

  if (page.verificationStatus === 'PENDING') {
    return (
      <div className="cr-page-alert cr-page-alert--warn">
        <Icon name="hourglass_top" size={20} />
        <div>
          <strong>Under admin review</strong>
          <span>We&apos;re verifying your page details. This usually takes 1–2 business days.</span>
        </div>
      </div>
    );
  }

  if (page.verificationStatus === 'REJECTED') {
    return (
      <div className="cr-page-alert cr-page-alert--danger">
        <Icon name="error" size={20} />
        <div>
          <strong>Verification rejected</strong>
          <span>{page.adminNotes || 'Please update your page details and resubmit for review.'}</span>
        </div>
      </div>
    );
  }

  return null;
}

function DetailStat({ label, value, hint }) {
  return (
    <div className="cr-page-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {hint && <em>{hint}</em>}
    </div>
  );
}

function InfoRow({ label, children }) {
  return (
    <div className="cr-page-info-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function CreatorPageDetailView({ pageId }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['page', pageId],
    queryFn: () => pagesApi.get(pageId).then((r) => r.data.page),
  });

  const { data: collabsData } = useQuery({
    queryKey: ['cre-collabs'],
    queryFn: () => collaborationsApi.list().then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: () => pagesApi.remove(pageId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['pages'] });
      navigate('/creator/pages', { replace: true });
    },
    onError: (err) => {
      setDeleteError(err.response?.data?.error || 'Could not delete this page');
      setShowDelete(false);
    },
  });

  if (isLoading) {
    return (
      <div className="cr-page-detail cr-page-detail--loading">
        <div className="cr-page-detail-skeleton" />
        <div className="cr-page-detail-skeleton cr-page-detail-skeleton--short" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="cr-panel cr-empty-panel">
        <p>Page not found or you don&apos;t have access.</p>
        <Link to="/creator/pages" className="btn-primary dashboard-pill-btn">Back to My Pages</Link>
      </div>
    );
  }

  const page = data;
  const score = computeScore(page);
  const pageCollabs = (collabsData?.collaborations || []).filter((c) => c.pageId === page.id);
  const activeCollabs = pageCollabs.filter((c) => !['PAID_OUT', 'CANCELLED'].includes(c.status));
  const earnings = pageCollabs
    .filter((c) => ['PAID_OUT', 'RELEASED', 'VERIFIED'].includes(c.status))
    .reduce((sum, c) => sum + Number(c.agreedAmount || 0), 0);
  const canEdit = page.verificationStatus !== 'PENDING';
  const canDelete = activeCollabs.length === 0;

  return (
    <div className="cr-page-detail cc-animate-fade">
      <Link to="/creator/pages" className="cr-page-back">
        <Icon name="arrow_back" size={18} />
        My Pages
      </Link>

      {deleteError && <p className="cr-form-error">{deleteError}</p>}

      <div className="cr-page-hero">
        <div className="cr-page-hero-main">
          <PageIdentity
            page={page}
            subtitle={`${page.platform?.name || 'Platform'} · ${displayPageNiche(page)}`}
          />
          <PageStatus status={page.verificationStatus} />
        </div>
        <ScoreRing value={score} size={56} />
      </div>

      <StatusBanner page={page} />

      <div className="cr-page-actions-bar">
        {page.verificationStatus === 'REJECTED' ? (
          <Link to={`/creator/pages/${pageId}/edit`} className="btn-primary dashboard-pill-btn">
            Fix & resubmit
          </Link>
        ) : canEdit ? (
          <Link to={`/creator/pages/${pageId}/edit`} className="chip-btn">
            <Icon name="edit" size={16} />
            Edit page
          </Link>
        ) : (
          <button type="button" className="chip-btn" disabled title="Editing is locked while under review">
            <Icon name="edit" size={16} />
            Edit page
          </button>
        )}

        <Link to="/creator/marketplace" className="chip-btn">
          <Icon name="storefront" size={16} />
          Find campaigns
        </Link>

        <a href={page.url} target="_blank" rel="noreferrer" className="chip-btn">
          <Icon name="open_in_new" size={16} />
          View profile
        </a>

        <button
          type="button"
          className="chip-btn cr-page-delete-btn"
          onClick={() => setShowDelete(true)}
          disabled={!canDelete}
          title={canDelete ? 'Delete page' : 'Finish active collaborations before deleting'}
        >
          <Icon name="delete" size={16} />
          Delete
        </button>
      </div>

      <div className="cr-page-stat-grid">
        <DetailStat label="Followers" value={formatCount(page.followers)} />
        <DetailStat label="Avg reach" value={formatCount(page.avgReach)} />
        <DetailStat
          label="Engagement"
          value={page.engagement != null ? `${page.engagement}%` : '—'}
        />
        <DetailStat label="Active work" value={activeCollabs.length} />
        <DetailStat label="Earnings" value={formatMoney(earnings)} />
      </div>

      <div className="cr-page-detail-grid">
        <section className="cr-panel">
          <h3 className="cr-panel-title">Page details</h3>
          <dl className="cr-page-info">
            <InfoRow label="Profile URL">
              <a href={page.url} target="_blank" rel="noreferrer" className="text-accent-link">
                {page.url}
              </a>
            </InfoRow>
            <InfoRow label="Platform">{page.platform?.name || '—'}</InfoRow>
            <InfoRow label="Niche">{displayPageNiche(page)}</InfoRow>
            <InfoRow label="Audience location">{displayPageLocation(page)}</InfoRow>
            <InfoRow label="Listed on">{formatDate(page.createdAt)}</InfoRow>
            <InfoRow label="Last updated">{formatDate(page.updatedAt)}</InfoRow>
            {page.adminVerifiedAt && (
              <InfoRow label="Verified on">{formatDate(page.adminVerifiedAt)}</InfoRow>
            )}
          </dl>
        </section>

        <section className="cr-panel">
          <h3 className="cr-panel-title">Collaborations</h3>
          {pageCollabs.length === 0 ? (
            <p className="cr-page-empty-copy">
              No collaborations yet.{' '}
              <Link to="/creator/marketplace" className="text-accent-link">Browse campaigns →</Link>
            </p>
          ) : (
            <ul className="cr-page-collab-list">
              {pageCollabs.slice(0, 5).map((collab) => (
                <li key={collab.id}>
                  <Link to={`/creator/collaborations/${collab.id}`} className="cr-page-collab-item">
                    <span>{collab.campaign?.name || 'Campaign'}</span>
                    <StatusPill status={collab.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {activeCollabs.length > 0 && (
            <p className="cr-form-hint" style={{ marginTop: 12 }}>
              This page has active collaborations and cannot be deleted until they are completed.
            </p>
          )}
        </section>
      </div>

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete page?"
        message={`"${page.name}" will be permanently removed from your portfolio. This cannot be undone.`}
        confirmLabel={deleteMutation.isPending ? 'Deleting…' : 'Delete page'}
        danger
      />
    </div>
  );
}
