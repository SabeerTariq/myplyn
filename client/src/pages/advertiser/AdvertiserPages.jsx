import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardShell from '../../layouts/DashboardShell';
import { advertiserNav } from '../../config/navigation';
import WizardStepper from '../../components/WizardStepper';
import StatusPill from '../../components/StatusPill';
import WorkflowTimeline from '../../components/WorkflowTimeline';
import Modal, { ConfirmModal } from '../../components/Modal';
import TabBar from '../../components/TabBar';
import PageHeader from '../../components/PageHeader';
import ListOrEmpty from '../../components/ListOrEmpty';
import CollaborationMessagesLink from '../../components/CollaborationMessagesLink';
import { campaignsApi, collaborationsApi, taxonomyApi, marketplaceApi, walletApi } from '../../services/api';
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
            <div className="grid grid-cols-2 gap-4">
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
        <div className="flex gap-3 mt-6">
          {step > 1 && <button onClick={() => setStep((s) => s - 1)} className="btn-ghost">Back</button>}
          <button onClick={handleNext} className="btn-primary" disabled={createMut.isPending || publishMut.isPending}>
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
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignsApi.get(id).then((r) => r.data),
  });

  const campaign = data?.campaign;
  const tabs = ['overview', 'applications', 'invited', 'collaborations', 'assets', 'activity'];

  const approveApp = useMutation({
    mutationFn: (appId) => campaignsApi.approveApplication(id, appId),
    onSuccess: () => qc.invalidateQueries(['campaign', id]),
  });

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
          {campaign.applications?.length ? campaign.applications.map((app) => (
            <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div><p className="font-medium">{app.page?.name}</p><p className="text-sm text-muted">${Number(app.proposedPrice)} — {app.message}</p></div>
              <div className="flex gap-2 items-center">
                <StatusPill status={app.status === 'PENDING' ? 'APPLICATION_PENDING' : app.status === 'APPROVED' ? 'ACCEPTED' : 'CANCELLED'} />
                {app.status === 'PENDING' && (
                  <>
                    <button onClick={() => approveApp.mutate(app.id)} className="btn-primary text-sm">Approve</button>
                    <button onClick={() => campaignsApi.rejectApplication(id, app.id).then(() => qc.invalidateQueries(['campaign', id]))} className="btn-ghost text-sm">Reject</button>
                  </>
                )}
              </div>
            </div>
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
      <Modal open={showFund} onClose={() => setShowFund(false)} title="Add funds to wallet">
        <p className="text-subtle" style={{ marginBottom: 16, fontSize: 13 }}>Campaign funding uses your wallet balance. Top up here, then publish or increase budget.</p>
        <div className="flex gap-3">
          <input type="number" className="input max-w-xs" placeholder="Amount" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} />
          <button
            type="button"
            className="btn-primary"
            onClick={() => walletApi.fund(parseFloat(fundAmount)).then(() => {
              qc.invalidateQueries({ queryKey: ['wallet'] });
              setShowFund(false);
              setFundAmount('');
            })}
          >
            Fund (mock)
          </button>
        </div>
      </Modal>
    </Layout>
  );
}

export function AdvertiserCollaborationsList() {
  const { data } = useQuery({ queryKey: ['adv-collabs'], queryFn: () => collaborationsApi.list().then((r) => r.data) });

  return (
    <Layout breadcrumbs={[{ label: 'Collaborations' }]}>
      <PageHeader title="Collaborations" />
      <div className="card space-y-3">
        <ListOrEmpty items={data?.collaborations} empty={<p className="text-muted">No collaborations</p>}>
          {(items) => items.map((c) => (
            <Link key={c.id} to={`/advertiser/collaborations/${c.id}`} className="flex justify-between p-4 border rounded-lg hover:bg-[var(--surface-2)]">
              <div><p className="font-medium">{c.campaign?.name}</p><p className="text-sm text-muted">{c.page?.name}</p></div>
              <StatusPill status={c.status} />
            </Link>
          ))}
        </ListOrEmpty>
      </div>
    </Layout>
  );
}

export function AdvertiserCollaborationDetail() {
  const { id } = useParams();
  const [showVerify, setShowVerify] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [contentForm, setContentForm] = useState({ url: '', notes: '' });
  const qc = useQueryClient();

  const { data } = useQuery({ queryKey: ['collab', id], queryFn: () => collaborationsApi.get(id).then((r) => r.data) });
  const c = data?.collaboration;

  const gross = Number(c?.agreedAmount || 0);
  const fee = gross * 0.15;
  const net = gross - fee;

  return (
    <Layout breadcrumbs={[{ label: 'Collaborations', path: '/advertiser/collaborations' }, { label: 'Detail' }]}>
      {c && (
        <>
          <div className="flex justify-between mb-6">
            <div>
              <h1 className="page-title">{c.campaign?.name}</h1>
              <p className="text-muted">{c.page?.name}</p>
              <CollaborationMessagesLink collaborationId={id} basePath="/advertiser/messages" />
            </div>
            <StatusPill status={c.status} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card"><h3 className="font-semibold mb-4">Timeline</h3><WorkflowTimeline events={c.events} currentStatus={c.status} /></div>
            <div className="card">
              <h3 className="font-semibold mb-4">Actions</h3>
              {c.status === 'ACCEPTED' && <button onClick={() => setShowContent(true)} className="btn-primary mb-2 w-full">Provide content</button>}
              {['PROOF_SUBMITTED', 'IN_REVIEW'].includes(c.status) && (
                <>
                  <div className="text-sm mb-4 panel-muted">Payout: ${gross} gross → ${fee.toFixed(2)} fee → ${net.toFixed(2)} net</div>
                  <button onClick={() => setShowVerify(true)} className="btn-primary w-full">Verify & release payment</button>
                </>
              )}
              {c.proofs?.[0] && <a href={c.proofs[0].proofUrl} target="_blank" rel="noreferrer" className="text-accent-link text-sm mt-2 block">View proof →</a>}
            </div>
          </div>
          <ConfirmModal open={showVerify} onClose={() => setShowVerify(false)} onConfirm={() => { collaborationsApi.verify(id).then(() => qc.invalidateQueries(['collab', id])); setShowVerify(false); }} title="Release payment" message={`Release $${net.toFixed(2)} net to creator (15% platform fee)?`} confirmLabel="Release" />
          <Modal open={showContent} onClose={() => setShowContent(false)} title="Provide promotional content">
            <div className="space-y-4">
              <div><label className="label">Content URL</label><input className="input" value={contentForm.url} onChange={(e) => setContentForm({ ...contentForm, url: e.target.value })} /></div>
              <div><label className="label">Notes</label><textarea className="input" value={contentForm.notes} onChange={(e) => setContentForm({ ...contentForm, notes: e.target.value })} /></div>
              <button onClick={() => { collaborationsApi.provideContent(id, contentForm).then(() => { qc.invalidateQueries(['collab', id]); setShowContent(false); }); }} className="btn-primary">Upload</button>
            </div>
          </Modal>
        </>
      )}
    </Layout>
  );
}

