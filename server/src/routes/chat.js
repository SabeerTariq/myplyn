import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/error.js';
import { getChatReply } from '../services/chatService.js';
import { sendChatEmail } from '../services/mailService.js';

const router = Router();

const historyItem = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(4000),
});

router.post('/', asyncHandler(async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const normalized = {
    ...body,
    history: Array.isArray(body.history)
      ? body.history
        .map((item) => ({
          role: item?.role === 'assistant' ? 'assistant' : 'user',
          content: String(item?.content || '').slice(0, 4000),
        }))
        .slice(-20)
      : [],
  };

  const data = z.object({
    message: z.string().trim().min(1).max(2000),
    history: z.array(historyItem).max(30).optional().default([]),
    page: z.string().max(500).optional().default('/'),
    visitorEmail: z.union([z.string().email(), z.literal('')]).optional().transform((v) => v || undefined),
    source: z.string().max(100).optional().default('chat-widget'),
  }).parse(normalized);

  const result = await getChatReply({
    message: data.message,
    history: data.history,
  });

  sendChatEmail({
    userMessage: data.message,
    botReply: result.reply,
    page: data.page,
    visitorEmail: data.visitorEmail,
    source: data.source,
  }).catch((err) => console.error('[chat] Email notify failed:', err.message));

  res.json({ ok: true, reply: result.reply, source: result.source });
}));

export default router;
