import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardShell from '../../layouts/DashboardShell';
import { advertiserNav } from '../../config/navigation';
import WizardStepper from '../../components/WizardStepper';
import StatusPill from '../../components/StatusPill';
import Modal, { ConfirmModal } from '../../components/Modal';
import Select from '../../components/Select';
import TabBar from '../../components/TabBar';
import PageHeader from '../../components/PageHeader';
import ListOrEmpty from '../../components/ListOrEmpty';
import KpiCard from '../../components/KpiCard';
import Icon from '../../components/Icon';
import AdvertiserCollaborations from '../../components/advertiser/AdvertiserCollaborations';
import AdvertiserCollaborationDetailView from '../../components/advertiser/AdvertiserCollaborationDetail';
import AdvertiserProposals from '../../components/advertiser/AdvertiserProposals';
import AdvertiserProposalDetailView from '../../components/advertiser/AdvertiserProposalDetail';
import AdvertiserMarketplaceView from '../../components/advertiser/AdvertiserMarketplace';
import AddFundsCard from '../../components/wallet/AddFundsCard';
import { campaignsApi, taxonomyApi, walletApi } from '../../services/api';
import { BRAND } from '../../config/brand';

const WIZARD_STEPS = ['Basics', 'Targeting', 'Media', 'Budget', 'Review & Fund'];

function Layout({ breadcrumbs, children }) {
  return <DashboardShell navConfig={advertiserNav} role="ADVERTISER" breadcrumbs={breadcrumbs}>{children}</DashboardShell>;
}