export function AdvertiserMarketplace() {
  const { data } = useQuery({ queryKey: ['creators'], queryFn: () => marketplaceApi.creators({}).then((r) => r.data) });
  const [selected, setSelected] = useState(null);
  const [inviteForm, setInviteForm] = useState({ campaignId: '', offeredAmount: '', message: '' });
  const { data: campaigns } = useQuery({ queryKey: ['adv-campaigns'], queryFn: () => campaignsApi.list({ status: 'LIVE' }).then((r) => r.data) });

  return (
    <Layout breadcrumbs={[{ label: 'Creator Marketplace' }]}>
      <PageHeader title="Creator Marketplace" />
      <div className="grid md:grid-cols-3 gap-4">
        {data?.creators?.map((page) => (
          <div key={page.id} className="card card-interactive" onClick={() => setSelected(page)}>
            <p className="font-medium">{page.name}</p>
            <p className="text-sm text-muted">{page.platform?.name} · {page.followers?.toLocaleString()} followers</p>
            <p className="text-sm text-muted">{page.country}{page.city && `, ${page.city}`}</p>
            {page.verificationStatus === 'VERIFIED' && <span className="text-xs text-ok">✓ Verified</span>}
          </div>
        )) || <p className="text-muted col-span-3">No creators found. Try widening filters.</p>}
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || 'Creator'}>
        {selected && (
          <div className="space-y-4">
            <p>Followers: {selected.followers?.toLocaleString()} · Reach: {selected.avgReach?.toLocaleString()}</p>
            <select className="input" value={inviteForm.campaignId} onChange={(e) => setInviteForm({ ...inviteForm, campaignId: e.target.value })}>
              <option value="">Select campaign</option>
              {campaigns?.campaigns?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input className="input" placeholder="Offered amount" type="number" value={inviteForm.offeredAmount} onChange={(e) => setInviteForm({ ...inviteForm, offeredAmount: e.target.value })} />
            <textarea className="input" placeholder="Message" value={inviteForm.message} onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })} />
            <button className="btn-primary" onClick={() => marketplaceApi.invite({ ...inviteForm, creatorUserId: selected.creator?.userId, pageId: selected.id, offeredAmount: parseFloat(inviteForm.offeredAmount) }).then(() => setSelected(null))}>Send request</button>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

export function AdvertiserWallet() {
  const { data: wallet } = useQuery({ queryKey: ['wallet'], queryFn: () => walletApi.get().then((r) => r.data) });
  const { data: txs } = useQuery({ queryKey: ['transactions'], queryFn: () => walletApi.transactions().then((r) => r.data) });
  const [fundAmount, setFundAmount] = useState('');
  const qc = useQueryClient();

  return (
    <Layout breadcrumbs={[{ label: 'Wallet & Payments' }]}>
      <PageHeader title="Wallet & Payments" />
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card"><p className="text-sm text-muted">Balance</p><p className="stat-value">${Number(wallet?.wallet?.balance || 0).toLocaleString()}</p></div>
        <div className="card"><p className="text-sm text-muted">In holding</p><p className="stat-value">${Number(wallet?.wallet?.heldBalance || 0).toLocaleString()}</p></div>
      </div>
      <div className="card mb-6">
        <h3 className="font-semibold mb-4">Add funds</h3>
        <div className="flex gap-3">
          <input type="number" className="input max-w-xs" placeholder="Amount" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} />
          <button className="btn-primary" onClick={() => walletApi.fund(parseFloat(fundAmount)).then(() => { qc.invalidateQueries({ queryKey: ['wallet'] }); qc.invalidateQueries({ queryKey: ['transactions'] }); setFundAmount(''); })}>Fund (mock)</button>
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">Transactions</h3>
        <ListOrEmpty items={txs?.transactions} empty={<p className="text-muted">No transactions</p>}>
          {(items) => items.map((t) => (
            <div key={t.id} className="flex justify-between py-2 border-b text-sm">
              <span>{t.type} — {t.description}</span>
              <span>${Number(t.gross).toFixed(2)}</span>
            </div>
          ))}
        </ListOrEmpty>
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
