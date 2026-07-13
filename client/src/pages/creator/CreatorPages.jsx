import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DashboardShell from '../../layouts/DashboardShell';
import { creatorNav } from '../../config/navigation';
import CreatorDashboardHome from '../../components/creator/CreatorDashboardHome';
import CreatorMyPages from '../../components/creator/CreatorMyPages';
import CreatorMarketplace from '../../components/creator/CreatorMarketplace';
import { buildPageFormState, buildPagePayload } from '../../components/creator/CreatorPageFormFields';
import CreatorPageFormShell from '../../components/creator/CreatorPageFormShell';
import CreatorPageDetailView from '../../components/creator/CreatorPageDetailView';
import CreatorProposals from '../../components/creator/CreatorProposals';
import CreatorProposalDetail from '../../components/creator/CreatorProposalDetail';
import CreatorCollaborations from '../../components/creator/CreatorCollaborations';
import CreatorCollaborationDetailView from '../../components/creator/CreatorCollaborationDetail';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import StatusPill from '../../components/StatusPill';
import TabBar from '../../components/TabBar';
import ListOrEmpty from '../../components/ListOrEmpty';
import Icon from '../../components/Icon';
import WithdrawCard from '../../components/wallet/WithdrawCard';
import { pagesApi, marketplaceApi, collaborationsApi, walletApi, taxonomyApi } from '../../services/api';
import { BRAND } from '../../config/brand';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/wallet.css';

function Layout({ breadcrumbs, children, banner }) {
  return (
    <DashboardShell navConfig={creatorNav} role="CREATOR" breadcrumbs={breadcrumbs} banner={banner}>
      {children}
    </DashboardShell>
  );
}

function ConnectBanner() {
  const { user } = useAuth();
  if (user?.creatorProfile?.connectStatus === 'CONNECTED') return null;
  return (
    <div
      style={{
        background: 'color-mix(in oklch, var(--warn) 12%, white)',
        borderBottom: '1px solid color-mix(in oklch, var(--warn) 25%, var(--border))',
        padding: '10px 22px',
        fontSize: 13,
        color: 'var(--warn)',
      }}
    >
      Set up payouts to withdraw earnings. <Link to="/creator/earnings" style={{ fontWeight: 700, textDecoration: 'underline' }}>Connect Stripe →</Link>
    </div>
  );
}

export function CreatorDashboard() {
  return (
    <Layout breadcrumbs={[]} banner={<ConnectBanner />}>
      <CreatorDashboardHome />
    </Layout>
  );
}

export function CreatorPagesList() {
  return (
    <Layout breadcrumbs={[{ label: 'My Pages' }]} banner={<ConnectBanner />}>
      <CreatorMyPages />
    </Layout>
  );
}

export function CreatorPageForm() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(buildPageFormState());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = buildPagePayload(form);
      await pagesApi.create(payload);
      await qc.invalidateQueries({ queryKey: ['pages'] });
      navigate('/creator/pages');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to submit page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout breadcrumbs={[{ label: 'My Pages', path: '/creator/pages' }, { label: 'Add page' }]} banner={<ConnectBanner />}>
      <CreatorPageFormShell
        mode="create"
        form={form}
        setForm={setForm}
        error={error}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/creator/pages')}
      />
    </Layout>
  );
}


