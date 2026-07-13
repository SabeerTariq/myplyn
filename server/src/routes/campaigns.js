import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { upload } from '../middleware/upload.js';
import { fundWallet, getOrCreateWallet } from '../services/walletService.js';
import { createNotification } from '../services/notificationService.js';

const router = Router();

router.use(authenticate, requireRole('ADVERTISER'));

async function getAdvertiser(req) {
  const profile = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
  if (!profile) throw Object.assign(new Error('Advertiser profile not found'), { status: 404 });
  return profile;
}

router.get('/', asyncHandler(async (req, res) => {
  const advertiser = await getAdvertiser(req);
  const { status, page = 1, limit = 20 } = req.query;
  const where = { advertiserId: advertiser.id };
  if (status) where.status = status;

  const [campaigns, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      include: { platforms: { include: { platform: true } }, niches: { include: { niche: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    }),
    prisma.campaign.count({ where }),
  ]);

  res.json({ campaigns, total, page: parseInt(page), limit: parseInt(limit) });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const advertiser = await getAdvertiser(req);
  const campaign = await prisma.campaign.findFirst({
    where: { id: req.params.id, advertiserId: advertiser.id },
    include: {
      targeting: true,
      assets: true,
      platforms: { include: { platform: true } },
      niches: { include: { niche: true } },
      applications: { include: { page: { include: { platform: true, creator: true } } } },
      invitations: { include: { page: { include: { platform: true } } } },
      collaborations: { include: { page: true, events: { orderBy: { createdAt: 'asc' } } } },
    },
  });
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  res.json({ campaign });
}));

router.post('/', asyncHandler(async (req, res) => {
  const advertiser = await getAdvertiser(req);
  const data = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    requirements: z.string().optional(),
  }).parse(req.body);

  const campaign = await prisma.campaign.create({
    data: { ...data, advertiserId: advertiser.id, status: 'DRAFT', wizardStep: 1 },
  });
  res.status(201).json({ campaign });
}));

router.patch('/:id/wizard', asyncHandler(async (req, res) => {
  const advertiser = await getAdvertiser(req);
  const campaign = await prisma.campaign.findFirst({
    where: { id: req.params.id, advertiserId: advertiser.id },
  });
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

  const { step, ...data } = req.body;
  const updateData = { wizardStep: step || campaign.wizardStep };

  if (data.name) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.requirements !== undefined) updateData.requirements = data.requirements;
  if (data.budgetTotal !== undefined) updateData.budgetTotal = data.budgetTotal;
  if (data.perPlacement !== undefined) updateData.perPlacement = data.perPlacement;
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);

  if (data.countries || data.cities) {
    await prisma.campaignTargeting.upsert({
      where: { campaignId: campaign.id },
      create: {
        campaignId: campaign.id,
        countries: JSON.stringify(data.countries || []),
        cities: JSON.stringify(data.cities || []),
      },
      update: {
        countries: JSON.stringify(data.countries || []),
        cities: JSON.stringify(data.cities || []),
      },
    });
  }

  if (data.nicheIds) {
    await prisma.campaignNiche.deleteMany({ where: { campaignId: campaign.id } });
    await prisma.campaignNiche.createMany({
      data: data.nicheIds.map((nicheId) => ({ campaignId: campaign.id, nicheId })),
    });
  }

  if (data.platformIds) {
    await prisma.campaignPlatform.deleteMany({ where: { campaignId: campaign.id } });
    await prisma.campaignPlatform.createMany({
      data: data.platformIds.map((platformId) => ({ campaignId: campaign.id, platformId })),
    });
  }

  const updated = await prisma.campaign.update({
    where: { id: campaign.id },
    data: updateData,
    include: {
      targeting: true,
      assets: true,
      platforms: { include: { platform: true } },
      niches: { include: { niche: true } },
    },
  });

  res.json({ campaign: updated });
}));

