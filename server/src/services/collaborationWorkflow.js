import prisma from '../lib/prisma.js';
import { holdFunds, releasePayment } from './walletService.js';
import { createNotification } from './notificationService.js';

const TRANSITIONS = {
  REQUESTED: ['APPLICATION_PENDING', 'ACCEPTED', 'CANCELLED'],
  APPLICATION_PENDING: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['CONTENT_PROVIDED', 'CANCELLED', 'DISPUTED'],
  CONTENT_PROVIDED: ['PUBLISHED', 'DISPUTED'],
  PUBLISHED: ['PROOF_SUBMITTED', 'DISPUTED'],
  PROOF_SUBMITTED: ['IN_REVIEW'],
  IN_REVIEW: ['VERIFIED', 'PUBLISHED'],
  VERIFIED: ['RELEASED'],
  RELEASED: ['PAID_OUT'],
};

const ACTOR_RULES = {
  APPLICATION_PENDING: ['CREATOR'],
  ACCEPTED: ['ADVERTISER', 'CREATOR'],
  CONTENT_PROVIDED: ['ADVERTISER'],
  PUBLISHED: ['CREATOR'],
  PROOF_SUBMITTED: ['CREATOR'],
  IN_REVIEW: ['SYSTEM'],
  VERIFIED: ['ADVERTISER', 'ADMIN'],
  RELEASED: ['SYSTEM', 'ADVERTISER', 'ADMIN'],
  PAID_OUT: ['SYSTEM'],
  CANCELLED: ['ADVERTISER', 'CREATOR', 'ADMIN'],
  DISPUTED: ['ADVERTISER', 'CREATOR'],
};

export function canTransition(from, to) {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export async function transitionCollaboration(collaborationId, toStatus, actorUser, notes = '') {
  const collaboration = await prisma.collaboration.findUnique({
    where: { id: collaborationId },
    include: {
      campaign: { include: { advertiser: true } },
      page: { include: { creator: true } },
    },
  });

  if (!collaboration) {
    throw Object.assign(new Error('Collaboration not found'), { status: 404 });
  }

  const fromStatus = collaboration.status;
  if (!canTransition(fromStatus, toStatus)) {
    throw Object.assign(
      new Error(`Invalid transition from ${fromStatus} to ${toStatus}`),
      { status: 400 }
    );
  }

  const actorRole = actorUser?.role || 'SYSTEM';
  const allowed = ACTOR_RULES[toStatus] || [];
  if (actorRole !== 'SYSTEM' && !allowed.includes(actorRole)) {
    throw Object.assign(new Error('Not authorized for this action'), { status: 403 });
  }

  if (toStatus === 'ACCEPTED') {
    const advertiserId = collaboration.campaign.advertiserId;
    await holdFunds('ADVERTISER', advertiserId, Number(collaboration.agreedAmount), collaborationId);
  }

  if (toStatus === 'RELEASED') {
    await releasePayment(collaborationId, Number(collaboration.agreedAmount));
  }

  const updated = await prisma.collaboration.update({
    where: { id: collaborationId },
    data: { status: toStatus },
  });

  await prisma.collaborationEvent.create({
    data: {
      collaborationId,
      fromStatus,
      toStatus,
      actorUserId: actorUser?.id,
      notes,
    },
  });

  const advertiserUserId = collaboration.campaign.advertiser.userId;
  const creatorUserId = collaboration.creatorUserId;

  const notifyMap = {
    APPLICATION_PENDING: { userId: advertiserUserId, title: 'New application received' },
    ACCEPTED: { userId: creatorUserId, title: 'Collaboration accepted' },
    CONTENT_PROVIDED: { userId: creatorUserId, title: 'Promotional content provided' },
    PUBLISHED: { userId: advertiserUserId, title: 'Creator marked as published' },
    PROOF_SUBMITTED: { userId: advertiserUserId, title: 'Proof submitted for review' },
    VERIFIED: { userId: creatorUserId, title: 'Proof verified' },
    RELEASED: { userId: creatorUserId, title: 'Payment released' },
    PAID_OUT: { userId: creatorUserId, title: 'Payout completed' },
  };

  if (notifyMap[toStatus]) {
    await createNotification(
      notifyMap[toStatus].userId,
      'collaboration',
      notifyMap[toStatus].title,
      notes || `Collaboration status: ${toStatus}`,
      { collaborationId }
    );
  }

  if (toStatus === 'PROOF_SUBMITTED') {
    await transitionCollaboration(collaborationId, 'IN_REVIEW', { role: 'SYSTEM' }, 'Auto moved to review');
    return prisma.collaboration.findUnique({
      where: { id: collaborationId },
      include: { events: { orderBy: { createdAt: 'asc' } }, proofs: true, content: true },
    });
  }

  return updated;
}

export async function createCollaborationFromApplication(application) {
  const existing = await prisma.collaboration.findFirst({
    where: {
      campaignId: application.campaignId,
      creatorUserId: application.creatorUserId,
      pageId: application.pageId,
    },
  });
  if (existing) return existing;

  const collab = await prisma.collaboration.create({
    data: {
      campaignId: application.campaignId,
      creatorUserId: application.creatorUserId,
      pageId: application.pageId,
      source: 'APPLICATION',
      status: 'APPLICATION_PENDING',
      agreedAmount: application.proposedPrice,
    },
  });

  await prisma.collaborationEvent.create({
    data: {
      collaborationId: collab.id,
      toStatus: 'APPLICATION_PENDING',
      notes: 'Application submitted',
    },
  });

  await prisma.messageThread.create({ data: { collaborationId: collab.id } });
  return collab;
}

export async function createCollaborationFromInvitation(invitation) {
  const collab = await prisma.collaboration.create({
    data: {
      campaignId: invitation.campaignId,
      creatorUserId: invitation.creatorUserId,
      pageId: invitation.pageId,
      source: 'INVITATION',
      status: 'REQUESTED',
      agreedAmount: invitation.offeredAmount,
    },
  });

  await prisma.collaborationEvent.create({
    data: {
      collaborationId: collab.id,
      toStatus: 'REQUESTED',
      notes: 'Invitation sent',
    },
  });

  await prisma.messageThread.create({ data: { collaborationId: collab.id } });
  return collab;
}