export function CreatorPageEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['page', id],
    queryFn: () => pagesApi.get(id).then((r) => r.data.page),
  });

  useEffect(() => {
    if (data) setForm(buildPageFormState(data));
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await pagesApi.update(id, buildPagePayload(form));
      await qc.invalidateQueries({ queryKey: ['pages'] });
      await qc.invalidateQueries({ queryKey: ['page', id] });
      navigate(`/creator/pages/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout breadcrumbs={[{ label: 'My Pages', path: '/creator/pages' }, { label: data?.name || 'Edit' }]} banner={<ConnectBanner />}>
      {isLoading || !form ? (
        <div className="cr-page-detail cr-page-detail--loading">
          <div className="cr-page-detail-skeleton" />
        </div>
      ) : data?.verificationStatus === 'PENDING' ? (
        <div className="cr-page-detail">
          <Link to={`/creator/pages/${id}`} className="cr-page-back">
            Back to page
          </Link>
          <div className="cr-page-alert cr-page-alert--warn">
            <div>
              <strong>Editing locked</strong>
              <span>This page is under admin review. You can edit it again once the review is complete.</span>
            </div>
          </div>
          <Link to={`/creator/pages/${id}`} className="btn-primary dashboard-pill-btn">View page</Link>
        </div>
      ) : (
        <CreatorPageFormShell
          mode="edit"
          pageId={id}
          pageName={data?.name}
          form={form}
          setForm={setForm}
          error={error}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/creator/pages/${id}`)}
        />
      )}
    </Layout>
  );
}


export function CreatorPageDetail() {
  const { id } = useParams();

  return (
    <Layout breadcrumbs={[{ label: 'My Pages', path: '/creator/pages' }, { label: 'Page' }]} banner={<ConnectBanner />}>
      <CreatorPageDetailView pageId={id} />
    </Layout>
  );
}

export function CreatorDiscover() {
  return (
    <Layout breadcrumbs={[{ label: 'Marketplace' }]} banner={<ConnectBanner />}>
      <CreatorMarketplace />
    </Layout>
  );
}

export function CreatorMarketplacePage() {
  return <CreatorDiscover />;
}

