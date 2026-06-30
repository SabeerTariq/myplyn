import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

router.get('/niches', async (req, res) => {
  const niches = await prisma.niche.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
  res.json({ niches });
});

router.get('/platforms', async (req, res) => {
  const platforms = await prisma.platform.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
  res.json({ platforms });
});

export default router;
