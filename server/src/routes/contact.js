import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/error.js';
import { sendContactEmail } from '../services/mailService.js';

const router = Router();

const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  role: z.enum([
    'Brand / advertiser',
    'Creator / page owner',
    'Press / partnership',
    'Something else',
  ]),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
});

router.post('/', asyncHandler(async (req, res) => {
  const data = contactSchema.parse(req.body);
  await sendContactEmail(data);
  res.json({ ok: true, message: 'Your message has been sent.' });
}));

export default router;
