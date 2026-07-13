import { COLLAB_STATUS_LABELS } from '../config/navigation';

export const MESSAGING_STATUSES = [
  'ACCEPTED', 'CONTENT_PROVIDED', 'PUBLISHED', 'PROOF_SUBMITTED',
  'IN_REVIEW', 'VERIFIED', 'RELEASED', 'PAID_OUT', 'DISPUTED',
];

export function isMessagingActive(status) {
  return MESSAGING_STATUSES.includes(status);
}

export function isMessagingWorkspace(status) {
  return status && status !== 'ACCEPTED' && isMessagingActive(status);
}

// Statuses that get their own dedicated card (contract/content/proof) or are
// noise/auto-transitions, so we should NOT also render a status-event card.
const STATUS_EVENTS_WITH_DEDICATED_CARD = new Set([
  'REQUESTED',
  'APPLICATION_PENDING',
  'ACCEPTED', // shown as the contract card
  'CONTENT_PROVIDED', // shown as the content card
  'PROOF_SUBMITTED', // shown as the proof card
  'IN_REVIEW', // auto system transition, not user-meaningful
  'VERIFIED', // collapsed into the single "Paid out" milestone
  'RELEASED', // collapsed into the single "Paid out" milestone
]);

// Legacy auto-narration messages (now replaced by structured cards). Filtered
// out so pre-existing threads don't show duplicate activity bubbles.
const LEGACY_ACTIVITY_PREFIXES = ['📎', '✅', '📸', '💰', '↩️', '🤝', '🚀'];

function isLegacyActivityMessage(message) {
  const body = message?.body?.trimStart() || '';
  return LEGACY_ACTIVITY_PREFIXES.some((prefix) => body.startsWith(prefix));
}

export function buildThreadFeed(collaboration, messages = []) {
  const realMessages = (messages || []).filter((m) => !isLegacyActivityMessage(m));

  if (!collaboration) return realMessages.map((m) => ({ type: 'message', at: m.createdAt, data: m }));

  const items = [];

  items.push({
    type: 'contract',
    at: collaboration.createdAt,
    data: collaboration,
  });

  (collaboration.events || []).forEach((event) => {
    if (STATUS_EVENTS_WITH_DEDICATED_CARD.has(event.toStatus)) return;
    if (event.toStatus === 'PUBLISHED' && event.notes?.startsWith('Changes requested')) return;
    items.push({ type: 'status', at: event.createdAt, data: event });
  });

  (collaboration.content || []).forEach((item) => {
    items.push({ type: 'content', at: item.createdAt, data: item });
  });

  (collaboration.proofs || []).forEach((proof) => {
    items.push({ type: 'proof', at: proof.submittedAt, data: proof });
  });

  (collaboration.reviewFeedback || []).forEach((item) => {
    items.push({ type: 'review', at: item.createdAt, data: item });
  });

  realMessages.forEach((m) => {
    items.push({ type: 'message', at: m.createdAt, data: m });
  });

  return items.sort((a, b) => new Date(a.at) - new Date(b.at));
}

export function statusLabel(status) {
  return COLLAB_STATUS_LABELS[status]?.label || status?.replace(/_/g, ' ') || '—';
}

export function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

export function isImagePath(path) {
  if (!path) return false;
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(path);
}

export function actorDisplayName(actor, collaboration, currentUserId, role) {
  if (!actor?.id && !actor) return 'System';

  const userId = actor?.id || actor;
  if (userId === currentUserId) return 'You';

  const advertiserUserId = collaboration?.campaign?.advertiser?.userId;
  const creatorUserId = collaboration?.creatorUserId || collaboration?.page?.creator?.userId;

  if (userId === advertiserUserId) {
    return collaboration?.campaign?.advertiser?.companyName || 'Brand';
  }
  if (userId === creatorUserId) {
    return collaboration?.page?.name || actor?.email?.split('@')[0] || 'Creator';
  }
  if (actor?.role === 'ADMIN') return 'Admin';
  return actor?.email?.split('@')[0] || 'Partner';
}

/** @returns {'mine' | 'partner' | 'system'} */
export function activityTone(actorUserId, currentUserId) {
  if (!actorUserId) return 'system';
  if (actorUserId === currentUserId) return 'mine';
  return 'partner';
}

export function resolveActivityActor(item, collaboration) {
  if (item.type === 'message') {
    return {
      userId: item.data.senderId,
      actor: item.data.sender,
      label: null,
    };
  }
  if (item.type === 'contract') {
    return { userId: null, actor: null, label: 'System' };
  }
  if (item.type === 'status') {
    return {
      userId: item.data.actorUserId,
      actor: item.data.actor,
      label: item.data.actorUserId ? null : 'System',
    };
  }
  if (item.type === 'content' || item.type === 'proof' || item.type === 'review') {
    return {
      userId: item.data.actorUserId,
      actor: item.data.actor,
      label: null,
    };
  }
  return { userId: null, actor: null, label: 'System' };
}

export function activityActorLabel(item, collaboration, currentUserId, role) {
  const { userId, actor, label } = resolveActivityActor(item, collaboration);
  if (label) return label;
  return actorDisplayName(actor || userId, collaboration, currentUserId, role);
}
