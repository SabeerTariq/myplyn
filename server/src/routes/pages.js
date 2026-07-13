import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { isValidLocation } from '../data/locations.js';
import { normalizePageInput } from '../services/pageVerificationService.js';

const router = Router();
router.use(authenticate, requireRole('CREATOR'));

const pageSchema = z.object({
  platformId: z.string().uuid(),
  nicheId: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : v),
    z.string().uuid().nullable().optional(),
  ),
  customNiche: z.preprocess(
    (v) => (v === '' || v === null ? null : String(v).trim()),
    z.string().max(120).nullable().optional(),
  ),
  name: z.string().min(1).max(200),
  url: z.string().url(),
  followers: z.number().int().min(0),
  avgReach: z.number().int().min(0).optional(),
  engagement: z.number().min(0).max(100).optional().nullable(),
  country: z.string().min(2).max(100),
  state: z.preprocess(
    (v) => (v === '' || v === null ? null : v),
    z.string().max(100).nullable().optional(),
  ),
  city: z.string().min(2).max(120),
});

async function getCreatorProfile(req) {
  const profile = await prisma.creatorProfile.findUnique({ where: { userId: req.user.id } });
  if (!profile) throw Object.assign(new Error('Creator profile not found'), { status: 404 });
  return profile;
}

async function queuePageReview(pageId) {
  const existing = await prisma.reviewQueueItem.findFirst({
    where: { type: 'PROOF', entityId: pageId, status: 'PENDING' },
  });
  if (!existing) {
    await prisma.reviewQueueItem.create({
      data: { type: 'PROOF', entityId: pageId, status: 'PENDING' },
    });
  }
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
  const parsed = pageSchema.parse(req.body);

  if (!isValidLocation(parsed.country, parsed.state, parsed.city)) {
    return res.status(400).json({ error: 'Please select a valid country, state, and city' });
  }

  const data = await normalizePageInput(parsed);

  const page = await prisma.creatorPage.create({
    data: { ...data, creatorId: profile.id },
    include: { platform: true, niche: true },
  });

  await queuePageReview(page.id);

  res.status(201).json({ page });
}));

router.patch('/:id', asyncHandler(async (req, res) => {
  const profile = await getCreatorProfile(req);
  const existing = await prisma.creatorPage.findFirst({
    where: { id: req.params.id, creatorId: profile.id },
  });
  if (!existing) return res.status(404).json({ error: 'Page not found' });

  const parsed = pageSchema.partial().parse(req.body);
  if (parsed.country || parsed.state || parsed.city) {
    const country = parsed.country ?? existing.country;
    const state = parsed.state ?? existing.state;
    const city = parsed.city ?? existing.city;
    if (!isValidLocation(country, state, city)) {
      return res.status(400).json({ error: 'Please select a valid country, state, and city' });
    }
  }

  const data = await normalizePageInput({
    platformId: parsed.platformId ?? existing.platformId,
    nicheId: parsed.nicheId !== undefined ? parsed.nicheId : existing.nicheId,
    customNiche: parsed.customNiche !== undefined ? parsed.customNiche : existing.customNiche,
    name: parsed.name ?? existing.name,
    url: parsed.url ?? existing.url,
    followers: parsed.followers ?? existing.followers,
    avgReach: parsed.avgReach ?? existing.avgReach,
    engagement: parsed.engagement !== undefined ? parsed.engagement : existing.engagement,
    country: parsed.country ?? existing.country,
    state: parsed.state !== undefined ? parsed.state : existing.state,
    city: parsed.city ?? existing.city,
  });

  const page = await prisma.creatorPage.update({
    where: { id: req.params.id },
    data: {
      ...data,
      verificationStatus: 'PENDING',
      adminVerifiedAt: null,
      adminNotes: null,
    },
    include: { platform: true, niche: true },
  });

  await queuePageReview(page.id);

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
