import { Router } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma.js';
import { hashPassword, comparePassword } from '../lib/password.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../lib/jwt.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import { getOrCreateWallet } from '../services/walletService.js';

const router = Router();

function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    adminRole: user.adminRole,
    status: user.status,
    emailVerified: !!user.emailVerifiedAt,
    onboardingStep: user.onboardingStep,
    onboardingDone: user.onboardingDone,
    advertiserProfile: user.advertiserProfile,
    creatorProfile: user.creatorProfile,
  };
}

router.post('/signup', asyncHandler(async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['ADVERTISER', 'CREATOR']),
    companyName: z.string().optional(),
    country: z.string().optional(),
    niche: z.string().optional(),
  });
  const data = schema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const passwordHash = await hashPassword(data.password);
  const verifyToken = uuidv4();

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      role: data.role,
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      verifyToken,
      ...(data.role === 'ADVERTISER' && {
        advertiserProfile: {
          create: { companyName: data.companyName || data.email.split('@')[0] },
        },
      }),
      ...(data.role === 'CREATOR' && {
        creatorProfile: {
          create: { country: data.country, bio: data.niche ? `Niche: ${data.niche}` : null },
        },
      }),
    },
    include: { advertiserProfile: true, creatorProfile: true },
  });

  if (data.role === 'ADVERTISER' && user.advertiserProfile) {
    await getOrCreateWallet('ADVERTISER', user.advertiserProfile.id);
  }
  if (data.role === 'CREATOR') {
    await getOrCreateWallet('CREATOR', user.id);
  }

  const token = signToken({ userId: user.id, role: user.role });
  setAuthCookie(res, token);
  res.status(201).json({ user: formatUser(user), token });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = z.object({
    email: z.string().email(),
    password: z.string(),
  }).parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { advertiserProfile: true, creatorProfile: true },
  });

  if (!user || user.role === 'ADMIN') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.status === 'SUSPENDED') return res.status(403).json({ error: 'Account suspended' });

  const token = signToken({ userId: user.id, role: user.role });
  setAuthCookie(res, token);
  res.json({ user: formatUser(user), token });
}));

router.post('/admin/login', asyncHandler(async (req, res) => {
  const { email, password } = z.object({
    email: z.string().email(),
    password: z.string(),
  }).parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email },
    include: { advertiserProfile: true, creatorProfile: true },
  });

  if (!user || user.role !== 'ADMIN') {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken({ userId: user.id, role: user.role, adminRole: user.adminRole });
  setAuthCookie(res, token);
  res.json({ user: formatUser(user), token });
}));

router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

router.get('/me', authenticate, asyncHandler(async (req, res) => {
  res.json({ user: formatUser(req.user) });
}));

router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = z.object({ email: z.string().email() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const resetToken = uuidv4();
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000),
      },
    });
  }
  res.json({ message: 'If an account exists, a reset link has been sent' });
}));

router.post('/reset-password', asyncHandler(async (req, res) => {
  const { token, password } = z.object({
    token: z.string(),
    password: z.string().min(8),
  }).parse(req.body);

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(password),
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  res.json({ message: 'Password updated successfully' });
}));

router.post('/verify-email', asyncHandler(async (req, res) => {
  const { token } = z.object({ token: z.string() }).parse(req.body);
  const user = await prisma.user.findFirst({ where: { verifyToken: token } });
  if (!user) return res.status(400).json({ error: 'Invalid token' });

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifiedAt: new Date(), verifyToken: null },
  });

  res.json({ message: 'Email verified' });
}));

router.patch('/onboarding', authenticate, asyncHandler(async (req, res) => {
  const { step, done, profile } = req.body;

  if (req.user.role === 'ADVERTISER' && profile) {
    await prisma.advertiserProfile.update({
      where: { userId: req.user.id },
      data: profile,
    });
  }
  if (req.user.role === 'CREATOR' && profile) {
    await prisma.creatorProfile.update({
      where: { userId: req.user.id },
      data: profile,
    });
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      onboardingStep: step ?? req.user.onboardingStep,
      onboardingDone: done ?? req.user.onboardingDone,
    },
    include: { advertiserProfile: true, creatorProfile: true },
  });

  res.json({ user: formatUser(user) });
}));

router.patch('/change-password', authenticate, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8),
  }).parse(req.body);

  const valid = await comparePassword(currentPassword, req.user.passwordHash);
  if (!valid) return res.status(400).json({ error: 'Current password incorrect' });

  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  res.json({ message: 'Password updated' });
}));

export default router;