export function CampaignWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', description: '', requirements: '', budgetTotal: '', perPlacement: '', startDate: '', endDate: '', countries: [], cities: [], nicheIds: [], platformIds: [] });

  const { data: niches } = useQuery({ queryKey: ['niches'], queryFn: () => taxonomyApi.niches().then((r) => r.data.niches) });
  const { data: platforms } = useQuery({ queryKey: ['platforms'], queryFn: () => taxonomyApi.platforms().then((r) => r.data.platforms) });

  const createMut = useMutation({
    mutationFn: () => campaignsApi.create({ name: form.name, description: form.description, requirements: form.requirements }),
    onSuccess: (res) => navigate(`/advertiser/campaigns/${res.data.campaign.id}/edit`, { replace: true }),
  });

  const saveMut = useMutation({
    mutationFn: (campaignId) => campaignsApi.updateWizard(campaignId, { step, ...form, budgetTotal: parseFloat(form.budgetTotal) || 0, perPlacement: parseFloat(form.perPlacement) || 0 }),
  });

  const publishMut = useMutation({
    mutationFn: (campaignId) => campaignsApi.publish(campaignId),
    onSuccess: () => { qc.invalidateQueries(['adv-campaigns']); navigate('/advertiser/campaigns'); },
  });

  const campaignId = id && id !== 'new' ? id : null;

  const { data: existingData } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => campaignsApi.get(campaignId).then((r) => r.data.campaign),
    enabled: !!campaignId,
  });

  useEffect(() => {
    if (!existingData) return;
    let countries = [];
    let cities = [];
    try {
      if (existingData.targeting?.countries) countries = JSON.parse(existingData.targeting.countries);
      if (existingData.targeting?.cities) cities = JSON.parse(existingData.targeting.cities);
    } catch {
      countries = existingData.targeting?.countries || [];
      cities = existingData.targeting?.cities || [];
    }
    setForm({
      name: existingData.name || '',
      description: existingData.description || '',
      requirements: existingData.requirements || '',
      budgetTotal: existingData.budgetTotal != null ? String(existingData.budgetTotal) : '',
      perPlacement: existingData.perPlacement != null ? String(existingData.perPlacement) : '',
      startDate: existingData.startDate ? existingData.startDate.slice(0, 10) : '',
      endDate: existingData.endDate ? existingData.endDate.slice(0, 10) : '',
      countries,
      cities,
      nicheIds: existingData.niches?.map((n) => n.nicheId || n.niche?.id).filter(Boolean) || [],
      platformIds: existingData.platforms?.map((p) => p.platformId || p.platform?.id).filter(Boolean) || [],
    });
    if (existingData.wizardStep) setStep(existingData.wizardStep);
  }, [existingData]);

  const handleNext = async () => {
    if (!campaignId && step === 1) {
      createMut.mutate();
      return;
    }
    if (campaignId) await saveMut.mutateAsync(campaignId);
    if (step < 5) setStep((s) => s + 1);
    else publishMut.mutate(campaignId);
  };

  return (
    <Layout breadcrumbs={[{ label: 'Campaigns', path: '/advertiser/campaigns' }, { label: 'Create Campaign' }]}>
      <PageHeader title="Create Campaign" />
      <WizardStepper steps={WIZARD_STEPS} currentStep={step} />
      <div className="card max-w-2xl">
        {step === 1 && (
          <div className="space-y-4">
            <div><label className="label">Campaign name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><label className="label">Promotion requirements</label><textarea className="input" rows={3} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div><label className="label">Countries (comma-separated)</label><input className="input" onChange={(e) => setForm({ ...form, countries: e.target.value.split(',').map((s) => s.trim()) })} /></div>
            <div><label className="label">Niches</label>
              <div className="flex flex-wrap gap-2">{niches?.map((n) => (
                <label key={n.id} className="flex items-center gap-1 text-sm">
                  <input type="checkbox" checked={form.nicheIds.some((i) => String(i) === String(n.id))} onChange={(e) => setForm({ ...form, nicheIds: e.target.checked ? [...form.nicheIds, n.id] : form.nicheIds.filter((i) => String(i) !== String(n.id)) })} />
                  {n.name}
                </label>
              ))}</div>
            </div>
            <div><label className="label">Platforms</label>
              <div className="flex flex-wrap gap-2">{platforms?.map((p) => (
                <label key={p.id} className="flex items-center gap-1 text-sm">
                  <input type="checkbox" checked={form.platformIds.some((i) => String(i) === String(p.id))} onChange={(e) => setForm({ ...form, platformIds: e.target.checked ? [...form.platformIds, p.id] : form.platformIds.filter((i) => String(i) !== String(p.id)) })} />
                  {p.name}
                </label>
              ))}</div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <label className="label">Upload media assets</label>
            <input type="file" className="input" onChange={(e) => campaignId && e.target.files[0] && campaignsApi.uploadAsset(campaignId, e.target.files[0])} />
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <div><label className="label">Total budget ($)</label><input type="number" className="input" value={form.budgetTotal} onChange={(e) => setForm({ ...form, budgetTotal: e.target.value })} /></div>
            <div><label className="label">Per placement ($)</label><input type="number" className="input" value={form.perPlacement} onChange={(e) => setForm({ ...form, perPlacement: e.target.value })} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label">Start date</label><input type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
              <div><label className="label">End date</label><input type="date" className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="space-y-3">
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Budget:</strong> ${form.budgetTotal}</p>
            <p className="text-sm text-muted">15% platform fee applies on completion. Funds will be held in escrow.</p>
          </div>
        )}
        <div className="flex gap-3 mt-6 wizard-footer">
          {step > 1 && <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-ghost">Back</button>}
          <button type="button" onClick={handleNext} className="btn-primary" disabled={createMut.isPending || publishMut.isPending}>
            {step === 5 ? 'Publish & Fund' : 'Continue'}
          </button>
        </div>
      </div>
    </Layout>
  );
}

