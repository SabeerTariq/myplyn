import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import './config/env.js';

import { errorHandler, notFound } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/campaigns.js';
import collaborationRoutes from './routes/collaborations.js';
import marketplaceRoutes from './routes/marketplace.js';
import pageRoutes from './routes/pages.js';
import walletRoutes from './routes/wallet.js';
import notificationRoutes from './routes/notifications.js';
import messageRoutes from './routes/messages.js';
import taxonomyRoutes from './routes/taxonomy.js';
import adminRoutes from './routes/admin.js';
import stripeRoutes from './routes/stripe.js';
import leadRoutes from './routes/leads.js';
import chatRoutes from './routes/chat.js';
import contactRoutes from './routes/contact.js';
import { BRAND } from './config/brand.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/collaborations', collaborationRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/pages', pageRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/taxonomy', taxonomyRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/stripe', stripeRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/contact', contactRoutes);

// Serve the React build in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  const standaloneLandings = {
    '/landing': path.join(clientDist, 'landing/index.html'),
    '/landing-en': path.join(clientDist, 'landing-en/index.html'),
  };

  Object.entries(standaloneLandings).forEach(([route, file]) => {
    app.get(route, (req, res) => res.sendFile(file));
  });

  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    const landingFile = standaloneLandings[req.path.replace(/\/$/, '')];
    if (landingFile) return res.sendFile(landingFile);
    if (req.path === '/landing' || req.path.startsWith('/landing/')) {
      return res.sendFile(standaloneLandings['/landing']);
    }
    if (req.path === '/landing-en' || req.path.startsWith('/landing-en/')) {
      return res.sendFile(standaloneLandings['/landing-en']);
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`${BRAND.name} API running on http://localhost:${PORT}`);
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log(`[mail] Hostinger SMTP ready (${process.env.SMTP_USER} -> ${process.env.LEAD_EMAIL || 'info@myplyn.com'})`);
  } else {
    console.warn('[mail] SMTP not configured — landing form emails will not send');
  }
});
