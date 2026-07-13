import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/error.js';
import {
  getThreadAccessWhere,
  userCanAccessCollaboration,
  ensureThreadForCollaboration,
  sanitizeThread,
  sanitizeMessage,
  notifyNewMessage,
  collaborationContextInclude,
  isMessagingActive,
  MESSAGING_STATUSES,
  getUnreadMessageCount,
  getUnreadCountsByThread,
} from '../services/messageService.js';

const router = Router();
router.use(authenticate);

const threadInclude = {
  collaboration: {
    include: collaborationContextInclude,
  },
  messages: {
    orderBy: { createdAt: 'desc' },
    take: 1,
    include: { sender: true },
  },
};

const fullThreadInclude = {
  collaboration: {
    include: collaborationContextInclude,
  },
  messages: {
    orderBy: { createdAt: 'asc' },
    include: { sender: true },
  },
};

function messagingWhere(accessWhere) {
  return {
    ...accessWhere,
    collaboration: {
      ...(accessWhere.collaboration || {}),
      status: { in: MESSAGING_STATUSES },
    },
  };
}

router.get('/', asyncHandler(async (req, res) => {
  const accessWhere = await getThreadAccessWhere(req.user);
  const threads = await prisma.messageThread.findMany({
    where: messagingWhere(accessWhere),
    include: threadInclude,
    orderBy: { updatedAt: 'desc' },
  });
  const unreadMap = await getUnreadCountsByThread(threads.map((t) => t.id), req.user.id);
  res.json({
    threads: await Promise.all(
      threads.map((t) => sanitizeThread(t, { unreadCount: unreadMap[t.id] || 0 })),
    ),
    unreadTotal: await getUnreadMessageCount(req.user.id, req.user.role),
  });
}));

router.get('/collaboration/:collaborationId', asyncHandler(async (req, res) => {
  const collab = await userCanAccessCollaboration(req.user, req.params.collaborationId);
  if (!collab) return res.status(404).json({ error: 'Collaboration not found' });
  if (!isMessagingActive(collab.status)) {
    return res.status(403).json({
      error: 'Messages open after the collaboration is accepted by both sides.',
      status: collab.status,
    });
  }

  const thread = await ensureThreadForCollaboration(collab.id);
  const full = await prisma.messageThread.findUnique({
    where: { id: thread.id },
    include: fullThreadInclude,
  });
  res.json({ thread: await sanitizeThread(full) });
}));

router.get('/:threadId', asyncHandler(async (req, res) => {
  const accessWhere = await getThreadAccessWhere(req.user);
  const thread = await prisma.messageThread.findFirst({
    where: { id: req.params.threadId, ...messagingWhere(accessWhere) },
    include: fullThreadInclude,
  });
  if (!thread) return res.status(404).json({ error: 'Thread not found' });

  await prisma.message.updateMany({
    where: {
      threadId: thread.id,
      senderId: { not: req.user.id },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  res.json({
    thread: await sanitizeThread(thread, { unreadCount: 0 }),
    unreadTotal: await getUnreadMessageCount(req.user.id, req.user.role),
  });
}));

router.post('/:threadId', asyncHandler(async (req, res) => {
  const { body } = z.object({ body: z.string().min(1).max(5000) }).parse(req.body);

  const accessWhere = await getThreadAccessWhere(req.user);
  const thread = await prisma.messageThread.findFirst({
    where: { id: req.params.threadId, ...messagingWhere(accessWhere) },
    include: {
      collaboration: { include: { campaign: { include: { advertiser: true } } } },
    },
  });
  if (!thread) return res.status(404).json({ error: 'Thread not found' });

  const message = await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: req.user.id,
      body,
    },
    include: { sender: true },
  });

  await prisma.messageThread.update({
    where: { id: thread.id },
    data: { updatedAt: new Date() },
  });

  await notifyNewMessage(thread, req.user, body);

  res.status(201).json({ message: sanitizeMessage(message) });
}));

export default router;
