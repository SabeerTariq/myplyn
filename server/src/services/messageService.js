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

export function sanitizeThread(thread) {
  return {
    id: thread.id,
    collaborationId: thread.collaborationId,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
    collaboration: thread.collaboration,
    messages: thread.messages?.map(sanitizeMessage),
  };
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
