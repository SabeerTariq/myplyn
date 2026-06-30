import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { createCollaborationFromInvitation } from '../services/collaborationWorkflow.js';
import { createNotification } from '../services/notificationService.js';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { country, city, platformId, nicheId, minFollowers, maxPrice, page = 1, limit = 20 } = req.query;

  const where = { status: 'LIVE' };
  const pagesWhere = {};

  if (country) pagesWhere.country = country;
  if (city) pagesWhere.city = city;
  if (platformId) pagesWhere.platformId = platformId;
  if (nicheId) pagesWhere.nicheId = nicheId;
  if (minFollowers) pagesWhere.followers = { gte: parseInt(minFollowers) };

  const [campaigns, total] = await Promise.all([
    prisma.campaign.findMany({
      where: {
        ...where,
        ...(maxPrice && { budgetTotal: { lte: maxPrice } }),
      },
      include: {
        advertiser: true,
        platforms: { include: { platform: true } },
        niches: { include: { niche: true } },
        targeting: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    }),
    prisma.campaign.count({ where }),
  ]);

  res.json({ campaigns, total });
}));

router.get('/creators', authenticate, requireRole('ADVERTISER'), asyncHandler(async (req, res) => {
  const { country, city, platformId, nicheId, minFollowers, page = 1, limit = 20 } = req.query;
  const where = { verificationStatus: 'VERIFIED' };
  if (country) where.country = country;
  if (city) where.city = city;
  if (platformId) where.platformId = platformId;
  if (nicheId) where.nicheId = nicheId;
  if (minFollowers) where.followers = { gte: parseInt(minFollowers) };

  const [creators, total] = await Promise.all([
    prisma.creatorPage.findMany({
      where,
      include: { platform: true, niche: true, creator: { include: { user: true } } },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    }),
    prisma.creatorPage.count({ where }),
  ]);

  res.json({ creators, total });
}));

router.get('/creators/:pageId', authenticate, asyncHandler(async (req, res) => {
  const page = await prisma.creatorPage.findUnique({
    where: { id: req.params.pageId },
    include: {
      platform: true,
      niche: true,
      creator: { include: { user: true } },
    },
  });
  if (!page) return res.status(404).json({ error: 'Not found' });
  res.json({ page });
}));

router.post('/apply', authenticate, requireRole('CREATOR'), asyncHandler(async (req, res) => {
  const data = z.object({
    campaignId: z.string().uuid(),
    pageId: z.string().uuid(),
    message: z.string().optional(),
    proposedPrice: z.number().positive(),
  }).parse(req.body);

  const application = await prisma.campaignApplication.create({
    data: {
      ...data,
      creatorUserId: req.user.id,
      proposedPrice: data.proposedPrice,
    },
  });

  const { createCollaborationFromApplication } = await import('../services/collaborationWorkflow.js');
  await createCollaborationFromApplication(application);

  const campaign = await prisma.campaign.findUnique({
    where: { id: data.campaignId },
    include: { advertiser: true },
  });
  if (campaign) {
    await createNotification(
      campaign.advertiser.userId,
      'application',
      'New campaign application',
      'A creator applied to your campaign',
      { applicationId: application.id }
    );
  }

  res.status(201).json({ application });
}));

router.post('/invite', authenticate, requireRole('ADVERTISER'), asyncHandler(async (req, res) => {
  const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
  const data = z.object({
    campaignId: z.string().uuid(),
    creatorUserId: z.string().uuid(),
    pageId: z.string().uuid(),
    message: z.string().optional(),
    offeredAmount: z.number().positive(),
  }).parse(req.body);

  const campaign = await prisma.campaign.findFirst({
    where: { id: data.campaignId, advertiserId: adv?.id },
  });
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

  const invitation = await prisma.collaborationInvitation.create({ data });
  await createCollaborationFromInvitation(invitation);

  await createNotification(
    data.creatorUserId,
    'invitation',
    'New collaboration invitation',
    'You received a collaboration request',
    { invitationId: invitation.id }
  );

  res.status(201).json({ invitation });
}));

router.get('/invitations', authenticate, requireRole('CREATOR'), asyncHandler(async (req, res) => {
  const invitations = await prisma.collaborationInvitation.findMany({
    where: { creatorUserId: req.user.id },
    include: {
      campaign: { include: { advertiser: true } },
      page: { include: { platform: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ invitations });
}));

router.post('/invitations/:id/accept', authenticate, requireRole('CREATOR'), asyncHandler(async (req, res) => {
  const invitation = await prisma.collaborationInvitation.findFirst({
    where: { id: req.params.id, creatorUserId: req.user.id },
  });
  if (!invitation) return res.status(404).json({ error: 'Not found' });

  await prisma.collaborationInvitation.update({
    where: { id: invitation.id },
    data: { status: 'ACCEPTED' },
  });

  const collab = await prisma.collaboration.findFirst({
    where: {
      campaignId: invitation.campaignId,
      creatorUserId: invitation.creatorUserId,
      pageId: invitation.pageId,
    },
  });

  if (collab) {
    const { transitionCollaboration } = await import('../services/collaborationWorkflow.js');
    await transitionCollaboration(collab.id, 'ACCEPTED', req.user);
  }

  res.json({ success: true });
}));

router.post('/invitations/:id/reject', authenticate, requireRole('CREATOR'), asyncHandler(async (req, res) => {
  await prisma.collaborationInvitation.updateMany({
    where: { id: req.params.id, creatorUserId: req.user.id },
    data: { status: 'REJECTED' },
  });
  res.json({ success: true });
}));

router.get('/applications', authenticate, requireRole('CREATOR'), asyncHandler(async (req, res) => {
  const applications = await prisma.campaignApplication.findMany({
    where: { creatorUserId: req.user.id },
    include: { campaign: { include: { advertiser: true } }, page: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ applications });
}));

router.get('/saved', authenticate, requireRole('ADVERTISER'), asyncHandler(async (req, res) => {
  const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
  const saved = await prisma.savedCreator.findMany({
    where: { advertiserId: adv?.id },
  });
  res.json({ saved });
}));

router.post('/saved/:creatorUserId', authenticate, requireRole('ADVERTISER'), asyncHandler(async (req, res) => {
  const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
  const saved = await prisma.savedCreator.upsert({
    where: {
      advertiserId_creatorUserId: {
        advertiserId: adv.id,
        creatorUserId: req.params.creatorUserId,
      },
    },
    create: { advertiserId: adv.id, creatorUserId: req.params.creatorUserId },
    update: {},
  });
  res.json({ saved });
}));

export default router;