router.post('/:id/publish', asyncHandler(async (req, res) => {
  const advertiser = await getAdvertiser(req);
  const campaign = await prisma.campaign.findFirst({
    where: { id: req.params.id, advertiserId: advertiser.id },
  });
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

  const budget = Number(campaign.budgetTotal);
  if (budget <= 0) return res.status(400).json({ error: 'Budget required' });

  const wallet = await getOrCreateWallet('ADVERTISER', advertiser.id);
  if (Number(wallet.balance) < budget) {
    if (process.env.PAYMENTS_MOCK === 'true') {
      await fundWallet('ADVERTISER', advertiser.id, budget, 'Mock campaign funding');
    } else {
      return res.status(400).json({ error: 'Insufficient wallet balance. Add funds first.' });
    }
  }

  const w = await getOrCreateWallet('ADVERTISER', advertiser.id);
  await prisma.wallet.update({
    where: { id: w.id },
    data: {
      balance: { decrement: budget },
      heldBalance: { increment: budget },
    },
  });

  const updated = await prisma.campaign.update({
    where: { id: campaign.id },
    data: { status: 'LIVE', budgetHeld: budget },
  });

  res.json({ campaign: updated });
}));

router.post('/:id/pause', asyncHandler(async (req, res) => {
  const advertiser = await getAdvertiser(req);
  const updated = await prisma.campaign.updateMany({
    where: { id: req.params.id, advertiserId: advertiser.id },
    data: { status: 'PAUSED' },
  });
  if (!updated.count) return res.status(404).json({ error: 'Campaign not found' });
  res.json({ success: true });
}));

router.post('/:id/close', asyncHandler(async (req, res) => {
  const advertiser = await getAdvertiser(req);
  const updated = await prisma.campaign.updateMany({
    where: { id: req.params.id, advertiserId: advertiser.id },
    data: { status: 'CLOSED' },
  });
  if (!updated.count) return res.status(404).json({ error: 'Campaign not found' });
  res.json({ success: true });
}));

router.post('/:id/assets', upload.single('file'), asyncHandler(async (req, res) => {
  req.uploadType = 'campaigns';
  const advertiser = await getAdvertiser(req);
  const campaign = await prisma.campaign.findFirst({
    where: { id: req.params.id, advertiserId: advertiser.id },
  });
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const asset = await prisma.campaignAsset.create({
    data: {
      campaignId: campaign.id,
      filePath: `/uploads/campaigns/${req.file.filename}`,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
    },
  });
  res.status(201).json({ asset });
}));

router.post('/:id/applications/:appId/approve', asyncHandler(async (req, res) => {
  const advertiser = await getAdvertiser(req);
  const application = await prisma.campaignApplication.findFirst({
    where: { id: req.params.appId, campaign: { advertiserId: advertiser.id } },
  });
  if (!application) return res.status(404).json({ error: 'Application not found' });

  await prisma.campaignApplication.update({
    where: { id: application.id },
    data: { status: 'APPROVED' },
  });

  const { createCollaborationFromApplication, transitionCollaboration } = await import('../services/collaborationWorkflow.js');
  const collab = await createCollaborationFromApplication(application);
  await transitionCollaboration(collab.id, 'ACCEPTED', req.user, 'Application approved');

  res.json({ success: true, collaborationId: collab.id });
}));

router.post('/:id/applications/:appId/reject', asyncHandler(async (req, res) => {
  const advertiser = await getAdvertiser(req);
  const { notes } = z.object({ notes: z.string().max(500).optional() }).parse(req.body);

  const application = await prisma.campaignApplication.findFirst({
    where: { id: req.params.appId, campaign: { advertiserId: advertiser.id } },
  });
  if (!application) return res.status(404).json({ error: 'Application not found' });

  await prisma.campaignApplication.update({
    where: { id: application.id },
    data: { status: 'REJECTED' },
  });

  const collab = await prisma.collaboration.findFirst({
    where: {
      campaignId: application.campaignId,
      creatorUserId: application.creatorUserId,
      pageId: application.pageId,
      status: 'APPLICATION_PENDING',
    },
  });
  if (collab) {
    await prisma.collaboration.update({
      where: { id: collab.id },
      data: { status: 'CANCELLED' },
    });
    await prisma.collaborationEvent.create({
      data: {
        collaborationId: collab.id,
        fromStatus: 'APPLICATION_PENDING',
        toStatus: 'CANCELLED',
        actorUserId: req.user.id,
        notes: notes || 'Proposal declined',
      },
    });
  }

  await createNotification(
    application.creatorUserId,
    'application',
    'Proposal declined',
    notes || 'The brand declined your proposal for this campaign.',
    { applicationId: application.id, campaignId: application.campaignId },
  );

  res.json({ success: true });
}));

export default router;