export function CreatorInvitations() {
  const { data } = useQuery({ queryKey: ['invitations'], queryFn: () => marketplaceApi.invitations().then((r) => r.data) });
  const qc = useQueryClient();
  return (
    <Layout breadcrumbs={[{ label: 'Invitations' }]} banner={<ConnectBanner />}>
      <PageHeader title="Invitations" lead="Review brand invitations sent directly to your pages." />
      <ListOrEmpty items={data?.invitations} empty={<p className="text-muted">No invitations</p>}>
        {(items) => items.map((inv) => (
          <div key={inv.id} className="card invitation-card">
            <div>
              <p className="font-medium">{inv.campaign?.name}</p>
              <p className="text-sm text-muted">${Number(inv.offeredAmount)} — {inv.message}</p>
            </div>
            {inv.status === 'PENDING' && (
              <div className="invitation-card__actions">
                <button type="button" className="btn-primary text-sm" onClick={() => marketplaceApi.acceptInvitation(inv.id).then(() => qc.invalidateQueries({ queryKey: ['invitations'] }))}>Accept</button>
                <button type="button" className="btn-ghost text-sm" onClick={() => marketplaceApi.rejectInvitation(inv.id).then(() => qc.invalidateQueries({ queryKey: ['invitations'] }))}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </ListOrEmpty>
    </Layout>
  );
}

export function CreatorCollaborationsList() {
  return (
    <Layout breadcrumbs={[{ label: 'Collaborations' }]} banner={<ConnectBanner />}>
      <CreatorCollaborations />
    </Layout>
  );
}

export function CreatorCollaborationDetail() {
  const { id } = useParams();

  return (
    <Layout breadcrumbs={[{ label: 'Collaborations', path: '/creator/collaborations' }, { label: 'Detail' }]} banner={<ConnectBanner />}>
      <CreatorCollaborationDetailView collaborationId={id} />
    </Layout>
  );
}

export function CreatorEarnings() {
  const qc = useQueryClient();
  const { data: earnings } = useQuery({ queryKey: ['earnings'], queryFn: () => walletApi.earnings().then((r) => r.data) });
  const { data: payouts } = useQuery({ queryKey: ['payouts'], queryFn: () => walletApi.payouts().then((r) => r.data) });
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;

    setLoading(true);
    setFeedback(null);
    try {
      await walletApi.withdraw(value);
      setAmount('');
      setFeedback({ type: 'success', text: 'Payout requested successfully.' });
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['earnings'] }),
        qc.invalidateQueries({ queryKey: ['payouts'] }),
        qc.invalidateQueries({ queryKey: ['wallet'] }),
      ]);
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.error || 'Withdrawal failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout breadcrumbs={[{ label: 'Earnings' }]} banner={<ConnectBanner />}>
      <div className="earnings-page">
        <PageHeader title="Earnings" lead="View balances, withdraw payouts, and track your earnings history." />

        <div className="earnings-kpi-grid">
          <div className="card earnings-kpi">
            <p className="earnings-kpi-label">Available</p>
            <p className="earnings-kpi-value">${Number(earnings?.available || 0).toLocaleString()}</p>
          </div>
          <div className="card earnings-kpi">
            <p className="earnings-kpi-label">Lifetime net</p>
            <p className="earnings-kpi-value">${Number(earnings?.lifetime?.net || 0).toLocaleString()}</p>
          </div>
          <div className="card earnings-kpi">
            <p className="earnings-kpi-label">Platform fee</p>
            <p className="earnings-kpi-value">{(earnings?.feePct || 0.15) * 100}%</p>
          </div>
        </div>

        <div className="earnings-panels">
          <WithdrawCard
            available={Number(earnings?.available || 0)}
            amount={amount}
            onAmountChange={setAmount}
            onSubmit={handleWithdraw}
            loading={loading}
            feedback={feedback}
          />

          <div className="earnings-panel">
            <h3 className="earnings-panel-title">Payout history</h3>
            <ListOrEmpty
              items={payouts?.payouts}
              empty={(
                <div className="earnings-empty">
                  <Icon name="receipt_long" size={28} />
                  <span>No payouts yet</span>
                  <span>Completed withdrawals will appear here.</span>
                </div>
              )}
            >
              {(items) => items.map((p) => (
                <div key={p.id} className="earnings-payout-row">
                  <span>${Number(p.netAmount).toFixed(2)}</span>
                  <StatusPill status={p.status} />
                </div>
              ))}
            </ListOrEmpty>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function CreatorSettings() {
  const [tab, setTab] = useState('profile');
  const tabs = ['profile', 'payout', 'notifications', 'security', 'account'];
  return (
    <Layout breadcrumbs={[{ label: 'Settings' }]} banner={<ConnectBanner />}>
      <PageHeader title="Settings" lead="Manage your profile, payouts, notifications, and account." />
      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      <div className="card max-w-xl">
        {tab === 'profile' && <div className="space-y-4"><div><label className="label">Bio</label><textarea className="input" rows={3} /></div><button className="btn-primary">Save</button></div>}
        {tab === 'payout' && <p className="text-muted">Stripe Connect payout setup.</p>}
        {tab === 'notifications' && <label className="flex gap-2"><input type="checkbox" defaultChecked /> Email notifications</label>}
        {tab === 'security' && <div className="space-y-4"><input type="password" className="input" placeholder="New password" /><button className="btn-primary">Update</button></div>}
        {tab === 'account' && <button className="btn-danger">Close account</button>}
      </div>
    </Layout>
  );
}

export function CreatorHelp() {
  return (
    <Layout breadcrumbs={[{ label: 'Help & Support' }]} banner={<ConnectBanner />}>
      <PageHeader title="Help & Support" lead="Get help from the Myplyn team." />
      <div className="card"><p>Contact {BRAND.supportEmail}</p></div>
    </Layout>
  );
}

export function CreatorApplications() {
  return (
    <Layout breadcrumbs={[{ label: 'Proposals' }]} banner={<ConnectBanner />}>
      <CreatorProposals />
    </Layout>
  );
}

export function CreatorProposalDetailPage() {
  const { id } = useParams();

  return (
    <Layout breadcrumbs={[{ label: 'Proposals', path: '/creator/proposals' }, { label: 'Detail' }]} banner={<ConnectBanner />}>
      <CreatorProposalDetail proposalId={id} />
    </Layout>
  );
}
