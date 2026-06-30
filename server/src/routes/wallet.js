import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { getOrCreateWallet, fundWallet, calcFeeBreakdown, getCommissionRate } from '../services/walletService.js';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(async (req, res) => {
  let ownerType, ownerId;

  if (req.user.role === 'ADVERTISER') {
    const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
    ownerType = 'ADVERTISER';
    ownerId = adv?.id;
  } else if (req.user.role === 'CREATOR') {
    ownerType = 'CREATOR';
    ownerId = req.user.id;
  } else {
    return res.status(403).json({ error: 'Not applicable' });
  }

  const wallet = await getOrCreateWallet(ownerType, ownerId);
  const feePct = await getCommissionRate();

  res.json({
    wallet: {
      balance: Number(wallet.balance),
      heldBalance: Number(wallet.heldBalance),
      feePct,
    },
  });
}));

router.get('/transactions', asyncHandler(async (req, res) => {
  let ownerType, ownerId;
  const { type, page = 1, limit = 20 } = req.query;

  if (req.user.role === 'ADVERTISER') {
    const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });
    ownerType = 'ADVERTISER';
    ownerId = adv?.id;
  } else if (req.user.role === 'CREATOR') {
    ownerType = 'CREATOR';
    ownerId = req.user.id;
  } else if (req.user.role === 'ADMIN') {
    ownerType = req.query.ownerType;
    ownerId = req.query.ownerId;
  }

  const where = { walletOwnerType: ownerType, walletOwnerId: ownerId };
  if (type) where.type = type;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    }),
    prisma.transaction.count({ where }),
  ]);

  res.json({ transactions, total });
}));

router.post('/fund', asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADVERTISER') {
    return res.status(403).json({ error: 'Advertisers only' });
  }

  const { amount } = z.object({ amount: z.number().positive() }).parse(req.body);
  const adv = await prisma.advertiserProfile.findUnique({ where: { userId: req.user.id } });

  if (process.env.PAYMENTS_MOCK === 'true') {
    const tx = await fundWallet('ADVERTISER', adv.id, amount, 'Wallet top-up (mock)');
    return res.json({ transaction: tx, mock: true });
  }

  res.status(501).json({ error: 'Configure Stripe keys or enable PAYMENTS_MOCK' });
}));

router.post('/withdraw', asyncHandler(async (req, res) => {
  if (req.user.role !== 'CREATOR') {
    return res.status(403).json({ error: 'Creators only' });
  }

  const { amount } = z.object({ amount: z.number().positive() }).parse(req.body);
  const profile = await prisma.creatorProfile.findUnique({ where: { userId: req.user.id } });

  if (profile.connectStatus !== 'CONNECTED' && process.env.PAYMENTS_MOCK !== 'true') {
    return res.status(400).json({ error: 'Complete Stripe Connect onboarding first' });
  }

  const wallet = await getOrCreateWallet('CREATOR', req.user.id);
  if (Number(wallet.balance) < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  const feePct = await getCommissionRate();
  const { net } = calcFeeBreakdown(amount, 0);

  await prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: { decrement: amount } },
  });

  const payout = await prisma.payout.create({
    data: {
      creatorUserId: req.user.id,
      amount,
      feeAmount: 0,
      netAmount: net,
      status: process.env.PAYMENTS_MOCK === 'true' ? 'PAID' : 'PENDING',
    },
  });

  res.status(201).json({ payout });
}));

router.get('/payouts', asyncHandler(async (req, res) => {
  if (req.user.role !== 'CREATOR') {
    return res.status(403).json({ error: 'Creators only' });
  }
  const payouts = await prisma.payout.findMany({
    where: { creatorUserId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ payouts });
}));

router.get('/earnings', asyncHandler(async (req, res) => {
  if (req.user.role !== 'CREATOR') {
    return res.status(403).json({ error: 'Creators only' });
  }

  const wallet = await getOrCreateWallet('CREATOR', req.user.id);
  const feePct = await getCommissionRate();

  const lifetime = await prisma.transaction.aggregate({
    where: { walletOwnerType: 'CREATOR', walletOwnerId: req.user.id, type: 'RELEASE' },
    _sum: { net: true, gross: true, feeAmount: true },
  });

  res.json({
    available: Number(wallet.balance),
    pending: Number(wallet.heldBalance),
    lifetime: {
      gross: Number(lifetime._sum.gross || 0),
      fees: Number(lifetime._sum.feeAmount || 0),
      net: Number(lifetime._sum.net || 0),
    },
    feePct,
  });
}));

export default router;
