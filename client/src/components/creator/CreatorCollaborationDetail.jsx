import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from '../Icon';
import StatusPill from '../StatusPill';
import WorkflowTimeline from '../WorkflowTimeline';
import Modal from '../Modal';
import CollaborationMessagesLink from '../CollaborationMessagesLink';
import MediaTrigger from '../MediaViewer';
import { PageIdentity } from './creatorUi';
import { formatMoney } from '../../utils/creatorMetrics';
import { collaborationsApi } from '../../services/api';
import '../../styles/creator-collabs.css';

function StatusBanner({ collab }) {
  const status = collab.status;

  if (['REQUESTED', 'ACCEPTED', 'APPLICATION_PENDING'].includes(status)) {
    return (
      <div className="cr-collab-alert cr-collab-alert--info">
        <Icon name="hourglass_top" size={20} />
        <div>
          <strong>Waiting for brand assets</strong>
          <span>The advertiser will upload creative briefs and content for you to publish.</span>
        </div>
      </div>
    );
  }

  if (status === 'CONTENT_PROVIDED') {
    return (
      <div className="cr-collab-alert cr-collab-alert--warn">
        <Icon name="campaign" size={20} />
        <div>
          <strong>Ready to publish</strong>
          <span>Review the brand&apos;s content, publish your post, then mark it as published here.</span>
        </div>
      </div>
    );
  }

  if (status === 'PUBLISHED') {
    return (
      <div className="cr-collab-alert cr-collab-alert--warn">
        <Icon name="photo_camera" size={20} />
        <div>
          <strong>Submit proof of publication</strong>
          <span>Share the live post URL and a screenshot so the brand can verify and release payment.</span>
        </div>
      </div>
    );
  }

  if (['PROOF_SUBMITTED', 'IN_REVIEW'].includes(status)) {
    return (
      <div className="cr-collab-alert cr-collab-alert--info">
        <Icon name="fact_check" size={20} />
        <div>
          <strong>Proof under brand review</strong>
          <span>The advertiser is verifying your post. You&apos;ll be notified when payment is released.</span>
        </div>
      </div>
    );
  }

  if (['VERIFIED', 'RELEASED', 'PAID_OUT'].includes(status)) {
    return (
      <div className="cr-collab-alert cr-collab-alert--success">
        <Icon name="payments" size={20} />
        <div>
          <strong>Collaboration complete — payment released</strong>
          <span>Your earnings are available in your wallet. Withdraw anytime from Earnings.</span>
        </div>
      </div>
    );
  }

  if (status === 'DISPUTED') {
    return (
      <div className="cr-collab-alert cr-collab-alert--danger">
        <Icon name="gavel" size={20} />
        <div>
          <strong>Dispute in progress</strong>
          <span>Our team is reviewing this collaboration. We&apos;ll update you when resolved.</span>
        </div>
      </div>
    );
  }

  return null;
}