export function CampaignDetail() {
  const { id } = useParams();
  const [tab, setTab] = useState('overview');
  const [showPause, setShowPause] = useState(false);
  const [showFund, setShowFund] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [fundFeedback, setFundFeedback] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignsApi.get(id).then((r) => r.data),
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletApi.get().then((r) => r.data.wallet),
    enabled: showFund,
  });

  const fundMut = useMutation({
    mutationFn: (amount) => walletApi.fund(amount).then((r) => r.data),
    onSuccess: (_data, amount) => {
      setFundFeedback({ type: 'success', text: `Added $${amount.toLocaleString()} to your wallet.` });
      setFundAmount('');
      qc.invalidateQueries({ queryKey: ['wallet'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (err) => {
      setFundFeedback({ type: 'error', text: err.response?.data?.error || 'Funding failed. Try again.' });
    },
  });

  const campaign = data?.campaign;
  const tabs = ['overview', 'applications', 'invited', 'collaborations', 'assets', 'activity'];

  const handleCampaignFund = (e) => {
    e.preventDefault();
    setFundFeedback(null);
    const amount = parseFloat(fundAmount);
    if (!amount || amount <= 0) {
      setFundFeedback({ type: 'error', text: 'Enter an amount greater than 0.' });
      return;
    }
    fundMut.mutate(amount);
  };

  const closeFundModal = () => {
    setShowFund(false);
    setFundAmount('');
    setFundFeedback(null);
  };

  if (isLoading) return <Layout breadcrumbs={[]}><p>Loading...</p></Layout>;
  if (!campaign) return <Layout breadcrumbs={[]}><p>Campaign not found</p></Layout>;

  return (
    <Layout breadcrumbs={[{ label: 'Campaigns', path: '/advertiser/campaigns' }, { label: campaign.name }]}>
      <div className="flex items-start justify-between" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">{campaign.name}</h1>
          <div style={{ marginTop: 8 }}><StatusPill status={campaign.status} /></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFund(true)} className="btn-ghost">Add funds</button>
          {campaign.status === 'LIVE' && <button onClick={() => setShowPause(true)} className="btn-ghost">Pause</button>}
        </div>
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card"><h3 className="font-semibold mb-2">Description</h3><p className="text-subtle">{campaign.description}</p></div>
          <div className="card"><h3 className="font-semibold mb-2">Budget</h3><p>Total: ${Number(campaign.budgetTotal).toLocaleString()}</p><p>Held: ${Number(campaign.budgetHeld).toLocaleString()}</p><p>Spent: ${Number(campaign.budgetSpent).toLocaleString()}</p></div>
        </div>
      )}

      {tab === 'applications' && (
        <div className="card space-y-3">
          <div className="flex items-center justify-between gap-3" style={{ marginBottom: 12 }}>
            <p className="text-muted" style={{ margin: 0 }}>Review and compare proposals in your inbox.</p>
            <Link
              to={`/advertiser/proposals?tab=pending&campaign=${id}`}
              className="btn-primary dashboard-pill-btn text-sm"
            >
              Open proposals inbox
            </Link>
          </div>
          {campaign.applications?.length ? campaign.applications.map((app) => (
            <Link
              key={app.id}
              to={`/advertiser/proposals/${app.id}`}
              className="flex items-center justify-between p-3 border rounded-lg no-underline text-inherit transition-colors hover:bg-[var(--surface-2)]"
            >
              <div><p className="font-medium">{app.page?.name}</p><p className="text-sm text-muted">${Number(app.proposedPrice)} — {app.message}</p></div>
              <StatusPill status={app.status === 'PENDING' ? 'APPLICATION_PENDING' : app.status === 'APPROVED' ? 'ACCEPTED' : 'CANCELLED'} />
            </Link>
          )) : <p className="text-muted">No applications yet</p>}
        </div>
      )}

      {tab === 'invited' && (
        <div className="card space-y-3">
          <ListOrEmpty items={campaign.invitations} empty={<p className="text-muted">No invitations sent</p>}>
            {(items) => items.map((inv) => (
              <div key={inv.id} className="flex justify-between p-3 border rounded-lg">
                <span>{inv.page?.name}</span>
                <span className="text-sm">${Number(inv.offeredAmount)} — {inv.status}</span>
              </div>
            ))}
          </ListOrEmpty>
        </div>
      )}

      {tab === 'collaborations' && (
        <div className="card space-y-3">
          <ListOrEmpty items={campaign.collaborations} empty={<p className="text-muted">No collaborations</p>}>
            {(items) => items.map((c) => (
              <Link key={c.id} to={`/advertiser/collaborations/${c.id}`} className="flex justify-between p-3 border rounded-lg hover:bg-[var(--surface-2)]">
                <span>{c.page?.name}</span>
                <StatusPill status={c.status} />
              </Link>
            ))}
          </ListOrEmpty>
        </div>
      )}

      {tab === 'assets' && (
        <div className="card">
          <ListOrEmpty items={campaign.assets} empty={<p className="text-muted">No assets</p>}>
            {(items) => items.map((a) => <p key={a.id}>{a.fileName}</p>)}
          </ListOrEmpty>
        </div>
      )}

      {tab === 'activity' && (
        <div className="card"><p className="text-muted text-sm">Activity log for campaign events</p></div>
      )}

      <ConfirmModal open={showPause} onClose={() => setShowPause(false)} onConfirm={() => { campaignsApi.pause(id).then(() => qc.invalidateQueries({ queryKey: ['campaign', id] })); setShowPause(false); }} title="Pause campaign" message="Campaign will stop accepting new applications." confirmLabel="Pause" />
      <Modal open={showFund} onClose={closeFundModal} title="Add funds to wallet">
        <p className="text-subtle" style={{ marginBottom: 16, fontSize: 13 }}>
          Campaign funding uses your wallet balance. Top up here, then publish or increase budget.
        </p>
        <AddFundsCard
          compact
          currentBalance={Number(wallet?.balance || 0)}
          amount={fundAmount}
          onAmountChange={setFundAmount}
          onSubmit={handleCampaignFund}
          loading={fundMut.isPending}
          feedback={fundFeedback}
          submitLabel="Add funds to wallet"
        />
      </Modal>
    </Layout>
  );
}

