import prisma from '../lib/prisma.js';

export function sanitizeUser(user) {
  if (!user) return null;
  return { id: user.id, email: user.email, role: user.role };
}

export function sanitizeMessage(message) {
  return {
    id: message.id,
    threadId: message.threadId,
    senderId: message.senderId,
    body: message.body,
    readAt: message.readAt,
    createdAt: message.createdAt,
    sender: sanitizeUser(message.sender),
  };
}

export const MESSAGING_STATUSES = [
  'ACCEPTED',
  'CONTENT_PROVIDED',
  'PUBLISHED',
  'PROOF_SUBMITTED',
  'IN_REVIEW',
  'VERIFIED',
  'RELEASED',
  'PAID_OUT',
  'DISPUTED',
];

export function isMessagingActive(status) {
  return MESSAGING_STATUSES.includes(status);
}

export const collaborationContextInclude = {
  campaign: { include: { advertiser: { include: { user: true } } } },
  page: { include: { platform: true, creator: { include: { user: true } } } },
  content: { orderBy: { createdAt: 'asc' } },
  proofs: { orderBy: { submittedAt: 'asc' } },
  reviewFeedback: { orderBy: { createdAt: 'asc' } },
  events: { orderBy: { createdAt: 'asc' } },
};

export async function enrichCollaboration(collaboration) {
  if (!collaboration) return collaboration;

  const actorIds = [...new Set(
    (collaboration.events || []).map((e) => e.actorUserId).filter(Boolean),
  )];

  const actors = actorIds.length
    ? await prisma.user.findMany({
      where: { id: { in: actorIds } },
      select: { id: true, email: true, role: true },
    })
    : [];

  const actorMap = Object.fromEntries(actors.map((u) => [u.id, sanitizeUser(u)]));

  const advertiserUserId = collaboration.campaign?.advertiser?.userId;
  const creatorUserId = collaboration.creatorUserId
    || collaboration.page?.creator?.userId;

  return {
    ...collaboration,
    events: (collaboration.events || []).map((event) => ({
      ...event,
      actor: event.actorUserId ? actorMap[event.actorUserId] : null,
    })),
    content: (collaboration.content || []).map((item) => ({
      ...item,
      actorUserId: advertiserUserId,
      actor: advertiserUserId ? actorMap[advertiserUserId] || sanitizeUser(collaboration.campaign?.advertiser?.user) : null,
    })),
    proofs: (collaboration.proofs || []).map((proof) => ({
      ...proof,
      actorUserId: creatorUserId,
      actor: creatorUserId ? actorMap[creatorUserId] || sanitizeUser(collaboration.page?.creator?.user) : null,
    })),
    reviewFeedback: (collaboration.reviewFeedback || []).map((item) => ({
      ...item,
      actorUserId: advertiserUserId,
      actor: advertiserUserId
        ? actorMap[advertiserUserId] || sanitizeUser(collaboration.campaign?.advertiser?.user)
        : null,
    })),
  };
}

export async function sanitizeThread(thread, extras = {}) {
  const collaboration = thread.collaboration
    ? await enrichCollaboration(thread.collaboration)
    : thread.collaboration;

  return {
    id: thread.id,
    collaborationId: thread.collaborationId,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    collaboration,
    messages: thread.messages?.map(sanitizeMessage),
    unreadCount: extras.unreadCount ?? 0,
  };
}

export async function getMessagingCollaborationWhere(userId, role) {
  if (role === 'ADMIN') {
    return { status: { in: MESSAGING_STATUSES } };
  }
  if (role === 'CREATOR') {
    return { creatorUserId: userId, status: { in: MESSAGING_STATUSES } };
  }
  if (role === 'ADVERTISER') {
    const adv = await prisma.advertiserProfile.findUnique({ where: { userId } });
    if (!adv) return { id: '__none__' };
    return { campaign: { advertiserId: adv.id }, status: { in: MESSAGING_STATUSES } };
  }
  return { id: '__none__' };
}

export async function getUnreadMessageCount(userId, role) {
  const collaborationWhere = await getMessagingCollaborationWhere(userId, role);

  return prisma.message.count({
    where: {
      readAt: null,
      senderId: { not: userId },
      thread: { collaboration: collaborationWhere },
    },
  });
}

export async function getUnreadCountsByThread(threadIds, userId) {
  if (!threadIds.length) return {};

  const groups = await prisma.message.groupBy({
    by: ['threadId'],
    where: {
      threadId: { in: threadIds },
      readAt: null,
      senderId: { not: userId },
    },
    _count: { _all: true },
  });

  return Object.fromEntries(groups.map((g) => [g.threadId, g._count._all]));
}

export async function postThreadActivityMessage(threadId, senderId, body) {
  if (!threadId || !senderId || !body?.trim()) return null;

  const message = await prisma.message.create({
    data: { threadId, senderId, body: body.trim() },
    include: { sender: true },
  });

  await prisma.messageThread.update({
    where: { id: threadId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function getThreadAccessWhere(user) {
  if (user.role === 'ADMIN') {
    return {};
  }
  if (user.role === 'CREATOR') {
    return { collaboration: { creatorUserId: user.id } };
  }
  if (user.role === 'ADVERTISER') {
    const adv = await prisma.advertiserProfile.findUnique({ where: { userId: user.id } });
    if (!adv) return { id: '__none__' };
    return { collaboration: { campaign: { advertiserId: adv.id } } };
  }
  return { id: '__none__' };
}

export async function userCanAccessCollaboration(user, collaborationId) {
  if (user.role === 'ADMIN') {
    return prisma.collaboration.findUnique({ where: { id: collaborationId } });
  }
  if (user.role === 'CREATOR') {
    return prisma.collaboration.findFirst({
      where: { id: collaborationId, creatorUserId: user.id },
    });
  }
  if (user.role === 'ADVERTISER') {
    const adv = await prisma.advertiserProfile.findUnique({ where: { userId: user.id } });
    if (!adv) return null;
    return prisma.collaboration.findFirst({
      where: { id: collaborationId, campaign: { advertiserId: adv.id } },
    });
  }
  return null;
}

export async function ensureThreadForCollaboration(collaborationId) {
  const existing = await prisma.messageThread.findUnique({ where: { collaborationId } });
  if (existing) return existing;
  return prisma.messageThread.create({ data: { collaborationId } });
}

export async function getRecipientUserId(thread, senderId) {
  const collab = thread.collaboration;
  if (!collab) return null;
  const advertiserUserId = collab.campaign?.advertiser?.userId;
  const creatorUserId = collab.creatorUserId;
  if (senderId === advertiserUserId) return creatorUserId;
  if (senderId === creatorUserId) return advertiserUserId;
  return null;
}

export async function notifyNewMessage(thread, sender, body) {
  const recipientId = await getRecipientUserId(thread, sender.id);
  if (!recipientId) return;
  const campaignName = thread.collaboration?.campaign?.name || 'Collaboration';
  const { createNotification } = await import('./notificationService.js');
  await createNotification(
    recipientId,
    'message',
    `New message — ${campaignName}`,
    body.slice(0, 120),
    { threadId: thread.id, collaborationId: thread.collaborationId },
  );
}