function InfoRow({ label, children }) {
  return (
    <div className="cr-collab-info-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function CreatorCollaborationDetailView({ collaborationId }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showProof, setShowProof] = useState(false);
  const [proofForm, setProofForm] = useState({ proofUrl: '', notes: '' });
  const [proofFile, setProofFile] = useState(null);
  const [actionError, setActionError] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['collab', collaborationId],
    queryFn: () => collaborationsApi.get(collaborationId).then((r) => r.data.collaboration),
  });

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: ['collab', collaborationId] });
    await qc.invalidateQueries({ queryKey: ['cre-collabs'] });
    await qc.invalidateQueries({ queryKey: ['earnings'] });
  };

  const publishMut = useMutation({
    mutationFn: () => collaborationsApi.markPublished(collaborationId),
    onSuccess: invalidate,
    onError: (err) => setActionError(err.response?.data?.error || 'Failed to mark as published'),
  });

  const proofMut = useMutation({
    mutationFn: () => collaborationsApi.submitProof(collaborationId, proofForm, proofFile),
    onSuccess: async (res) => {
      await invalidate();
      setShowProof(false);
      setProofForm({ proofUrl: '', notes: '' });
      setProofFile(null);
      const threadId = res.data?.threadId;
      if (threadId) navigate(`/creator/messages/${threadId}`);
    },
    onError: (err) => setActionError(err.response?.data?.error || 'Failed to submit proof'),
  });

  if (isLoading) {
    return (
      <div className="cr-collab-detail cr-collab-detail--loading">
        <div className="cr-collab-skeleton" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="cr-collab-empty">
        <p>Collaboration not found.</p>
        <Link to="/creator/collaborations" className="btn-primary dashboard-pill-btn">Back to collaborations</Link>
      </div>
    );
  }

  const c = data;
  const gross = Number(c.agreedAmount || 0);
  const fee = gross * 0.15;
  const net = gross - fee;
  const latestProof = c.proofs?.[c.proofs.length - 1];
  const latestReview = c.reviewFeedback?.[c.reviewFeedback.length - 1];
  const isPaid = ['VERIFIED', 'RELEASED', 'PAID_OUT'].includes(c.status);

  return (
    <div className="cr-collab-detail cc-animate-fade">
      <Link to="/creator/collaborations" className="cr-collab-back">
        <Icon name="arrow_back" size={18} />
        Collaborations
      </Link>

      {actionError && <p className="cr-form-error">{actionError}</p>}

      <div className="cr-collab-detail-hero">
        <div>
          <StatusPill status={c.status} />
          <h1>{c.campaign?.name || 'Campaign'}</h1>
          <p className="cr-collab-detail-lead">
            {c.campaign?.advertiser?.companyName || 'Brand'} · You earn {formatMoney(net)}
          </p>
          <CollaborationMessagesLink
            collaborationId={collaborationId}
            basePath="/creator/messages"
            status={c.status}
            prominent={['CONTENT_PROVIDED', 'PUBLISHED', 'PROOF_SUBMITTED', 'IN_REVIEW'].includes(c.status)}
          />
        </div>
        {c.page && <PageIdentity page={c.page} subtitle={c.page.platform?.name} />}
      </div>

      <StatusBanner collab={c} />

      <div className="cr-collab-detail-actions">
        {c.status === 'CONTENT_PROVIDED' && (
          <button
            type="button"
            className="btn-primary dashboard-pill-btn"
            disabled={publishMut.isPending}
            onClick={() => publishMut.mutate()}
          >
            <Icon name="check_circle" size={16} />
            {publishMut.isPending ? 'Saving…' : 'Mark as published'}
          </button>
        )}
        {c.status === 'PUBLISHED' && (
          <button type="button" className="btn-primary dashboard-pill-btn" onClick={() => setShowProof(true)}>
            <Icon name="upload_file" size={16} />
            Submit proof
          </button>
        )}
        {isPaid && (
          <Link to="/creator/earnings" className="btn-primary dashboard-pill-btn">
            <Icon name="payments" size={16} />
            View earnings
          </Link>
        )}
        <Link to="/creator/marketplace" className="chip-btn">
          <Icon name="storefront" size={16} />
          Marketplace
        </Link>
      </div>

      <div className="cr-collab-detail-grid">
        <section className="cr-collab-panel">
          <h3>Workflow</h3>
          <WorkflowTimeline events={c.events} currentStatus={c.status} />
        </section>

        <section className="cr-collab-panel">
          <h3>Your earnings</h3>
          <dl className="cr-collab-info">
            <InfoRow label="Agreed amount"><strong>{formatMoney(gross)}</strong></InfoRow>
            <InfoRow label="Platform fee (15%)">−{formatMoney(fee)}</InfoRow>
            <InfoRow label="You receive"><strong style={{ color: 'var(--accent-text)' }}>{formatMoney(net)}</strong></InfoRow>
            <InfoRow label="Source">{c.source === 'INVITATION' ? 'Brand invitation' : 'Your proposal'}</InfoRow>
            <InfoRow label="Page used">{c.page?.name || '—'}</InfoRow>
          </dl>

          {c.campaign?.description && (
            <>
              <h3 style={{ marginTop: 20 }}>Campaign brief</h3>
              <p className="cr-collab-muted">{c.campaign.description}</p>
            </>
          )}
        </section>
      </div>

      {(c.content?.length > 0 || latestProof || latestReview || c.campaign?.requirements) && (
        <div className="cr-collab-detail-grid">
          {c.content?.length > 0 && (
            <section className="cr-collab-panel">
              <h3>Brand content & assets</h3>
              <ul className="cr-collab-asset-list">
                {c.content.map((item) => (
                  <li key={item.id}>
                    {item.url ? (
                      <MediaTrigger url={item.url} label={item.url} className="text-accent-link">
                        {item.url}
                      </MediaTrigger>
                    ) : item.filePath ? (
                      <MediaTrigger url={item.filePath} label={item.fileName || 'Uploaded file'} className="text-accent-link">
                        {item.fileName || 'View brand file'}
                      </MediaTrigger>
                    ) : (
                      <span>{item.fileName || 'Uploaded file'}</span>
                    )}
                    {item.notes && <p className="cr-collab-muted">{item.notes}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {c.campaign?.requirements && (
            <section className="cr-collab-panel">
              <h3>Requirements</h3>
              <p className="cr-collab-muted">{c.campaign.requirements}</p>
            </section>
          )}

          {latestProof && (
            <section className="cr-collab-panel">
              <h3>Your submitted proof</h3>
              <dl className="cr-collab-info">
                <InfoRow label="Post URL">
                  <MediaTrigger url={latestProof.proofUrl} label="Live post" className="text-accent-link">
                    {latestProof.proofUrl}
                  </MediaTrigger>
                </InfoRow>
                {latestProof.screenshotPath && (
                  <InfoRow label="Screenshot">
                    <MediaTrigger url={latestProof.screenshotPath} label="Proof screenshot" className="text-accent-link">
                      View screenshot
                    </MediaTrigger>
                  </InfoRow>
                )}
                {latestProof.notes && <InfoRow label="Notes">{latestProof.notes}</InfoRow>}
                <InfoRow label="Submitted">
                  {new Date(latestProof.submittedAt).toLocaleString()}
                </InfoRow>
              </dl>
            </section>
          )}
          {latestReview && (
            <section className="cr-collab-panel">
              <h3>Brand review feedback</h3>
              <p className="cr-collab-muted">{latestReview.notes}</p>
              {latestReview.filePath && (
                <MediaTrigger url={latestReview.filePath} label={latestReview.fileName || 'Reference media'} className="text-accent-link" style={{ display: 'inline-block', marginTop: 8 }}>
                  {latestReview.fileName || 'View reference media'}
                </MediaTrigger>
              )}
              <p className="cr-collab-muted" style={{ marginTop: 10, fontSize: 12 }}>
                Update your post and resubmit proof when ready.
              </p>
            </section>
          )}
        </div>
      )}

      <Modal open={showProof} onClose={() => setShowProof(false)} title="Submit proof of publication">
        <div className="cr-collab-modal-form">
          <p className="cr-collab-muted">
            Share the live post URL and optionally a screenshot. The brand will review and release your payment.
          </p>
          <div>
            <label className="label">Live post URL</label>
            <input
              className="input"
              type="url"
              required
              placeholder="https://instagram.com/p/…"
              value={proofForm.proofUrl}
              onChange={(e) => setProofForm({ ...proofForm, proofUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Screenshot (optional)</label>
            <input type="file" className="input" accept="image/*" onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Any context for the brand reviewer…"
              value={proofForm.notes}
              onChange={(e) => setProofForm({ ...proofForm, notes: e.target.value })}
            />
          </div>
          <button
            type="button"
            className="btn-primary dashboard-pill-btn"
            disabled={proofMut.isPending || !proofForm.proofUrl.trim()}
            onClick={() => proofMut.mutate()}
          >
            {proofMut.isPending ? 'Submitting…' : 'Submit proof'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
