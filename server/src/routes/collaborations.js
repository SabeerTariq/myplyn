import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { upload } from '../middleware/upload.js';
import { transitionCollaboration } from '../services/collaborationWorkflow.js';
import { ensureThreadForCollaboration } from '../services/messageService.js';
import { createNotification } from '../services/notificationService.js';

const router = Router();

const setUploadType = (type) => (req, _res, next) => {
  req.uploadType = type;
  next();
};

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { role, status, page = 1, limit = 20 } = req.query;
  const where = {};

  if (req.user.role === 'ADVERTISER') {
    const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
    where.campaign = { advertiserId: adv?.id };
  } else if (req.user.role === 'CREATOR') {
    where.creatorUserId = req.user.id;
    if (req.query.includePending !== 'true') {
      where.status = { not: 'APPLICATION_PENDING' };
    }
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
        reviewFeedback: { orderBy: { createdAt: 'asc' } },
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
      reviewFeedback: { orderBy: { createdAt: 'asc' } },
      thread: { include: { messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } } } },
    },
  });
  if (!collaboration) return res.status(404).json({ error: 'Not found' });
  res.json({ collaboration });
}));

router.post('/:id/content', authenticate, requireRole('ADVERTISER'), setUploadType('content'), upload.single('file'), asyncHandler(async (req, res) => {
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

  const thread = await ensureThreadForCollaboration(collaboration.id);
  res.status(201).json({ content, threadId: thread.id });
}));

router.post('/:id/publish', authenticate, requireRole('CREATOR'), asyncHandler(async (req, res) => {
  const collaboration = await prisma.collaboration.findFirst({
    where: { id: req.params.id, creatorUserId: req.user.id },
  });
  if (!collaboration) return res.status(404).json({ error: 'Not found' });
  await transitionCollaboration(collaboration.id, 'PUBLISHED', req.user);

  const thread = await ensureThreadForCollaboration(collaboration.id);
  res.json({ success: true, threadId: thread.id });
}));

router.post('/:id/proof', authenticate, requireRole('CREATOR'), setUploadType('proofs'), upload.single('screenshot'), asyncHandler(async (req, res) => {
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

  const thread = await ensureThreadForCollaboration(collaboration.id);
  res.status(201).json({ proof, threadId: thread.id });
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

  const thread = await ensureThreadForCollaboration(collaboration.id);
  res.json({ success: true, threadId: thread.id });
}));

router.post('/:id/request-changes', authenticate, requireRole('ADVERTISER'), setUploadType('reviews'), upload.single('file'), asyncHandler(async (req, res) => {
  const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
  const collaboration = await prisma.collaboration.findFirst({
    where: { id: req.params.id, campaign: { advertiserId: adv?.id } },
  });
  if (!collaboration) return res.status(404).json({ error: 'Not found' });

  if (!['PROOF_SUBMITTED', 'IN_REVIEW'].includes(collaboration.status)) {
    return res.status(400).json({ error: 'Changes can only be requested while proof is under review.' });
  }

  const notes = (req.body.notes || '').trim();
  if (!notes) return res.status(400).json({ error: 'Please describe what needs to change.' });

  const feedback = await prisma.collaborationReviewFeedback.create({
    data: {
      collaborationId: collaboration.id,
      notes,
      filePath: req.file ? `/uploads/reviews/${req.file.filename}` : null,
      fileName: req.file?.originalname,
    },
  });

  if (collaboration.status === 'PROOF_SUBMITTED') {
    await transitionCollaboration(collaboration.id, 'IN_REVIEW', { role: 'SYSTEM' }, 'Moved to review');
  }
  await transitionCollaboration(collaboration.id, 'PUBLISHED', req.user, `Changes requested: ${notes}`);

  const thread = await ensureThreadForCollaboration(collaboration.id);
  await createNotification(
    collaboration.creatorUserId,
    'collaboration',
    'Changes requested on your proof',
    notes,
    { collaborationId: collaboration.id, threadId: thread.id },
  );

  res.json({ success: true, threadId: thread.id, feedback });
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
