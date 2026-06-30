import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute, GuestRoute } from './routes/guards';
import PublicLayout from './layouts/PublicLayout';

import HomePage, { HowItWorksPage, PricingPage, AboutPage, ContactPage, TermsPage, PrivacyPage, NotFoundPage } from './pages/public/PublicPages';
import { SignupRolePage, SignupFormPage, LoginPage, ForgotPasswordPage, ResetPasswordPage } from './pages/auth/AuthPages';
import { AdvertiserOnboarding, CreatorOnboarding } from './pages/onboarding/OnboardingPages';

import { AdvertiserDashboard, AdvertiserCampaignsList } from './pages/advertiser/AdvertiserDashboard';
import {
  CampaignWizard, CampaignDetail, AdvertiserCollaborationsList, AdvertiserCollaborationDetail,
  AdvertiserMarketplace, AdvertiserWallet, AdvertiserSettings, AdvertiserHelp,
} from './pages/advertiser/AdvertiserPages';
import { AdvertiserMessagesInbox } from './pages/messages/MessagesPages';

import {
  CreatorDashboard, CreatorPagesList, CreatorPageForm, CreatorPageDetail,
  CreatorDiscover, CreatorInvitations, CreatorCollaborationsList, CreatorCollaborationDetail,
  CreatorEarnings, CreatorSettings, CreatorHelp, CreatorApplications,
} from './pages/creator/CreatorPages';
import { CreatorMessagesInbox } from './pages/messages/MessagesPages';

import {
  AdminDashboard, AdminUsers, AdminUserDetail, AdminCampaigns, AdminCampaignDetail,
  AdminReviewQueue, AdminFinance, AdminReports, AdminSettings,
} from './pages/admin/AdminPages';
import { AdminMessagesInbox } from './pages/messages/MessagesPages';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
            </Route>

            {/* Auth (guest only) */}
            <Route element={<GuestRoute />}>
              <Route path="auth/signup" element={<SignupRolePage />} />
              <Route path="auth/signup/advertiser" element={<SignupFormPage role="advertiser" />} />
              <Route path="auth/signup/creator" element={<SignupFormPage role="creator" />} />
              <Route path="auth/login" element={<LoginPage />} />
              <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="auth/reset-password" element={<ResetPasswordPage />} />
            </Route>

            <Route path="admin/login" element={<LoginPage admin />} />

            {/* Advertiser */}
            <Route element={<ProtectedRoute roles={['ADVERTISER']} requireOnboarding={false} />}>
              <Route path="advertiser/onboarding" element={<AdvertiserOnboarding />} />
            </Route>
            <Route element={<ProtectedRoute roles={['ADVERTISER']} />}>
              <Route path="advertiser" element={<AdvertiserDashboard />} />
              <Route path="advertiser/campaigns" element={<AdvertiserCampaignsList />} />
              <Route path="advertiser/campaigns/new" element={<CampaignWizard />} />
              <Route path="advertiser/campaigns/:id/edit" element={<CampaignWizard />} />
              <Route path="advertiser/campaigns/:id" element={<CampaignDetail />} />
              <Route path="advertiser/marketplace" element={<AdvertiserMarketplace />} />
              <Route path="advertiser/collaborations" element={<AdvertiserCollaborationsList />} />
              <Route path="advertiser/collaborations/:id" element={<AdvertiserCollaborationDetail />} />
              <Route path="advertiser/wallet" element={<AdvertiserWallet />} />
              <Route path="advertiser/messages" element={<AdvertiserMessagesInbox />} />
              <Route path="advertiser/messages/:threadId" element={<AdvertiserMessagesInbox />} />
              <Route path="advertiser/settings" element={<AdvertiserSettings />} />
              <Route path="advertiser/help" element={<AdvertiserHelp />} />
            </Route>

            {/* Creator */}
            <Route element={<ProtectedRoute roles={['CREATOR']} requireOnboarding={false} />}>
              <Route path="creator/onboarding" element={<CreatorOnboarding />} />
            </Route>
            <Route element={<ProtectedRoute roles={['CREATOR']} />}>
              <Route path="creator" element={<CreatorDashboard />} />
              <Route path="creator/pages" element={<CreatorPagesList />} />
              <Route path="creator/pages/new" element={<CreatorPageForm />} />
              <Route path="creator/pages/:id" element={<CreatorPageDetail />} />
              <Route path="creator/discover" element={<CreatorDiscover />} />
              <Route path="creator/applications" element={<CreatorApplications />} />
              <Route path="creator/invitations" element={<CreatorInvitations />} />
              <Route path="creator/collaborations" element={<CreatorCollaborationsList />} />
              <Route path="creator/collaborations/:id" element={<CreatorCollaborationDetail />} />
              <Route path="creator/earnings" element={<CreatorEarnings />} />
              <Route path="creator/messages" element={<CreatorMessagesInbox />} />
              <Route path="creator/messages/:threadId" element={<CreatorMessagesInbox />} />
              <Route path="creator/settings" element={<CreatorSettings />} />
              <Route path="creator/help" element={<CreatorHelp />} />
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute roles={['ADMIN']} requireOnboarding={false} />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="admin/users/:id" element={<AdminUserDetail />} />
              <Route path="admin/campaigns" element={<AdminCampaigns />} />
              <Route path="admin/campaigns/:id" element={<AdminCampaignDetail />} />
              <Route path="admin/review" element={<AdminReviewQueue />} />
              <Route path="admin/finance" element={<AdminFinance />} />
              <Route path="admin/reports" element={<AdminReports />} />
              <Route path="admin/messages" element={<AdminMessagesInbox />} />
              <Route path="admin/messages/:threadId" element={<AdminMessagesInbox />} />
              <Route path="admin/settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
