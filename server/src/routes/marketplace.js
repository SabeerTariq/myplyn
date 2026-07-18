import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { createCollaborationFromInvitation } from '../services/collaborationWorkflow.js';
import { createNotification } from '../services/notificationService.js';
import {
  buildCampaignWhere,
  buildCreatorWhere,
  filterCampaignsByCountry,
  scoreCampaignMatch,
  scoreCreatorMatch,
  sortCampaigns,
  sortCreators,
} from '../services/marketplaceService.js';

const router = Router();

const campaignInclude = {
  advertiser: true,
  platforms: { include: { platform: true } },
  niches: { include: { niche: true } },
  targeting: true,
  _count: { select: { applications: true, collaborations: true } },
};

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const {
    country,
    city,
    platformId,
    nicheId,
    minFollowers,
    maxPrice,
    minBudget,
    minPerPlacement,
    q,
    sort = 'best_match',
    view = 'best',
    page = 1,
    limit = 20,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

  const where = buildCampaignWhere({ q, platformId, nicheId, country, minBudget, maxPrice, minPerPlacement });

  let creatorPages = [];
  let appliedCampaignIds = new Set();

  if (req.user.role === 'CREATOR') {
    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        pages: { include: { platform: true, niche: true, niches: { include: { niche: true } } } },
      },
    });
    creatorPages = creator?.pages || [];

    const applications = await prisma.campaignApplication.findMany({
      where: { creatorUserId: req.user.id },
      select: { campaignId: true },
    });
    appliedCampaignIds = new Set(applications.map((a) => a.campaignId));
  }

  const allCampaigns = await prisma.campaign.findMany({
    where,
    include: campaignInclude,
    orderBy: { createdAt: 'desc' },
  });

  let campaigns = filterCampaignsByCountry(allCampaigns, country);

  if (city) {
    const cityNeedle = String(city).toLowerCase();
    campaigns = campaigns.filter((c) => {
      let cities = [];
      try {
        cities = c.targeting?.cities ? JSON.parse(c.targeting.cities) : [];
      } catch {
        cities = [];
      }
      return cities.length === 0 || cities.map((x) => x.toLowerCase()).includes(cityNeedle);
    });
  }

  if (minFollowers && creatorPages.length > 0) {
    const min = parseInt(minFollowers, 10);
    campaigns = campaigns.filter((c) => creatorPages.some((p) => p.followers >= min));
  }

  campaigns = campaigns.map((c) => {
    const match = scoreCampaignMatch(c, creatorPages, appliedCampaignIds);
    return {
      ...c,
      ...match,
      applicationCount: c._count?.applications || 0,
      collaborationCount: c._count?.collaborations || 0,
      alreadyApplied: appliedCampaignIds.has(c.id),
      _count: undefined,
    };
  });

  if (view === 'best') {
    campaigns = campaigns.filter((c) => c.matchScore >= 25);
  }

  campaigns = sortCampaigns(campaigns, view === 'best' ? 'best_match' : sort);

  const total = campaigns.length;
  const start = (pageNum - 1) * limitNum;
  const paged = campaigns.slice(start, start + limitNum);

  res.json({
    campaigns: paged,
    total,
    page: pageNum,
    limit: limitNum,
    filters: { q, country, city, platformId, nicheId, minBudget, maxPrice, minPerPlacement, sort },
    creatorPageCount: creatorPages.filter((p) => p.verificationStatus === 'VERIFIED').length,
  });
}));

router.get('/campaigns/:id', authenticate, asyncHandler(async (req, res) => {
  const campaign = await prisma.campaign.findFirst({
    where: { id: req.params.id, status: 'LIVE' },
    include: {
      ...campaignInclude,
      assets: true,
      applications: req.user.role === 'CREATOR'
        ? { where: { creatorUserId: req.user.id } }
        : false,
    },
  });

  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

  let match = {};
  if (req.user.role === 'CREATOR') {
    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: req.user.id },
      include: { pages: { include: { platform: true, niche: true } } },
    });
    const applications = await prisma.campaignApplication.findMany({
      where: { creatorUserId: req.user.id },
      select: { campaignId: true },
    });
    match = scoreCampaignMatch(
      campaign,
      creator?.pages || [],
      new Set(applications.map((a) => a.campaignId)),
    );
  }

  res.json({
    campaign: {
      ...campaign,
      ...match,
      applicationCount: campaign._count?.applications || 0,
      collaborationCount: campaign._count?.collaborations || 0,
      alreadyApplied: (campaign.applications?.length || 0) > 0,
      _count: undefined,
    },
  });
}));