export function AdvertiserCollaborationsList() {
  return (
    <Layout breadcrumbs={[{ label: 'Collaborations' }]}>
      <AdvertiserCollaborations />
    </Layout>
  );
}

export function AdvertiserCollaborationDetail() {
  const { id } = useParams();

  return (
    <Layout breadcrumbs={[{ label: 'Collaborations', path: '/advertiser/collaborations' }, { label: 'Detail' }]}>
      <AdvertiserCollaborationDetailView collaborationId={id} />
    </Layout>
  );
}

export function AdvertiserProposalsList() {
  return (
    <Layout breadcrumbs={[{ label: 'Proposals' }]}>
      <AdvertiserProposals />
    </Layout>
  );
}

export function AdvertiserProposalDetail() {
  const { id } = useParams();

  return (
    <Layout breadcrumbs={[{ label: 'Proposals', path: '/advertiser/proposals' }, { label: 'Detail' }]}>
      <AdvertiserProposalDetailView proposalId={id} />
    </Layout>
  );
}

export function AdvertiserMarketplace() {
  return (
    <Layout breadcrumbs={[{ label: 'Creator Marketplace' }]}>
      <AdvertiserMarketplaceView />
    </Layout>
  );
}

const TX_META = {
  FUND: { label: 'Top-up', icon: 'add_card', color: 'var(--good)', sign: '+' },
  HOLD: { label: 'Held for collaboration', icon: 'lock', color: 'var(--warn)', sign: '−' },
  RELEASE: { label: 'Released to creator', icon: 'send', color: 'var(--text)', sign: '−' },
  COMMISSION: { label: 'Platform commission', icon: 'percent', color: 'var(--text-3)', sign: '−' },
  REFUND: { label: 'Refund', icon: 'undo', color: 'var(--good)', sign: '+' },
  PAYOUT: { label: 'Payout', icon: 'payments', color: 'var(--text)', sign: '−' },
};

function formatTxDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function AdvertiserWallet() {
  const qc = useQueryClient();
  const [fundAmount, setFundAmount] = useState('');
  const [feedback, setFeedback] = useState(null);

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => walletApi.get().then((r) => r.data.wallet),
    refetchOnWindowFocus: true,
  });
  const { data: txs, isLoading: txLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => walletApi.transactions().then((r) => r.data),
    refetchOnWindowFocus: true,
  });

  const fundMut = useMutation({
    mutationFn: (amount) => walletApi.fund(amount).then((r) => r.data),
    onSuccess: (_data, amount) => {
      setFeedback({ type: 'success', text: `Added $${amount.toLocaleString()} to your wallet.` });
      setFundAmount('');
      qc.invalidateQueries({ queryKey: ['wallet'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (err) => {
      setFeedback({ type: 'error', text: err.response?.data?.error || 'Funding failed. Try again.' });
    },
  });

  const balance = Number(wallet?.balance || 0);
  const held = Number(wallet?.heldBalance || 0);
  const feePct = Number(wallet?.feePct ?? 0.15);
  const total = balance + held;

  const handleFund = (e) => {
    e.preventDefault();
    setFeedback(null);
    const amount = parseFloat(fundAmount);
    if (!amount || amount <= 0) {
      setFeedback({ type: 'error', text: 'Enter an amount greater than 0.' });
      return;
    }
    fundMut.mutate(amount);
  };

  return (
    <Layout breadcrumbs={[{ label: 'Wallet & Payments' }]}>
      <PageHeader
        title="Wallet & Payments"
        lead="Fund your wallet, track held campaign budgets, and review every transaction."
      />

      <div className="dashboard-summary-grid dashboard-summary-grid--4" style={{ marginTop: 0, marginBottom: 22 }}>
        <KpiCard
          title="Available balance"
          value={walletLoading ? '—' : `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="account_balance_wallet"
          iconColor="var(--good)"
        />
        <KpiCard
          title="Held for campaigns"
          value={walletLoading ? '—' : `$${held.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="lock"
          iconColor="var(--warn)"
        />
        <KpiCard
          title="Total funds"
          value={walletLoading ? '—' : `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon="savings"
          iconColor="var(--info)"
        />
        <KpiCard
          title="Platform fee"
          value={`${(feePct * 100).toFixed(0)}%`}
          icon="percent"
          iconColor="var(--text-3)"
        />
      </div>

      <AddFundsCard
        currentBalance={balance}
        amount={fundAmount}
        onAmountChange={(value) => {
          setFundAmount(value);
          if (feedback) setFeedback(null);
        }}
        onSubmit={handleFund}
        loading={fundMut.isPending}
        feedback={feedback}
      />

      <div className="card">
        <h3 className="font-semibold mb-4">Transaction history</h3>
        {txLoading ? (
          <p className="text-muted text-sm">Loading transactions…</p>
        ) : (
          <ListOrEmpty items={txs?.transactions} empty={<p className="text-muted text-sm">No transactions yet. Fund your wallet to get started.</p>}>
            {(items) => items.map((t) => {
              const meta = TX_META[t.type] || { label: t.type, icon: 'receipt_long', color: 'var(--text)', sign: '' };
              return (
                <div key={t.id} className="flex items-center justify-between py-3 border-b" style={{ gap: 12 }}>
                  <div className="flex items-center" style={{ gap: 12, minWidth: 0 }}>
                    <span
                      className="flex items-center justify-center"
                      style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', flex: 'none', color: meta.color }}
                    >
                      <Icon name={meta.icon} size={18} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div className="text-sm font-semibold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.description || meta.label}
                      </div>
                      <div className="text-xs text-muted">{meta.label} · {formatTxDate(t.createdAt)}</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold" style={{ flex: 'none', color: meta.color }}>
                    {meta.sign}${Number(t.gross).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </ListOrEmpty>
        )}
      </div>
    </Layout>
  );
}

export function AdvertiserSettings() {
  const [tab, setTab] = useState('profile');
  const tabs = ['profile', 'billing', 'team', 'notifications', 'security', 'account'];
  return (
    <Layout breadcrumbs={[{ label: 'Settings' }]}>
      <PageHeader title="Settings" />
      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      <div className="card max-w-xl">
        {tab === 'profile' && <div className="space-y-4"><div><label className="label">Company name</label><input className="input" /></div><div><label className="label">Website</label><input className="input" /></div><button className="btn-primary">Save</button></div>}
        {tab === 'billing' && <p className="text-muted">Manage payment methods via Stripe.</p>}
        {tab === 'team' && <p className="text-muted">Invite team members to manage campaigns.</p>}
        {tab === 'notifications' && <div className="space-y-2"><label className="flex gap-2"><input type="checkbox" defaultChecked /> Email notifications</label><label className="flex gap-2"><input type="checkbox" defaultChecked /> Application alerts</label></div>}
        {tab === 'security' && <div className="space-y-4"><div><label className="label">Current password</label><input type="password" className="input" /></div><div><label className="label">New password</label><input type="password" className="input" /></div><button className="btn-primary">Update password</button></div>}
        {tab === 'account' && <div><button className="btn-ghost">Export data</button><button className="btn-danger ml-3">Close account</button></div>}
      </div>
    </Layout>
  );
}

export function AdvertiserHelp() {
  return (
    <Layout breadcrumbs={[{ label: 'Help & Support' }]}>
      <PageHeader title="Help & Support" />
      <div className="card"><p>Contact {BRAND.supportEmail} or browse our FAQ.</p></div>
    </Layout>
  );
}
