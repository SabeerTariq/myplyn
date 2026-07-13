import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from '../Icon';
import StatusPill from '../StatusPill';
import Modal, { ConfirmModal } from '../Modal';
import CollaborationMessagesLink from '../CollaborationMessagesLink';
import { PageIdentity } from '../creator/creatorUi';
import { formatCount, formatMoney } from '../../utils/creatorMetrics';
import { formatProposalDate, proposalStatusLabel, formatBidDelta } from '../../utils/proposalUtils';
import { displayPageNiche, displayPageLocation } from '../../utils/pageForm';
import { marketplaceApi, campaignsApi } from '../../services/api';
import '../../styles/proposals.css';

export default function AdvertiserProposalDetail({ proposalId }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showAccept, setShowAccept] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [declineNotes, setDeclineNotes] = useState('');
  const [actionError, setActionError] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['proposal', proposalId],
    queryFn: () => marketplaceApi.application(proposalId).then((r) => r.data),
  });

  const invalidate = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ['proposal', proposalId] }),
      qc.invalidateQueries({ queryKey: ['adv-proposals'] }),
      qc.invalidateQueries({ queryKey: ['adv-collabs'] }),
      qc.invalidateQueries({ queryKey: ['adv-campaigns'] }),
    ]);
  };

  const acceptMut = useMutation({
    mutationFn: () => {
      const campaignId = data?.application?.campaignId;
      if (!campaignId) throw new Error('Campaign not found');
      return campaignsApi.approveApplication(campaignId, proposalId);
    },
    onSuccess: async (res) => {
      await invalidate();
      setShowAccept(false);
      setActionError('');
      const collabId = res.data?.collaborationId;
      if (collabId) navigate(`/advertiser/collaborations/${collabId}`);
      else navigate('/advertiser/collaborations');
    },
    onError: (err) => setActionError(err.response?.data?.error || 'Failed to accept proposal'),
  });

  const declineMut = useMutation({
    mutationFn: () => {
      const campaignId = data?.application?.campaignId;
      if (!campaignId) throw new Error('Campaign not found');
      return campaignsApi.rejectApplication(
        campaignId,
        proposalId,
        declineNotes.trim() || undefined,
      );
    },
    onSuccess: async () => {
      await invalidate();
      setShowDecline(false);
      setDeclineNotes('');
      setActionError('');
    },
    onError: (err) => setActionError(err.response?.data?.error || 'Failed to decline proposal'),
  });

  if (isLoading) {
    return <div className="prop-detail-page prop-detail-page--loading"><div className="prop-skeleton" /></div>;
  }

  if (isError || !data?.application) {
    return (
      <div className="prop-list-empty">
        <p>Proposal not found.</p>
        <Link to="/advertiser/proposals" className="btn-primary dashboard-pill-btn">Back to proposals</Link>
      </div>
    );
  }

  const proposal = data.application;
  const collaboration = data.collaboration;
  const campaign = proposal.campaign;
  const page = proposal.page;
  const isPending = proposal.status === 'PENDING';
  const bidDelta = formatBidDelta(proposal.proposedPrice, campaign?.perPlacement);

  const statusMessage = isPending
    ? 'Accept to start a collaboration and provide campaign assets, or decline with optional feedback.'
    : proposal.status === 'APPROVED'
      ? 'Provide promotional content so the creator can publish your campaign.'
      : proposal.status === 'REJECTED'
        ? 'The creator has been notified.'
        : null;

  return (
    <div className="prop-detail-page cc-animate-fade">
      <Link to="/advertiser/proposals" className="prop-back">
        <Icon name="arrow_back" size={18} />
        Proposals
      </Link>

      <div className="prop-detail-page-hero">
        <div className="prop-detail-hero-main">
          {page ? (
            <PageIdentity
              page={page}
              subtitle={`${campaign?.name || 'Campaign'} · ${formatProposalDate(proposal.createdAt)}`}
            />
          ) : (
            <div>
              <h1>{campaign?.name || 'Creator proposal'}</h1>
              <p className="prop-detail-page-lead">{formatProposalDate(proposal.createdAt)}</p>
            </div>
          )}
          <div className="prop-detail-hero-badges">
            <StatusPill status={proposal.status} label={proposalStatusLabel(proposal.status)} />
            {bidDelta && (
              <span className={`prop-bid-delta prop-bid-delta--${bidDelta.tone}`}>{bidDelta.label}</span>
            )}
          </div>
        </div>

        <div className="prop-detail-actions-bar">
          {isPending && (
            <>
              <button type="button" className="btn-primary dashboard-pill-btn" onClick={() => setShowAccept(true)}>
                Accept
              </button>
              <button type="button" className="chip-btn" onClick={() => setShowDecline(true)}>Decline</button>
            </>
          )}
          {proposal.status === 'APPROVED' && collaboration && (
            <>
              <Link to={`/advertiser/collaborations/${collaboration.id}`} className="btn-primary dashboard-pill-btn">
                View collaboration
              </Link>
              <CollaborationMessagesLink collaborationId={collaboration.id} basePath="/advertiser/messages" />
            </>
          )}
          {campaign?.id && (
            <Link to={`/advertiser/campaigns/${campaign.id}`} className="chip-btn">
              <Icon name="campaign" size={16} />
              Campaign
            </Link>
          )}
        </div>
      </div>

      {actionError && <p className="cr-form-error">{actionError}</p>}

      {statusMessage && (
        <div className={`prop-alert prop-alert--${isPending ? 'warn' : proposal.status === 'APPROVED' ? 'success' : 'danger'}`}>
          <Icon name={isPending ? 'person_search' : proposal.status === 'APPROVED' ? 'check_circle' : 'cancel'} size={18} />
          <div>
            <strong>
              {isPending ? 'Awaiting your decision' : proposal.status === 'APPROVED' ? 'Proposal accepted' : 'Proposal declined'}
            </strong>
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      <div className="prop-detail-page-grid">
        <section className="prop-detail-panel">
          <h3>Creator & cover letter</h3>
          {page && (
            <dl className="prop-info-dl">
              <div><dt>Platform</dt><dd>{page.platform?.name || '—'}</dd></div>
              <div><dt>Followers</dt><dd>{formatCount(page.followers)}</dd></div>
              <div><dt>Engagement</dt><dd>{page.engagement ? `${Number(page.engagement).toFixed(1)}%` : '—'}</dd></div>
              <div><dt>Reach</dt><dd>{page.avgReach ? formatCount(page.avgReach) : '—'}</dd></div>
              <div><dt>Location</dt><dd>{displayPageLocation(page)}</dd></div>
              <div><dt>Niche</dt><dd>{displayPageNiche(page)}</dd></div>
            </dl>
          )}
          <h4>Cover letter</h4>
          <p className="prop-cover-letter">{proposal.message?.trim() || 'No cover letter provided.'}</p>
        </section>

        <section className="prop-detail-panel">
          <h3>Proposal terms</h3>
          <div className="prop-detail-stats">
            <div className="prop-stat-box">
              <span>Proposed bid</span>
              <strong>{formatMoney(proposal.proposedPrice)}</strong>
            </div>
            <div className="prop-stat-box">
              <span>Campaign budget</span>
              <strong>{formatMoney(campaign?.budgetTotal)}</strong>
            </div>
          </div>
          {campaign?.perPlacement && (
            <p className="prop-muted">Per placement: {formatMoney(campaign.perPlacement)}</p>
          )}
          {campaign?.description && (
            <>
              <h4>Campaign overview</h4>
              <p className="prop-muted">{campaign.description}</p>
            </>
          )}
          {campaign?.requirements && (
            <>
              <h4>Requirements</h4>
              <p className="prop-muted">{campaign.requirements}</p>
            </>
          )}
        </section>
      </div>

      <ConfirmModal
        open={showAccept}
        onClose={() => setShowAccept(false)}
        onConfirm={() => acceptMut.mutate()}
        title="Accept this proposal?"
        message={`Start a collaboration with ${page?.name || 'this creator'} for ${formatMoney(proposal.proposedPrice)}? Funds will be held in escrow when the collaboration is accepted.`}
        confirmLabel={acceptMut.isPending ? 'Accepting…' : 'Accept & start collaboration'}
      />

      <Modal open={showDecline} onClose={() => setShowDecline(false)} title="Decline proposal">
        <div className="prop-modal-form">
          <p className="prop-muted">Optional feedback helps creators improve future proposals.</p>
          <div>
            <label className="label" htmlFor="decline-notes">Message to creator (optional)</label>
            <textarea
              id="decline-notes"
              className="input"
              rows={4}
              placeholder="Why wasn't this a match?"
              value={declineNotes}
              onChange={(e) => setDeclineNotes(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn-primary dashboard-pill-btn"
            disabled={declineMut.isPending}
            onClick={() => declineMut.mutate()}
          >
            {declineMut.isPending ? 'Declining…' : 'Decline proposal'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
