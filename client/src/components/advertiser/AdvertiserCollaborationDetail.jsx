import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from '../Icon';
import StatusPill from '../StatusPill';
import WorkflowTimeline from '../WorkflowTimeline';
import Modal, { ConfirmModal } from '../Modal';
import CollaborationMessagesLink from '../CollaborationMessagesLink';
import MediaTrigger from '../MediaViewer';
import { PageIdentity } from '../creator/creatorUi';
import { formatCount, formatMoney } from '../../utils/creatorMetrics';
import { collaborationsApi } from '../../services/api';
import '../../styles/advertiser-collabs.css';

function StatusBanner({ collab }) {
  const status = collab.status;

  if (['REQUESTED', 'ACCEPTED'].includes(status)) {
    return (
      <div className="adv-collab-alert adv-collab-alert--info">
        <Icon name="upload_file" size={20} />
        <div>
          <strong>Provide campaign assets</strong>
          <span>Upload creative briefs, links, or files so the creator can publish your promotion.</span>
        </div>
      </div>
    );
  }

  if (status === 'CONTENT_PROVIDED') {
    return (
      <div className="adv-collab-alert adv-collab-alert--info">
        <Icon name="hourglass_top" size={20} />
        <div>
          <strong>Waiting for creator to publish</strong>
          <span>The creator has your assets and will mark the post as published when live.</span>
        </div>
      </div>
    );
  }

  if (status === 'PUBLISHED') {
    return (
      <div className="adv-collab-alert adv-collab-alert--info">
        <Icon name="campaign" size={20} />
        <div>
          <strong>Waiting for proof</strong>
          <span>The creator marked the post as published. They&apos;ll submit proof for your review shortly.</span>
        </div>
      </div>
    );
  }

  if (['PROOF_SUBMITTED', 'IN_REVIEW'].includes(status)) {
    return (
      <div className="adv-collab-alert adv-collab-alert--warn">
        <Icon name="fact_check" size={20} />
        <div>
          <strong>Proof ready for review</strong>
          <span>Verify the post meets your requirements, then release payment to complete the collaboration.</span>
        </div>
      </div>
    );
  }

  if (['VERIFIED', 'RELEASED', 'PAID_OUT'].includes(status)) {
    return (
      <div className="adv-collab-alert adv-collab-alert--success">
        <Icon name="check_circle" size={20} />
        <div>
          <strong>Collaboration completed</strong>
          <span>Payment has been released to the creator. Thank you for using Myplyn.</span>
        </div>
      </div>
    );
  }

  if (status === 'DISPUTED') {
    return (
      <div className="adv-collab-alert adv-collab-alert--danger">
        <Icon name="gavel" size={20} />
        <div>
          <strong>Dispute opened</strong>
          <span>Our team is reviewing this collaboration. You&apos;ll be notified of the outcome.</span>
        </div>
      </div>
    );
  }

  return null;
}

