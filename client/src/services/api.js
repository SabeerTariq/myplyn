import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const PUBLIC_PATHS = new Set([
  '/',
  '/how-it-works',
  '/pricing',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
]);

function isPublicPath(pathname) {
  return PUBLIC_PATHS.has(pathname)
    || pathname.startsWith('/auth')
    || pathname === '/admin/login';
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const pathname = window.location.pathname;
    const isSessionCheck = err.config?.url?.includes('/auth/me');
    if (
      err.response?.status === 401
      && !isSessionCheck
      && !isPublicPath(pathname)
    ) {
      const isAdmin = pathname.startsWith('/admin');
      window.location.href = isAdmin ? '/admin/login' : '/auth/login';
    }
    return Promise.reject(err);
  }
);

export default api;

export const authApi = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  updateOnboarding: (data) => api.patch('/auth/onboarding', data),
  changePassword: (data) => api.patch('/auth/change-password', data),
};

export const campaignsApi = {
  list: (params) => api.get('/campaigns', { params }),
  get: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  updateWizard: (id, data) => api.patch(`/campaigns/${id}/wizard`, data),
  publish: (id) => api.post(`/campaigns/${id}/publish`),
  pause: (id) => api.post(`/campaigns/${id}/pause`),
  close: (id) => api.post(`/campaigns/${id}/close`),
  uploadAsset: (id, file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/campaigns/${id}/assets`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  approveApplication: (campaignId, appId) => api.post(`/campaigns/${campaignId}/applications/${appId}/approve`),
  rejectApplication: (campaignId, appId) => api.post(`/campaigns/${campaignId}/applications/${appId}/reject`),
};

export const collaborationsApi = {
  list: (params) => api.get('/collaborations', { params }),
  get: (id) => api.get(`/collaborations/${id}`),
  provideContent: (id, data, file) => {
    const fd = new FormData();
    if (file) fd.append('file', file);
    if (data.url) fd.append('url', data.url);
    if (data.notes) fd.append('notes', data.notes);
    return api.post(`/collaborations/${id}/content`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  markPublished: (id) => api.post(`/collaborations/${id}/publish`),
  submitProof: (id, data, file) => {
    const fd = new FormData();
    fd.append('proofUrl', data.proofUrl);
    if (data.notes) fd.append('notes', data.notes);
    if (file) fd.append('screenshot', file);
    return api.post(`/collaborations/${id}/proof`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  verify: (id) => api.post(`/collaborations/${id}/verify`),
  requestChanges: (id, notes) => api.post(`/collaborations/${id}/request-changes`, { notes }),
  dispute: (id, data) => api.post(`/collaborations/${id}/dispute`, data),
};

export const marketplaceApi = {
  campaigns: (params) => api.get('/marketplace', { params }),
  creators: (params) => api.get('/marketplace/creators', { params }),
  creatorPage: (id) => api.get(`/marketplace/creators/${id}`),
  apply: (data) => api.post('/marketplace/apply', data),
  invite: (data) => api.post('/marketplace/invite', data),
  invitations: () => api.get('/marketplace/invitations'),
  acceptInvitation: (id) => api.post(`/marketplace/invitations/${id}/accept`),
  rejectInvitation: (id) => api.post(`/marketplace/invitations/${id}/reject`),
  applications: () => api.get('/marketplace/applications'),
  saved: () => api.get('/marketplace/saved'),
  saveCreator: (creatorUserId) => api.post(`/marketplace/saved/${creatorUserId}`),
};

export const pagesApi = {
  list: () => api.get('/pages'),
  get: (id) => api.get(`/pages/${id}`),
  create: (data) => api.post('/pages', data),
  update: (id, data) => api.patch(`/pages/${id}`, data),
  remove: (id) => api.delete(`/pages/${id}`),
};

export const walletApi = {
  get: () => api.get('/wallet'),
  transactions: (params) => api.get('/wallet/transactions', { params }),
  fund: (amount) => api.post('/wallet/fund', { amount }),
  withdraw: (amount) => api.post('/wallet/withdraw', { amount }),
  payouts: () => api.get('/wallet/payouts'),
  earnings: () => api.get('/wallet/earnings'),
};

export const notificationsApi = {
  list: () => api.get('/notifications'),
  counts: () => api.get('/notifications/counts'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
};

export const messagesApi = {
  threads: () => api.get('/messages'),
  thread: (id) => api.get(`/messages/${id}`),
  byCollaboration: (collaborationId) => api.get(`/messages/collaboration/${collaborationId}`),
  send: (threadId, body) => api.post(`/messages/${threadId}`, { body }),
};

export const taxonomyApi = {
  niches: () => api.get('/taxonomy/niches'),
  platforms: () => api.get('/taxonomy/platforms'),
};

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  users: (params) => api.get('/admin/users', { params }),
  user: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, data) => api.patch(`/admin/users/${id}/status`, data),
  campaigns: () => api.get('/admin/campaigns'),
  campaign: (id) => api.get(`/admin/campaigns/${id}`),
  reviewQueue: () => api.get('/admin/review-queue'),
  resolveReview: (id, data) => api.post(`/admin/review-queue/${id}/resolve`, data),
  verifyPage: (id, data) => api.post(`/admin/pages/${id}/verify`, data),
  transactions: () => api.get('/admin/finance/transactions'),
  commissions: () => api.get('/admin/finance/commissions'),
  payouts: () => api.get('/admin/finance/payouts'),
  reports: () => api.get('/admin/reports'),
  settings: () => api.get('/admin/settings'),
  updateCommission: (rate) => api.put('/admin/settings/commission', { rate }),
  createNiche: (data) => api.post('/admin/niches', data),
  updateNiche: (id, data) => api.patch(`/admin/niches/${id}`, data),
  createPlatform: (data) => api.post('/admin/platforms', data),
  updatePlatform: (id, data) => api.patch(`/admin/platforms/${id}`, data),
};
