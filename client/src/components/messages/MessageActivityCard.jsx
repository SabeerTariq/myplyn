import Icon from '../Icon';
import StatusPill from '../StatusPill';
import MediaTrigger from '../MediaViewer';
import { formatMoney } from '../../utils/creatorMetrics';
import {
  activityActorLabel,
  activityTone,
  isImagePath,
  mediaUrl,
  resolveActivityActor,
  statusLabel,
} from '../../utils/messageThread';

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function ActivityShell({
  tone,
  actorLabel,
  icon,
  title,
  time,
  children,
  variant = 'default',
}) {
  return (
    <div className={`msg-activity-row msg-activity-row--${tone}`}>
      <div className={`msg-activity-card msg-activity-card--${variant} msg-activity-card--${tone}`}>
        <div className="msg-activity-card-head">
          <span className={`msg-activity-actor msg-activity-actor--${tone}`}>{actorLabel}</span>
          <span className="msg-activity-time">{time}</span>
        </div>
        <div className="msg-activity-card-title">
          <Icon name={icon} size={18} />
          <strong>{title}</strong>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ContractCard({ collaboration, role }) {
  const gross = Number(collaboration.agreedAmount || 0);
  const fee = gross * 0.15;
  const net = gross - fee;
  const campaign = collaboration.campaign;
  const page = collaboration.page;
  const tone = 'system';

  return (
    <ActivityShell
      tone={tone}
      actorLabel="System"
      icon="handshake"
      title="Collaboration contract"
      time={formatTime(collaboration.createdAt)}
      variant="contract"
    >
      <dl className="msg-contract-dl">
        <div><dt>Campaign</dt><dd>{campaign?.name || '—'}</dd></div>
        <div><dt>{role === 'CREATOR' ? 'Brand' : 'Creator page'}</dt>
          <dd>{role === 'CREATOR' ? (campaign?.advertiser?.companyName || '—') : (page?.name || '—')}</dd>
        </div>
        <div><dt>Agreed amount</dt><dd><strong>{formatMoney(gross)}</strong></dd></div>
        <div><dt>Platform fee</dt><dd>{formatMoney(fee)} (15%)</dd></div>
        <div><dt>{role === 'CREATOR' ? 'You receive' : 'Creator receives'}</dt>
          <dd><strong>{formatMoney(net)}</strong></dd>
        </div>
        <div><dt>Source</dt>
          <dd>{collaboration.source === 'INVITATION' ? 'Direct invitation' : 'Creator proposal'}</dd>
        </div>
      </dl>
      <div className="msg-activity-card-foot">
        <StatusPill status={collaboration.status} />
      </div>
    </ActivityShell>
  );
}

export function StatusEventCard({ event, collaboration, user, role }) {
  const { userId } = resolveActivityActor({ type: 'status', data: event }, collaboration);
  const tone = activityTone(userId, user?.id);
  const actorLabel = activityActorLabel({ type: 'status', data: event }, collaboration, user?.id, role);

  return (
    <ActivityShell
      tone={tone}
      actorLabel={actorLabel}
      icon="timeline"
      title={statusLabel(event.toStatus)}
      time={formatTime(event.createdAt)}
      variant="status"
    >
      {event.notes && <p className="msg-activity-notes">{event.notes}</p>}
    </ActivityShell>
  );
}

export function ContentCard({ item, collaboration, user, role }) {
  const { userId } = resolveActivityActor({ type: 'content', data: item }, collaboration);
  const tone = activityTone(userId, user?.id);
  const actorLabel = activityActorLabel({ type: 'content', data: item }, collaboration, user?.id, role);

  return (
    <ActivityShell
      tone={tone}
      actorLabel={actorLabel}
      icon="upload_file"
      title="Brand content shared"
      time={formatTime(item.createdAt)}
      variant="content"
    >
      <div className="msg-media-stack">
        {item.url && (
          <MediaTrigger url={item.url} label={item.url} className="msg-media-link">
            <Icon name="link" size={16} />
            {item.url}
          </MediaTrigger>
        )}
        {item.filePath && (
          <MediaTrigger
            url={item.filePath}
            label={item.fileName || 'Download file'}
            className="msg-media-thumb"
          >
            {isImagePath(mediaUrl(item.filePath)) ? (
              <img src={mediaUrl(item.filePath)} alt={item.fileName || 'Attachment'} />
            ) : (
              <span className="msg-media-link" style={{ display: 'inline-flex', padding: 12 }}>
                <Icon name="attach_file" size={16} />
                {item.fileName || 'View file'}
              </span>
            )}
          </MediaTrigger>
        )}
      </div>
      {item.notes && <p className="msg-activity-notes">{item.notes}</p>}
    </ActivityShell>
  );
}

export function ProofCard({ proof, collaboration, user, role }) {
  const { userId } = resolveActivityActor({ type: 'proof', data: proof }, collaboration);
  const tone = activityTone(userId, user?.id);
  const actorLabel = activityActorLabel({ type: 'proof', data: proof }, collaboration, user?.id, role);

  return (
    <ActivityShell
      tone={tone}
      actorLabel={actorLabel}
      icon="photo_camera"
      title="Proof submitted"
      time={formatTime(proof.submittedAt)}
      variant="proof"
    >
      <div className="msg-media-stack">
        {proof.proofUrl && (
          <MediaTrigger url={proof.proofUrl} label="Live post" className="msg-media-link">
            <Icon name="open_in_new" size={16} />
            {proof.proofUrl}
          </MediaTrigger>
        )}
        {proof.screenshotPath && (
          <MediaTrigger url={proof.screenshotPath} label="Screenshot" className="msg-media-thumb">
            <img src={mediaUrl(proof.screenshotPath)} alt="Screenshot" />
          </MediaTrigger>
        )}
      </div>
      {proof.notes && <p className="msg-activity-notes">{proof.notes}</p>}
    </ActivityShell>
  );
}

export function ReviewFeedbackCard({ item, collaboration, user, role }) {
  const { userId } = resolveActivityActor({ type: 'review', data: item }, collaboration);
  const tone = activityTone(userId, user?.id);
  const actorLabel = activityActorLabel({ type: 'review', data: item }, collaboration, user?.id, role);

  return (
    <ActivityShell
      tone={tone}
      actorLabel={actorLabel}
      icon="rate_review"
      title="Changes requested"
      time={formatTime(item.createdAt)}
      variant="review"
    >
      <p className="msg-activity-notes">{item.notes}</p>
      {item.filePath && (
        <div className="msg-media-stack">
          <MediaTrigger url={item.filePath} label={item.fileName || 'Reference media'} className="msg-media-thumb">
            {isImagePath(mediaUrl(item.filePath)) ? (
              <img src={mediaUrl(item.filePath)} alt={item.fileName || 'Reference media'} />
            ) : (
              <span className="msg-media-link" style={{ display: 'inline-flex', padding: 12 }}>
                <Icon name="attach_file" size={16} />
                {item.fileName || 'View reference media'}
              </span>
            )}
          </MediaTrigger>
        </div>
      )}
    </ActivityShell>
  );
}

export default function MessageActivityCard({ item, role, user, collaboration }) {
  if (item.type === 'contract') {
    return <ContractCard collaboration={item.data} role={role} />;
  }
  if (item.type === 'status') {
    return (
      <StatusEventCard
        event={item.data}
        collaboration={collaboration}
        user={user}
        role={role}
      />
    );
  }
  if (item.type === 'content') {
    return (
      <ContentCard
        item={item.data}
        collaboration={collaboration}
        user={user}
        role={role}
      />
    );
  }
  if (item.type === 'proof') {
    return (
      <ProofCard
        proof={item.data}
        collaboration={collaboration}
        user={user}
        role={role}
      />
    );
  }
  if (item.type === 'review') {
    return (
      <ReviewFeedbackCard
        item={item.data}
        collaboration={collaboration}
        user={user}
        role={role}
      />
    );
  }

  const m = item.data;
  const mine = m.senderId === user?.id;
  const tone = mine ? 'mine' : 'partner';
  const actorLabel = mine ? 'You' : (m.sender?.email?.split('@')[0] || 'Partner');

  return (
    <div className={`msg-activity-row msg-activity-row--${tone}`}>
      <div className={`msg-activity-card msg-activity-card--message msg-activity-card--${tone}`}>
        <div className="msg-activity-card-head">
          <span className={`msg-activity-actor msg-activity-actor--${tone}`}>{actorLabel}</span>
          <span className="msg-activity-time">{formatTime(m.createdAt)}</span>
        </div>
        <div className="msg-bubble-body">{m.body}</div>
      </div>
    </div>
  );
}
