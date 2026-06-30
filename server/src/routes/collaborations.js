import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { upload } from '../middleware/upload.js';
import { transitionCollaboration } from '../services/collaborationWorkflow.js';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { role, status, page = 1, limit = 20 } = req.query;
  const where = {};

  if (req.user.role === 'ADVERTISER') {
    const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
    where.campaign = { advertiserId: adv?.id };
  } else if (req.user.role === 'CREATOR') {
    where.creatorUserId = req.user.id;
  }

  if (status) where.status = status;

  const [collaborations, total] = await Promise.all([
    prisma.collaboration.findMany({
      where,
      include: {
        campaign: { include: { advertiser: true } },
        page: { include: { platform: true } },
        events: { orderBy: { createdAt: 'asc' } },
        proofs: true,
        content: true,
      },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    }),
    prisma.collaboration.count({ where }),
  ]);

  res.json({ collaborations, total });
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const collaboration = await prisma.collaboration.findUnique({
    where: { id: req.params.id },
    include: {
      campaign: { include: { advertiser: true } },
      page: { include: { platform: true, creator: true } },
      events: { orderBy: { createdAt: 'asc' } },
      proofs: true,
      content: true,
      thread: { include: { messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } } } },
    },
  });
  if (!collaboration) return res.status(404).json({ error: 'Not found' });
  res.json({ collaboration });
}));

router.post('/:id/content', authenticate, requireRole('ADVERTISER'), upload.single('file'), asyncHandler(async (req, res) => {
  const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
  const collaboration = await prisma.collaboration.findFirst({
    where: { id: req.params.id, campaign: { advertiserId: adv?.id } },
  });
  if (!collaboration) return res.status(404).json({ error: 'Not found' });

  const content = await prisma.collaborationContent.create({
    data: {
      collaborationId: collaboration.id,
      filePath: req.file ? `/uploads/content/${req.file.filename}` : null,
      fileName: req.file?.originalname,
      url: req.body.url,
      notes: req.body.notes,
    },
  });

  await transitionCollaboration(collaboration.id, 'CONTENT_PROVIDED', req.user);
  res.status(201).json({ content });
}));

router.post('/:id/publish', authenticate, requireRole('CREATOR'), asyncHandler(async (req, res) => {
  const collaboration = await prisma.collaboration.findFirst({
    where: { id: req.params.id, creatorUserId: req.user.id },
  });
  if (!collaboration) return res.status(404).json({ error: 'Not found' });
  await transitionCollaboration(collaboration.id, 'PUBLISHED', req.user);
  res.json({ success: true });
}));

router.post('/:id/proof', authenticate, requireRole('CREATOR'), upload.single('screenshot'), asyncHandler(async (req, res) => {
  const { proofUrl, notes } = z.object({
    proofUrl: z.string().url(),
    notes: z.string().optional(),
  }).parse(req.body);

  const collaboration = await prisma.collaboration.findFirst({
    where: { id: req.params.id, creatorUserId: req.user.id },
  });
  if (!collaboration) return res.status(404).json({ error: 'Not found' });

  const proof = await prisma.collaborationProof.create({
    data: {
      collaborationId: collaboration.id,
      proofUrl,
      screenshotPath: req.file ? `/uploads/proofs/${req.file.filename}` : null,
      notes,
    },
  });

  await transitionCollaboration(collaboration.id, 'PROOF_SUBMITTED', req.user);
  res.status(201).json({ proof });
}));

router.post('/:id/verify', authenticate, asyncHandler(async (req, res) => {
  const collaboration = await prisma.collaboration.findUnique({
    where: { id: req.params.id },
    include: { campaign: true },
  });
  if (!collaboration) return res.status(404).json({ error: 'Not found' });

  if (req.user.role === 'ADVERTISER') {
    const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
    if (collaboration.campaign.advertiserId !== adv?.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } else if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await transitionCollaboration(collaboration.id, 'VERIFIED', req.user);
  await transitionCollaboration(collaboration.id, 'RELEASED', { role: 'SYSTEM' });
  await transitionCollaboration(collaboration.id, 'PAID_OUT', { role: 'SYSTEM' });
  res.json({ success: true });
}));

router.post('/:id/request-changes', authenticate, requireRole('ADVERTISER'), asyncHandler(async (req, res) => {
  const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
  const collaboration = await prisma.collaboration.findFirst({
    where: { id: req.params.id, campaign: { advertiserId: adv?.id } },
  });
  if (!collaboration) return res.status(404).json({ error: 'Not found' });
  await transitionCollaboration(collaboration.id, 'PUBLISHED', req.user, req.body.notes || 'Changes requested');
  res.json({ success: true });
}));

router.post('/:id/dispute', authenticate, asyncHandler(async (req, res) => {
  const { reason, evidence } = z.object({
    reason: z.string().min(1),
    evidence: z.string().optional(),
  }).parse(req.body);

  const dispute = await prisma.dispute.create({
    data: {
      collaborationId: req.params.id,
      raisedById: req.user.id,
      reason,
      evidence,
    },
  });

  await prisma.reviewQueueItem.create({
    data: { type: 'DISPUTE', entityId: dispute.id },
  });

  await prisma.collaboration.update({
    where: { id: req.params.id },
    data: { status: 'DISPUTED' },
  });

  res.status(201).json({ dispute });
}));

export default router;
