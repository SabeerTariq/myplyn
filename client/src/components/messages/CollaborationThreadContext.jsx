import { Link } from 'react-router-dom';
import Icon from '../Icon';
import StatusPill from '../StatusPill';
import MediaTrigger from '../MediaViewer';
import WorkflowTimeline from '../WorkflowTimeline';
import { PageIdentity } from '../creator/creatorUi';
import { formatMoney } from '../../utils/creatorMetrics';
import { isImagePath, isMessagingWorkspace, mediaUrl, statusLabel } from '../../utils/messageThread';

export default function CollaborationThreadContext({ collaboration, role, collabPath }) {
  if (!collaboration) return null;

  const gross = Number(collaboration.agreedAmount || 0);
  const fee = gross * 0.15;
  const net = gross - fee;
  const workspaceOpen = isMessagingWorkspace(collaboration.status);
  const content = collaboration.content || [];
  const proofs = collaboration.proofs || [];
  const latestProof = proofs[proofs.length - 1];
  const reviewFeedback = collaboration.reviewFeedback || [];
  const latestReview = reviewFeedback[reviewFeedback.length - 1];

  return (
    <aside className="msg-context-panel">
      <div className="msg-context-section">
        <h3>Status</h3>
        <StatusPill status={collaboration.status} />
        <p className="msg-context-lead">{statusLabel(collaboration.status)}</p>
        {!workspaceOpen && collaboration.status === 'ACCEPTED' && (
          <p className="msg-context-hint">
            {role === 'ADVERTISER'
              ? 'Share promotional content from the collaboration page to open this workspace.'
              : 'Waiting for the brand to share campaign assets.'}
          </p>
        )}
      </div>

      <div className="msg-context-section">
        <h3>Contract</h3>
        <dl className="msg-context-dl">
          <div><dt>Amount</dt><dd><strong>{formatMoney(gross)}</strong></dd></div>
          <div><dt>Fee (15%)</dt><dd>{formatMoney(fee)}</dd></div>
          <div><dt>{role === 'CREATOR' ? 'Your payout' : 'Creator payout'}</dt>
            <dd><strong>{formatMoney(net)}</strong></dd>
          </div>
          <div><dt>Campaign</dt><dd>{collaboration.campaign?.name || '—'}</dd></div>
        </dl>
      </div>

      {collaboration.page && (
        <div className="msg-context-section">
          <h3>{role === 'CREATOR' ? 'Your page' : 'Creator page'}</h3>
          <PageIdentity page={collaboration.page} subtitle={collaboration.page.platform?.name} />
        </div>
      )}

      {(content.length > 0 || latestProof || latestReview) && (
        <div className="msg-context-section">
          <h3>Media & assets</h3>
          <div className="msg-context-media-grid">
            {content.map((item) => (
              <MediaTrigger
                key={item.id}
                url={item.filePath || item.url}
                label={item.fileName || 'Brand content'}
                className="msg-context-media-tile"
              >
                {isImagePath(mediaUrl(item.filePath || item.url)) ? (
                  <img src={mediaUrl(item.filePath || item.url)} alt={item.fileName || 'Brand content'} />
                ) : (
                  <span className="msg-context-media-file">
                    <Icon name="description" size={22} />
                  </span>
                )}
                <span>{item.fileName || 'Brand content'}</span>
              </MediaTrigger>
            ))}
            {latestProof?.screenshotPath && (
              <MediaTrigger
                url={latestProof.screenshotPath}
                label="Proof screenshot"
                className="msg-context-media-tile"
              >
                <img src={mediaUrl(latestProof.screenshotPath)} alt="Proof screenshot" />
                <span>Proof screenshot</span>
              </MediaTrigger>
            )}
            {latestReview?.filePath && (
              <MediaTrigger
                url={latestReview.filePath}
                label={latestReview.fileName || 'Review reference'}
                className="msg-context-media-tile"
              >
                {isImagePath(mediaUrl(latestReview.filePath)) ? (
                  <img src={mediaUrl(latestReview.filePath)} alt={latestReview.fileName || 'Review reference'} />
                ) : (
                  <span className="msg-context-media-file">
                    <Icon name="rate_review" size={22} />
                  </span>
                )}
                <span>{latestReview.fileName || 'Review reference'}</span>
              </MediaTrigger>
            )}
          </div>
          {latestProof?.proofUrl && (
            <MediaTrigger url={latestProof.proofUrl} label="Live post" className="msg-context-link">
              <Icon name="open_in_new" size={14} />
              Live post
            </MediaTrigger>
          )}
        </div>
      )}

      <div className="msg-context-section">
        <h3>Workflow</h3>
        <WorkflowTimeline events={collaboration.events} currentStatus={collaboration.status} />
      </div>

      {collabPath && (
        <Link to={collabPath} className="msg-context-collab-link">
          <Icon name="handshake" size={16} />
          Open collaboration actions
        </Link>
      )}
    </aside>
  );
}
