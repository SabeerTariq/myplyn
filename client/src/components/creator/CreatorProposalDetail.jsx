import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from '../Icon';
import StatusPill from '../StatusPill';
import { ConfirmModal } from '../Modal';
import { PageIdentity } from './creatorUi';
import { formatMoney } from '../../utils/creatorMetrics';
import { formatProposalDate, proposalStatusLabel } from '../../utils/proposalUtils';
import { marketplaceApi } from '../../services/api';
import '../../styles/proposals.css';

export default function CreatorProposalDetail({ proposalId }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showWithdraw, setShowWithdraw] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['proposal', proposalId],
    queryFn: () => marketplaceApi.application(proposalId).then((r) => r.data),
  });

  const withdrawMut = useMutation({
    mutationFn: () => marketplaceApi.withdrawApplication(proposalId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['applications'] });
      await qc.invalidateQueries({ queryKey: ['marketplace'] });
      await qc.invalidateQueries({ queryKey: ['cre-collabs'] });
      navigate('/creator/proposals', { replace: true });
    },
  });

  if (isLoading) {
    return <div className="prop-detail-page prop-detail-page--loading"><div className="prop-skeleton" /></div>;
  }

  if (isError || !data?.application) {
    return (
      <div className="prop-list-empty">
        <p>Proposal not found.</p>
        <Link to="/creator/proposals" className="btn-primary dashboard-pill-btn">Back to proposals</Link>
      </div>
    );
  }

  const proposal = data.application;
  const collaboration = data.collaboration;
  const campaign = proposal.campaign;
  const advertiser = campaign?.advertiser;
  const declineNote = proposal.status === 'REJECTED'
    ? collaboration?.events?.filter((e) => e.toStatus === 'CANCELLED')?.slice(-1)[0]?.notes
    : null;

  return (
    <div className="prop-detail-page cc-animate-fade">
      <Link to="/creator/proposals" className="prop-back">
        <Icon name="arrow_back" size={18} />
        Proposals
      </Link>

      <div className="prop-detail-page-hero">
        <div className="prop-detail-hero-main">
          <StatusPill status={proposal.status} label={proposalStatusLabel(proposal.status)} />
          <h1>{campaign?.name || 'Campaign'}</h1>
          <p className="prop-detail-page-lead">
            {advertiser?.companyName || 'Brand'} · Submitted {formatProposalDate(proposal.createdAt)}
          </p>
          <div className="prop-detail-kpi-strip">
            <div className="prop-detail-kpi">
              <span>Your bid</span>
              <strong>{formatMoney(proposal.proposedPrice)}</strong>
            </div>
            {campaign?.budgetTotal > 0 && (
              <div className="prop-detail-kpi">
                <span>Campaign budget</span>
                <strong>{formatMoney(campaign.budgetTotal)}</strong>
              </div>
            )}
            {campaign?.perPlacement > 0 && (
              <div className="prop-detail-kpi">
                <span>Per placement</span>
                <strong>{formatMoney(campaign.perPlacement)}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {proposal.status === 'PENDING' && (
        <div className="prop-alert prop-alert--info">
          <Icon name="hourglass_top" size={18} />
          <div>
            <strong>Awaiting advertiser review</strong>
            <span>The brand is reviewing your proposal. You&apos;ll be notified when they respond.</span>
          </div>
        </div>
      )}

      {proposal.status === 'APPROVED' && (
        <div className="prop-alert prop-alert--success">
          <Icon name="check_circle" size={18} />
          <div>
            <strong>Proposal accepted</strong>
            <span>Your collaboration has started. Track deliverables and submit proof from Collaborations.</span>
          </div>
        </div>
      )}

      {proposal.status === 'REJECTED' && (
        <div className="prop-alert prop-alert--danger">
          <Icon name="cancel" size={18} />
          <div>
            <strong>Proposal declined</strong>
            <span>{declineNote || 'This campaign wasn\'t a match. Browse other campaigns and try again.'}</span>
          </div>
        </div>
      )}

      <div className="prop-detail-actions-bar prop-detail-actions-bar--sticky">
        {proposal.status === 'PENDING' && (
          <button type="button" className="btn-ghost prop-withdraw-btn" onClick={() => setShowWithdraw(true)}>
            Withdraw proposal
          </button>
        )}
        {proposal.status === 'APPROVED' && collaboration && (
          <Link to={`/creator/collaborations/${collaboration.id}`} className="btn-primary dashboard-pill-btn">
            View collaboration
          </Link>
        )}
        {proposal.status === 'REJECTED' && (
          <Link to="/creator/marketplace" className="btn-primary dashboard-pill-btn">Browse campaigns</Link>
        )}
        {campaign?.id && (
          <Link to={`/creator/marketplace?campaign=${campaign.id}`} className="chip-btn">
            <Icon name="storefront" size={16} />
            View campaign
          </Link>
        )}
      </div>

      <div className="prop-detail-page-grid">
        <section className="prop-detail-panel">
          <h3>Your proposal</h3>
          <div className="prop-detail-stats">
            <div className="prop-stat-box">
              <span>Your bid</span>
              <strong>{formatMoney(proposal.proposedPrice)}</strong>
            </div>
            <div className="prop-stat-box">
              <span>Campaign budget</span>
              <strong>{formatMoney(campaign?.budgetTotal)}</strong>
            </div>
          </div>
          <h4>Page submitted</h4>
          {proposal.page ? (
            <div className="prop-page-chip">
              <PageIdentity page={proposal.page} subtitle={proposal.page.platform?.name} />
            </div>
          ) : null}
          <h4 style={{ marginTop: 16 }}>Cover letter</h4>
          <p className="prop-cover-letter">{proposal.message?.trim() || 'No cover letter provided.'}</p>
        </section>

        <section className="prop-detail-panel">
          <h3>Campaign details</h3>
          {campaign?.description && <p className="prop-muted">{campaign.description}</p>}
          {campaign?.requirements && (
            <>
              <h4 style={{ marginTop: 16 }}>Requirements</h4>
              <p className="prop-muted">{campaign.requirements}</p>
            </>
          )}
          {!campaign?.description && !campaign?.requirements && (
            <p className="prop-muted">No additional campaign details.</p>
          )}
        </section>
      </div>

      <ConfirmModal
        open={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        onConfirm={() => withdrawMut.mutate()}
        title="Withdraw proposal?"
        message="Your proposal will be removed and the advertiser will no longer see it. You can submit a new proposal later."
        confirmLabel={withdrawMut.isPending ? 'Withdrawing…' : 'Withdraw'}
        danger
      />
    </div>
  );
}
