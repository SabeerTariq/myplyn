import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { requirePermission } from '../middleware/rbac.js';
import { asyncHandler } from '../middleware/error.js';
import { transitionCollaboration } from '../services/collaborationWorkflow.js';
import { createNotification } from '../services/notificationService.js';
import { displayLocation, displayNiche } from '../services/pageVerificationService.js';

const router = Router();
router.use(authenticate, requireRole('ADMIN'));

router.get('/dashboard', requirePermission('dashboard.read'), asyncHandler(async (req, res) => {
  const [advertisers, creators, campaigns, disputes, revenue] = await Promise.all([
    prisma.user.count({ where: { role: 'ADVERTISER' } }),
    prisma.user.count({ where: { role: 'CREATOR' } }),
    prisma.campaign.count({ where: { status: 'LIVE' } }),
    prisma.dispute.count({ where: { status: 'OPEN' } }),
    prisma.transaction.aggregate({
      where: { type: 'COMMISSION' },
      _sum: { feeAmount: true },
    }),
  ]);

  const held = await prisma.wallet.aggregate({ _sum: { heldBalance: true } });

  res.json({
    kpis: {
      totalAdvertisers: advertisers,
      totalCreators: creators,
      activeCampaigns: campaigns,
      openDisputes: disputes,
      totalCommission: Number(revenue._sum.feeAmount || 0),
      fundsInHolding: Number(held._sum.heldBalance || 0),
    },
  });
}));

router.get('/users', requirePermission('users.read'), asyncHandler(async (req, res) => {
  const { role, status, search, page = 1, limit = 20 } = req.query;
  const where = {};
  if (role) where.role = role;
  if (status) where.status = status;
  if (search) where.email = { contains: search };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { advertiserProfile: true, creatorProfile: true },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({ users, total });
}));

router.get('/users/:id', requirePermission('users.read'), asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: {
      advertiserProfile: { include: { campaigns: true } },
      creatorProfile: { include: { pages: true } },
    },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const auditLogs = await prisma.auditLog.findMany({
    where: { entityId: req.params.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  res.json({ user, auditLogs });
}));

router.patch('/users/:id/status', requirePermission('users.write'), asyncHandler(async (req, res) => {
  const { status, reason } = z.object({
    status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'RESTRICTED']),
    reason: z.string().optional(),
  }).parse(req.body);

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { status },
  });

  await prisma.auditLog.create({
    data: {
      actorId: req.user.id,
      action: 'USER_STATUS_CHANGE',
      entityType: 'USER',
      entityId: user.id,
      metadata: { status, reason },
    },
  });

  res.json({ user });
}));

router.get('/campaigns', requirePermission('campaigns.read'), asyncHandler(async (req, res) => {
  const campaigns = await prisma.campaign.findMany({
    include: {
      advertiser: true,
      collaborations: true,
      platforms: { include: { platform: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ campaigns });
}));

router.get('/campaigns/:id', requirePermission('campaigns.read'), asyncHandler(async (req, res) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: req.params.id },
    include: {
      advertiser: true,
      applications: true,
      collaborations: { include: { events: true, proofs: true } },
    },
  });
  res.json({ campaign });
}));

router.get('/review-queue', requirePermission('review.read'), asyncHandler(async (req, res) => {
  const items = await prisma.reviewQueueItem.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
  });

  const enriched = await Promise.all(items.map(async (item) => {
    if (item.type === 'DISPUTE') {
      const dispute = await prisma.dispute.findUnique({
        where: { id: item.entityId },
        include: { collaboration: { include: { campaign: true } }, raisedBy: true },
      });
      return { ...item, dispute };
    }
    if (item.type === 'REPORT') {
      const report = await prisma.report.findUnique({
        where: { id: item.entityId },
        include: { reporter: true },
      });
      return { ...item, report };
    }
    if (item.type === 'PROOF') {
      const page = await prisma.creatorPage.findUnique({
        where: { id: item.entityId },
        include: {
          platform: true,
          niche: true,
          creator: { include: { user: true } },
        },
      });
      return { ...item, page };
    }
    return item;
  }));

  res.json({ items: enriched });
}));

router.post('/review-queue/:id/resolve', requirePermission('review.write'), asyncHandler(async (req, res) => {
  const item = await prisma.reviewQueueItem.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: 'Not found' });

  const { action, notes } = req.body;

  if (item.type === 'PROOF' && action === 'reject') {
    await prisma.creatorPage.update({
      where: { id: item.entityId },
      data: {
        verificationStatus: 'REJECTED',
        adminVerifiedAt: new Date(),
        adminNotes: notes || 'Rejected by admin review',
      },
    });
  }

  if (item.type === 'DISPUTE') {
    await prisma.dispute.update({
      where: { id: item.entityId },
      data: { status: 'RESOLVED', resolution: action, resolutionNotes: notes, resolvedAt: new Date() },
    });
  }

  if (item.type === 'REPORT') {
    await prisma.report.update({
      where: { id: item.entityId },
      data: { status: action || 'DISMISSED', resolution: notes, resolvedAt: new Date() },
    });
  }

  await prisma.reviewQueueItem.update({
    where: { id: item.id },
    data: { status: 'RESOLVED', resolvedAt: new Date() },
  });

  res.json({ success: true });
}));

