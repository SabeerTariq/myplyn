import prisma from '../lib/prisma.js';

export async function createNotification(userId, type, title, body, payload = {}) {
  return prisma.notification.create({
    data: { userId, type, title, body, payload },
  });
}

export async function notifyUsers(userIds, type, title, body, payload = {}) {
  const unique = [...new Set(userIds)];
  await prisma.notification.createMany({
    data: unique.map((userId) => ({ userId, type, title, body, payload })),
  });
}

export async function getBadgeCounts(userId, role) {
  const counts = {
    messages: 0,
    applications: 0,
    invitations: 0,
    collaborations: 0,
    reviewQueue: 0,
    proofsToVerify: 0,
    notifications: 0,
  };

  counts.notifications = await prisma.notification.count({
    where: { userId, readAt: null },
  });

  if (role === 'ADVERTISER') {
    const profile = await prisma.advertiserProfile.findUnique({ where: { userId } });
    if (profile) {
      counts.applications = await prisma.campaignApplication.count({
        where: { campaign: { advertiserId: profile.id }, status: 'PENDING' },
      });
      counts.proofsToVerify = await prisma.collaboration.count({
        where: {
          campaign: { advertiserId: profile.id },
          status: { in: ['PROOF_SUBMITTED', 'IN_REVIEW'] },
        },
      });
      counts.collaborations = counts.proofsToVerify;
    }
  }

  if (role === 'CREATOR') {
    counts.invitations = await prisma.collaborationInvitation.count({
      where: { creatorUserId: userId, status: 'PENDING' },
    });
    counts.collaborations = await prisma.collaboration.count({
      where: {
        creatorUserId: userId,
        status: { in: ['ACCEPTED', 'CONTENT_PROVIDED', 'PUBLISHED'] },
      },
    });
  }

  if (role === 'ADMIN') {
    counts.reviewQueue = await prisma.reviewQueueItem.count({
      where: { status: 'PENDING' },
    });
  }

  counts.messages = await getUnreadMessageCount(userId, role);

  return counts;
}

async function getUnreadMessageCount(userId, role) {
  let accessWhere = { id: '__none__' };
  if (role === 'ADMIN') {
    accessWhere = {};
  } else if (role === 'CREATOR') {
    accessWhere = { collaboration: { creatorUserId: userId } };
  } else if (role === 'ADVERTISER') {
    const adv = await prisma.advertiserProfile.findUnique({ where: { userId } });
    if (adv) accessWhere = { collaboration: { campaign: { advertiserId: adv.id } } };
  }

  return prisma.messageThread.count({
    where: {
      ...accessWhere,
      messages: { some: { readAt: null, senderId: { not: userId } } },
    },
  });
}