function InfoRow({ label, children }) {
  return (
    <div className="adv-collab-info-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function AdvertiserCollaborationDetailView({ collaborationId }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showVerify, setShowVerify] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showChanges, setShowChanges] = useState(false);
  const [contentForm, setContentForm] = useState({ url: '', notes: '' });
  const [contentFile, setContentFile] = useState(null);
  const [changeNotes, setChangeNotes] = useState('');
  const [changeFile, setChangeFile] = useState(null);
  const [actionError, setActionError] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['collab', collaborationId],
    queryFn: () => collaborationsApi.get(collaborationId).then((r) => r.data.collaboration),
  });

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: ['collab', collaborationId] });
    await qc.invalidateQueries({ queryKey: ['adv-collabs'] });
  };

  const contentMut = useMutation({
    mutationFn: () => collaborationsApi.provideContent(collaborationId, contentForm, contentFile),
    onSuccess: async (res) => {
      await invalidate();
      setShowContent(false);
      setContentForm({ url: '', notes: '' });
      setContentFile(null);
      const threadId = res.data?.threadId;
      if (threadId) navigate(`/advertiser/messages/${threadId}`);
    },
    onError: (err) => setActionError(err.response?.data?.error || 'Failed to upload content'),
  });

  const verifyMut = useMutation({
    mutationFn: () => collaborationsApi.verify(collaborationId),
    onSuccess: async () => {
      await invalidate();
      setShowVerify(false);
    },
    onError: (err) => setActionError(err.response?.data?.error || 'Failed to release payment'),
  });

  const changesMut = useMutation({
    mutationFn: () => collaborationsApi.requestChanges(collaborationId, changeNotes, changeFile),
    onSuccess: async (res) => {
      await invalidate();
      setShowChanges(false);
      setChangeNotes('');
      setChangeFile(null);
      const threadId = res.data?.threadId;
      if (threadId) navigate(`/advertiser/messages/${threadId}`);
    },
    onError: (err) => setActionError(err.response?.data?.error || 'Failed to request changes'),
  });

  if (isLoading) {
    return (
      <div className="adv-collab-detail adv-collab-detail--loading">
        <div className="adv-collab-skeleton" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="adv-collab-empty">
        <p>Collaboration not found.</p>
        <Link to="/advertiser/collaborations" className="btn-primary dashboard-pill-btn">Back to collaborations</Link>
      </div>
    );
  }

  const c = data;
  const gross = Number(c.agreedAmount || 0);
  const fee = gross * 0.15;
  const net = gross - fee;
  const canProvideContent = ['REQUESTED', 'ACCEPTED'].includes(c.status);
  const canReviewProof = ['PROOF_SUBMITTED', 'IN_REVIEW'].includes(c.status);
  const latestProof = c.proofs?.[c.proofs.length - 1];
  const latestReview = c.reviewFeedback?.[c.reviewFeedback.length - 1];

  return (
    <div className="adv-collab-detail cc-animate-fade">
      <Link to="/advertiser/collaborations" className="adv-collab-back">
        <Icon name="arrow_back" size={18} />
        Collaborations
      </Link>

      {actionError && <p className="cr-form-error">{actionError}</p>}

      <div className="adv-collab-detail-hero">
        <div>
          <StatusPill status={c.status} />
          <h1>{c.campaign?.name || 'Campaign'}</h1>
          <p className="adv-collab-detail-lead">
            Collaboration with {c.page?.name || 'creator'} · {formatMoney(c.agreedAmount)}
          </p>
          <CollaborationMessagesLink
            collaborationId={collaborationId}
            basePath="/advertiser/messages"
            status={c.status}
            prominent={['CONTENT_PROVIDED', 'PUBLISHED', 'PROOF_SUBMITTED', 'IN_REVIEW'].includes(c.status)}
          />
        </div>
        {c.page && <PageIdentity page={c.page} subtitle={c.page.platform?.name} />}
      </div>

      <StatusBanner collab={c} />

      <div className="adv-collab-detail-actions">
        {canProvideContent && (
          <button type="button" className="btn-primary dashboard-pill-btn" onClick={() => setShowContent(true)}>
            <Icon name="upload_file" size={16} />
            Provide content
          </button>
        )}
        {canReviewProof && (
          <>
            <button type="button" className="btn-primary dashboard-pill-btn" onClick={() => setShowVerify(true)}>
              <Icon name="payments" size={16} />
              Verify & release payment
            </button>
            <button type="button" className="chip-btn" onClick={() => setShowChanges(true)}>
              Request changes
            </button>
          </>
        )}
        {c.campaign?.id && (
          <Link to={`/advertiser/campaigns/${c.campaign.id}`} className="chip-btn">
            <Icon name="campaign" size={16} />
            View campaign
          </Link>
        )}
        {latestProof?.proofUrl && (
          <MediaTrigger url={latestProof.proofUrl} label="View proof" className="chip-btn">
            <Icon name="open_in_new" size={16} />
            View proof
          </MediaTrigger>
        )}
      </div>

      <div className="adv-collab-detail-grid">
        <section className="adv-collab-panel">
          <h3>Workflow</h3>
          <WorkflowTimeline events={c.events} currentStatus={c.status} />
        </section>

        <section className="adv-collab-panel">
          <h3>Payment breakdown</h3>
          <dl className="adv-collab-info">
            <InfoRow label="Agreed amount"><strong>{formatMoney(gross)}</strong></InfoRow>
            <InfoRow label="Platform fee (15%)">{formatMoney(fee)}</InfoRow>
            <InfoRow label="Creator receives"><strong>{formatMoney(net)}</strong></InfoRow>
            <InfoRow label="Source">{c.source === 'INVITATION' ? 'Direct invitation' : 'Creator proposal'}</InfoRow>
          </dl>

          <h3 style={{ marginTop: 20 }}>Creator page</h3>
          <dl className="adv-collab-info">
            <InfoRow label="Page">{c.page?.name || '—'}</InfoRow>
            <InfoRow label="Platform">{c.page?.platform?.name || '—'}</InfoRow>
            <InfoRow label="Followers">{c.page?.followers != null ? formatCount(c.page.followers) : '—'}</InfoRow>
          </dl>
        </section>
      </div>

      {(c.content?.length > 0 || latestProof || latestReview) && (
        <div className="adv-collab-detail-grid">
          {c.content?.length > 0 && (
            <section className="adv-collab-panel">
              <h3>Provided content</h3>
              <ul className="adv-collab-asset-list">
                {c.content.map((item) => (
                  <li key={item.id}>
                    {item.url ? (
                      <MediaTrigger url={item.url} label={item.url} className="text-accent-link">
                        {item.url}
                      </MediaTrigger>
                    ) : item.filePath ? (
                      <MediaTrigger url={item.filePath} label={item.fileName || 'Uploaded file'} className="text-accent-link">
                        {item.fileName || 'View uploaded file'}
                      </MediaTrigger>
                    ) : (
                      <span>{item.fileName || 'Uploaded file'}</span>
                    )}
                    {item.notes && <p className="adv-collab-muted">{item.notes}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {latestProof && (
            <section className="adv-collab-panel">
              <h3>Submitted proof</h3>
              <dl className="adv-collab-info">
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
            <section className="adv-collab-panel">
              <h3>Review feedback</h3>
              <p className="adv-collab-muted">{latestReview.notes}</p>
              {latestReview.filePath && (
                <MediaTrigger url={latestReview.filePath} label={latestReview.fileName || 'Reference media'} className="text-accent-link" style={{ display: 'inline-block', marginTop: 8 }}>
                  {latestReview.fileName || 'View reference media'}
                </MediaTrigger>
              )}
            </section>
          )}
        </div>
      )}

      <ConfirmModal
        open={showVerify}
        onClose={() => setShowVerify(false)}
        onConfirm={() => verifyMut.mutate()}
        title="Release payment?"
        message={`Release ${formatMoney(net)} to the creator (${formatMoney(fee)} platform fee on ${formatMoney(gross)} gross)? This action cannot be undone.`}
        confirmLabel={verifyMut.isPending ? 'Releasing…' : 'Release payment'}
      />

      <Modal open={showContent} onClose={() => setShowContent(false)} title="Provide promotional content">
        <div className="adv-collab-modal-form">
          <p className="adv-collab-muted">Share assets, links, or instructions the creator needs to publish your campaign.</p>
          <div>
            <label className="label">Content URL</label>
            <input
              className="input"
              placeholder="https://drive.google.com/…"
              value={contentForm.url}
              onChange={(e) => setContentForm({ ...contentForm, url: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Upload file (optional)</label>
            <input type="file" className="input" onChange={(e) => setContentFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <label className="label">Notes for creator</label>
            <textarea
              className="input"
              rows={3}
              placeholder="Caption guidelines, hashtags, posting window…"
              value={contentForm.notes}
              onChange={(e) => setContentForm({ ...contentForm, notes: e.target.value })}
            />
          </div>
          <button
            type="button"
            className="btn-primary dashboard-pill-btn"
            disabled={contentMut.isPending || (!contentForm.url && !contentFile)}
            onClick={() => contentMut.mutate()}
          >
            {contentMut.isPending ? 'Uploading…' : 'Send to creator'}
          </button>
        </div>
      </Modal>

      <Modal open={showChanges} onClose={() => setShowChanges(false)} title="Request changes">
        <div className="adv-collab-modal-form">
          <p className="adv-collab-muted">Send the proof back to the creator with feedback. Attach reference screenshots or files if helpful.</p>
          <div>
            <label className="label">What needs to change?</label>
            <textarea
              className="input"
              rows={4}
              required
              placeholder="Describe what needs to be fixed…"
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Reference media (optional)</label>
            <input
              type="file"
              className="input"
              accept="image/*,video/*,.pdf"
              onChange={(e) => setChangeFile(e.target.files?.[0] || null)}
            />
            {changeFile && (
              <p className="adv-collab-muted" style={{ marginTop: 6, fontSize: 12 }}>
                Selected: {changeFile.name}
              </p>
            )}
          </div>
          <button
            type="button"
            className="btn-primary dashboard-pill-btn"
            disabled={changesMut.isPending || !changeNotes.trim()}
            onClick={() => changesMut.mutate()}
          >
            {changesMut.isPending ? 'Sending…' : 'Request changes'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
