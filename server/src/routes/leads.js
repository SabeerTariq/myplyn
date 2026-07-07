import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/error.js';
import { sendLeadEmail } from '../services/mailService.js';

const router = Router();

router.post('/', asyncHandler(async (req, res) => {
  const data = z.object({
    fullName: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(7).max(30),
    source: z.enum(['landing', 'landing-en']).default('landing'),
  }).parse(req.body);

  const subject = data.source === 'landing-en'
    ? 'Myplyn Landing (EN) — New registration'
    : 'Myplyn Landing — تسجيل جديد';

  await sendLeadEmail({
    fullName: data.fullName,
    phone: data.phone.replace(/[^\d+]/g, ''),
    source: data.source,
    subject,
  });

  res.json({ ok: true });
}));

export default router;