router.post('/pages/:id/verify', requirePermission('review.write'), asyncHandler(async (req, res) => {
  const { status, notes } = z.object({
    status: z.enum(['VERIFIED', 'REJECTED']),
    notes: z.string().optional(),
  }).parse(req.body);

  const existing = await prisma.creatorPage.findUnique({
    where: { id: req.params.id },
    include: { creator: true, platform: true, niche: true },
  });
  if (!existing) return res.status(404).json({ error: 'Page not found' });

  const page = await prisma.creatorPage.update({
    where: { id: req.params.id },
    data: {
      verificationStatus: status,
      adminVerifiedAt: new Date(),
      adminNotes: notes,
    },
    include: { platform: true, niche: true, creator: { include: { user: true } } },
  });

  await createNotification(
    existing.creator.userId,
    'page_verification',
    status === 'VERIFIED' ? 'Page verified' : 'Page verification declined',
    status === 'VERIFIED'
      ? `Your page "${existing.name}" has been verified and is now live in the marketplace.`
      : `Your page "${existing.name}" was not approved.${notes ? ` Note: ${notes}` : ' Please update your details and resubmit.'}`,
    { pageId: page.id, status },
  );

  await prisma.auditLog.create({
    data: {
      actorId: req.user.id,
      action: 'PAGE_VERIFY',
      entityType: 'CREATOR_PAGE',
      entityId: page.id,
      metadata: { status, notes, niche: displayNiche(page), location: displayLocation(page) },
    },
  });

  res.json({ page });
}));

router.get('/finance/transactions', requirePermission('finance.read'), asyncHandler(async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json({ transactions });
}));

router.get('/finance/commissions', requirePermission('finance.read'), asyncHandler(async (req, res) => {
  const commissions = await prisma.transaction.findMany({
    where: { type: 'COMMISSION' },
    orderBy: { createdAt: 'desc' },
  });
  const total = commissions.reduce((s, t) => s + Number(t.feeAmount), 0);
  res.json({ commissions, total });
}));

router.get('/finance/payouts', requirePermission('finance.read'), asyncHandler(async (req, res) => {
  const payouts = await prisma.payout.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ payouts });
}));

router.get('/reports', requirePermission('reports.read'), asyncHandler(async (req, res) => {
  const signups = await prisma.user.groupBy({
    by: ['role'],
    _count: true,
  });

  const topNiches = await prisma.creatorPage.groupBy({
    by: ['nicheId'],
    _count: true,
    orderBy: { _count: { nicheId: 'desc' } },
    take: 10,
  });

  res.json({ signups, topNiches });
}));

router.get('/settings', requirePermission('settings.read'), asyncHandler(async (req, res) => {
  const settings = await prisma.platformSetting.findMany();
  const niches = await prisma.niche.findMany();
  const platforms = await prisma.platform.findMany();
  res.json({ settings, niches, platforms });
}));

router.put('/settings/commission', requirePermission('settings.read'), asyncHandler(async (req, res) => {
  const { rate } = z.object({ rate: z.number().min(0).max(1) }).parse(req.body);
  await prisma.platformSetting.upsert({
    where: { key: 'commission_rate' },
    create: { key: 'commission_rate', value: rate },
    update: { value: rate },
  });
  res.json({ success: true });
}));

router.post('/niches', requirePermission('settings.read'), asyncHandler(async (req, res) => {
  const { name, slug } = req.body;
  const niche = await prisma.niche.create({ data: { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-') } });
  res.status(201).json({ niche });
}));

router.patch('/niches/:id', requirePermission('settings.read'), asyncHandler(async (req, res) => {
  const niche = await prisma.niche.update({ where: { id: req.params.id }, data: req.body });
  res.json({ niche });
}));

router.post('/platforms', requirePermission('settings.read'), asyncHandler(async (req, res) => {
  const { name, slug, icon } = req.body;
  const platform = await prisma.platform.create({
    data: { name, slug: slug || name.toLowerCase(), icon },
  });
  res.status(201).json({ platform });
}));

router.patch('/platforms/:id', requirePermission('settings.read'), asyncHandler(async (req, res) => {
  const platform = await prisma.platform.update({ where: { id: req.params.id }, data: req.body });
  res.json({ platform });
}));

export default router;
