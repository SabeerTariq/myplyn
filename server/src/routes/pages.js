import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';

const router = Router();
router.use(authenticate, requireRole('CREATOR'));

async function getCreatorProfile(req) {
  const profile = await prisma.creatorProfile.findUnique({ where: { userId: req.user.id } });
  if (!profile) throw Object.assign(new Error('Creator profile not found'), { status: 404 });
  return profile;
}

router.get('/', asyncHandler(async (req, res) => {
  const profile = await getCreatorProfile(req);
  const pages = await prisma.creatorPage.findMany({
    where: { creatorId: profile.id },
    include: { platform: true, niche: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ pages });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const profile = await getCreatorProfile(req);
  const page = await prisma.creatorPage.findFirst({
    where: { id: req.params.id, creatorId: profile.id },
    include: {
      platform: true,
      niche: true,
      collaborations: { include: { campaign: true } },
    },
  });
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json({ page });
}));

router.post('/', asyncHandler(async (req, res) => {
  const profile = await getCreatorProfile(req);
  const data = z.object({
    platformId: z.string().uuid(),
    nicheId: z.string().uuid().optional(),
    name: z.string().min(1),
    url: z.string().url(),
    followers: z.number().int().min(0),
    avgReach: z.number().int().min(0).optional(),
    engagement: z.number().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
  }).parse(req.body);

  const page = await prisma.creatorPage.create({
    data: { ...data, creatorId: profile.id },
    include: { platform: true, niche: true },
  });

  await prisma.reviewQueueItem.create({
    data: { type: 'PROOF', entityId: page.id, status: 'PENDING' },
  });

  res.status(201).json({ page });
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  const profile = await getCreatorProfile(req);
  const existing = await prisma.creatorPage.findFirst({
    where: { id: req.params.id, creatorId: profile.id },
  });
  if (!existing) return res.status(404).json({ error: 'Page not found' });

  const page = await prisma.creatorPage.update({
    where: { id: req.params.id },
    data: req.body,
    include: { platform: true, niche: true },
  });
  res.json({ page });
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const profile = await getCreatorProfile(req);
  const deleted = await prisma.creatorPage.deleteMany({
    where: { id: req.params.id, creatorId: profile.id },
  });
  if (!deleted.count) return res.status(404).json({ error: 'Page not found' });
  res.json({ success: true });
}));

export default router;