router.get('/creators', authenticate, requireRole('ADVERTISER'), asyncHandler(async (req, res) => {
  const {
    country,
    city,
    platformId,
    nicheId,
    minFollowers,
    q,
    sort = 'best_match',
    page = 1,
    limit = 20,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const where = buildCreatorWhere({ country, city, platformId, nicheId, minFollowers, q });

  const adv = await prisma.advertiserProfile.findUnique({
    where: { userId: req.user.id },
    include: {
      campaigns: {
        where: { status: 'LIVE' },
        include: {
          platforms: { include: { platform: true } },
          niches: { include: { niche: true } },
          targeting: true,
        },
      },
    },
  });

  const saved = await prisma.savedCreator.findMany({
    where: { advertiserId: adv?.id },
    select: { creatorUserId: true },
  });
  const savedIds = new Set(saved.map((s) => s.creatorUserId));

  const allCreators = await prisma.creatorPage.findMany({
    where,
    include: { platform: true, niche: true, niches: { include: { niche: true } }, creator: { include: { user: true } } },
    orderBy: { createdAt: 'desc' },
  });

  let creators = allCreators.map((c) => {
    const match = scoreCreatorMatch(c, adv?.campaigns || []);
    return {
      ...c,
      ...match,
      isSaved: savedIds.has(c.creator?.userId),
    };
  });

  creators = sortCreators(creators, sort);

  const total = creators.length;
  const start = (pageNum - 1) * limitNum;
  const paged = creators.slice(start, start + limitNum);

  res.json({
    creators: paged,
    total,
    page: pageNum,
    limit: limitNum,
    savedCount: savedIds.size,
    liveCampaignCount: adv?.campaigns?.length || 0,
  });
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

  let extras = {};
  if (req.user.role === 'ADVERTISER') {
    const adv = await prisma.advertiserProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        campaigns: {
          where: { status: 'LIVE' },
          include: {
            platforms: { include: { platform: true } },
            niches: { include: { niche: true } },
            targeting: true,
          },
        },
      },
    });
    const saved = await prisma.savedCreator.findFirst({
      where: { advertiserId: adv?.id, creatorUserId: page.creator?.userId },
    });
    extras = {
      ...scoreCreatorMatch(page, adv?.campaigns || []),
      isSaved: !!saved,
      liveCampaignCount: adv?.campaigns?.length || 0,
    };
  }

  res.json({ page: { ...page, ...extras } });
}));

router.post('/apply', authenticate, requireRole('CREATOR'), asyncHandler(async (req, res) => {
  const data = z.object({
    campaignId: z.string().uuid(),
    pageId: z.string().uuid(),
    message: z.string().optional(),
    proposedPrice: z.number().positive(),
  }).parse(req.body);

  const page = await prisma.creatorPage.findFirst({
    where: { id: data.pageId, creator: { userId: req.user.id } },
  });
  if (!page) return res.status(404).json({ error: 'Page not found' });
  if (page.verificationStatus !== 'VERIFIED') {
    return res.status(400).json({ error: 'Only verified pages can apply to campaigns' });
  }

  const existing = await prisma.campaignApplication.findFirst({
    where: {
      campaignId: data.campaignId,
      creatorUserId: req.user.id,
      pageId: data.pageId,
    },
  });
  if (existing) {
    return res.status(409).json({ error: 'You have already submitted a proposal for this campaign with this page' });
  }

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

  const existingInvite = await prisma.collaborationInvitation.findFirst({
    where: {
      campaignId: data.campaignId,
      creatorUserId: data.creatorUserId,
      pageId: data.pageId,
      status: 'PENDING',
    },
  });
  if (existingInvite) {
    return res.status(409).json({ error: 'An invitation is already pending for this creator' });
  }

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
    include: {
      campaign: { include: { advertiser: true, platforms: { include: { platform: true } } } },
      page: { include: { platform: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ applications });
}));

router.get('/proposals', authenticate, requireRole('ADVERTISER'), asyncHandler(async (req, res) => {
  const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
  if (!adv) return res.json({ applications: [] });

  const applications = await prisma.campaignApplication.findMany({
    where: { campaign: { advertiserId: adv.id } },
    include: {
      campaign: { include: { advertiser: true, platforms: { include: { platform: true } } } },
      page: { include: { platform: true, niche: true, niches: { include: { niche: true } }, creator: { include: { user: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ applications });
}));

const applicationInclude = {
  campaign: { include: { advertiser: true, platforms: { include: { platform: true } } } },
  page: { include: { platform: true, niche: true, creator: { include: { user: true } } } },
};

router.get('/applications/:id', authenticate, asyncHandler(async (req, res) => {
  const application = await prisma.campaignApplication.findUnique({
    where: { id: req.params.id },
    include: applicationInclude,
  });
  if (!application) return res.status(404).json({ error: 'Proposal not found' });

  if (req.user.role === 'CREATOR') {
    if (application.creatorUserId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } else if (req.user.role === 'ADVERTISER') {
    const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
    if (!adv || application.campaign.advertiserId !== adv.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } else if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const collaboration = await prisma.collaboration.findFirst({
    where: {
      campaignId: application.campaignId,
      creatorUserId: application.creatorUserId,
      pageId: application.pageId,
    },
    include: { events: { orderBy: { createdAt: 'desc' }, take: 5 } },
  });

  res.json({ application, collaboration });
}));

async function cleanupPendingCollaboration(application) {
  const collab = await prisma.collaboration.findFirst({
    where: {
      campaignId: application.campaignId,
      creatorUserId: application.creatorUserId,
      pageId: application.pageId,
      status: 'APPLICATION_PENDING',
    },
  });
  if (!collab) return;
  await prisma.collaboration.delete({ where: { id: collab.id } });
}

router.delete('/applications/:id', authenticate, requireRole('CREATOR'), asyncHandler(async (req, res) => {
  const application = await prisma.campaignApplication.findFirst({
    where: { id: req.params.id, creatorUserId: req.user.id },
  });
  if (!application) return res.status(404).json({ error: 'Proposal not found' });
  if (application.status !== 'PENDING') {
    return res.status(400).json({ error: 'Only pending proposals can be withdrawn' });
  }

  await cleanupPendingCollaboration(application);
  await prisma.campaignApplication.delete({ where: { id: application.id } });
  res.json({ success: true });
}));

router.get('/saved', authenticate, requireRole('ADVERTISER'), asyncHandler(async (req, res) => {
  const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
  const saved = await prisma.savedCreator.findMany({
    where: { advertiserId: adv?.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ saved, creatorUserIds: saved.map((s) => s.creatorUserId) });
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

router.delete('/saved/:creatorUserId', authenticate, requireRole('ADVERTISER'), asyncHandler(async (req, res) => {
  const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
  await prisma.savedCreator.deleteMany({
    where: { advertiserId: adv?.id, creatorUserId: req.params.creatorUserId },
  });
  res.json({ success: true });
}));

export default router;
