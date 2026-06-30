import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardShell from '../../layouts/DashboardShell';
import { creatorNav } from '../../config/navigation';
import KpiCard from '../../components/KpiCard';
import EmptyState from '../../components/EmptyState';
import StatusPill from '../../components/StatusPill';
import WorkflowTimeline from '../../components/WorkflowTimeline';
import Modal, { ConfirmModal } from '../../components/Modal';
import TabBar from '../../components/TabBar';
import PageHeader from '../../components/PageHeader';
import ListOrEmpty from '../../components/ListOrEmpty';
import CollaborationMessagesLink from '../../components/CollaborationMessagesLink';
import { pagesApi, marketplaceApi, collaborationsApi, walletApi, taxonomyApi } from '../../services/api';
import { BRAND } from '../../config/brand';
import { useAuth } from '../../hooks/useAuth';

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
  const { data: earnings } = useQuery({ queryKey: ['earnings'], queryFn: () => walletApi.earnings().then((r) => r.data) });
  const { data: collabs } = useQuery({ queryKey: ['cre-collabs'], queryFn: () => collaborationsApi.list().then((r) => r.data) });
  const { data: invitations } = useQuery({ queryKey: ['invitations'], queryFn: () => marketplaceApi.invitations().then((r) => r.data) });
  const { data: pages } = useQuery({ queryKey: ['pages'], queryFn: () => pagesApi.list().then((r) => r.data) });

  if (!pages?.pages?.length) {
    return (
      <Layout breadcrumbs={[{ label: 'Dashboard' }]} banner={<ConnectBanner />}>
        <EmptyState title="Complete your profile" description="List a page, connect payouts, and start earning." action={<Link to="/creator/pages/new" className="btn-primary">+ List a Page</Link>} />
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={[{ label: 'Dashboard' }]} banner={<ConnectBanner />}>
      <h1 className="page-title mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KpiCard title="Available Balance" value={`$${Number(earnings?.available || 0).toLocaleString()}`} />
        <KpiCard title="Pending" value={`$${Number(earnings?.pending || 0).toLocaleString()}`} />
        <KpiCard title="Total Earned" value={`$${Number(earnings?.lifetime?.net || 0).toLocaleString()}`} />
        <KpiCard title="Active Collabs" value={collabs?.collaborations?.filter((c) => !['PAID_OUT', 'CANCELLED'].includes(c.status)).length || 0} />
        <KpiCard title="New Invitations" value={invitations?.invitations?.filter((i) => i.status === 'PENDING').length || 0} />
      </div>
    </Layout>
  );
}

export function CreatorPagesList() {
  const { data } = useQuery({ queryKey: ['pages'], queryFn: () => pagesApi.list().then((r) => r.data) });
  return (
    <Layout breadcrumbs={[{ label: 'My Pages' }]} banner={<ConnectBanner />}>
      <div className="flex justify-between mb-6">
        <h1 className="page-title">My Pages</h1>
        <Link to="/creator/pages/new" className="btn-primary">+ Add page</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <ListOrEmpty items={data?.pages} empty={<p className="text-muted">No pages listed</p>}>
          {(pages) => pages.map((p) => (
            <Link key={p.id} to={`/creator/pages/${p.id}`} className="card card-interactive">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-muted">{p.platform?.name} · {p.followers?.toLocaleString()} followers</p>
              <span className={`text-xs ${p.verificationStatus === 'VERIFIED' ? 'text-ok' : 'text-muted'}`}>{p.verificationStatus}</span>
            </Link>
          ))}
        </ListOrEmpty>
      </div>
    </Layout>
  );
}

export function CreatorPageForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ platformId: '', nicheId: '', name: '', url: '', followers: '', avgReach: '', country: '', city: '' });
  const { data: platforms } = useQuery({ queryKey: ['platforms'], queryFn: () => taxonomyApi.platforms().then((r) => r.data.platforms) });
  const { data: niches } = useQuery({ queryKey: ['niches'], queryFn: () => taxonomyApi.niches().then((r) => r.data.niches) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await pagesApi.create({ ...form, followers: parseInt(form.followers), avgReach: parseInt(form.avgReach) || 0 });
    navigate('/creator/pages');
  };

  return (
    <Layout breadcrumbs={[{ label: 'My Pages', path: '/creator/pages' }, { label: 'Add page' }]} banner={<ConnectBanner />}>
      <h1 className="page-title mb-6">List a Page</h1>
      <form onSubmit={handleSubmit} className="card max-w-xl space-y-4">
        <div><label className="label">Platform</label><select className="input" required value={form.platformId} onChange={(e) => setForm({ ...form, platformId: e.target.value })}><option value="">Select</option>{platforms?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        <div><label className="label">Niche</label><select className="input" value={form.nicheId} onChange={(e) => setForm({ ...form, nicheId: e.target.value })}><option value="">Select</option>{niches?.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}</select></div>
        <div><label className="label">Page name</label><input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="label">Profile URL</label><input className="input" type="url" required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Followers</label><input type="number" className="input" required value={form.followers} onChange={(e) => setForm({ ...form, followers: e.target.value })} /></div>
          <div><label className="label">Avg reach</label><input type="number" className="input" value={form.avgReach} onChange={(e) => setForm({ ...form, avgReach: e.target.value })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">Country</label><input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
          <div><label className="label">City</label><input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
        </div>
        <button type="submit" className="btn-primary">Submit for verification</button>
      </form>
    </Layout>
  );
}


export function CreatorPageDetail() {
  const { id } = useParams();
  const { data } = useQuery({ queryKey: ['page', id], queryFn: () => pagesApi.get(id).then((r) => r.data) });
  const p = data?.page;
  return (
    <Layout breadcrumbs={[{ label: 'My Pages', path: '/creator/pages' }, { label: p?.name || 'Page' }]} banner={<ConnectBanner />}>
      {p && (
        <div className="card max-w-2xl">
          <h1 className="page-title">{p.name}</h1>
          <p className="text-muted">{p.platform?.name} · {p.verificationStatus}</p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div><p className="text-sm text-muted">Followers</p><p className="font-bold">{p.followers?.toLocaleString()}</p></div>
            <div><p className="text-sm text-muted">Reach</p><p className="font-bold">{p.avgReach?.toLocaleString()}</p></div>
            <div><p className="text-sm text-muted">Engagement</p><p className="font-bold">{p.engagement || '—'}%</p></div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export function CreatorDiscover() {
  const { data } = useQuery({ queryKey: ['discover'], queryFn: () => marketplaceApi.campaigns({}).then((r) => r.data) });
  const [selected, setSelected] = useState(null);
  const [applyForm, setApplyForm] = useState({ pageId: '', message: '', proposedPrice: '' });
  const { data: pages } = useQuery({ queryKey: ['pages'], queryFn: () => pagesApi.list().then((r) => r.data) });

  return (
    <Layout breadcrumbs={[{ label: 'Discover Campaigns' }]} banner={<ConnectBanner />}>
      <h1 className="page-title mb-6">Discover Campaigns</h1>
      <div className="space-y-4">
        <ListOrEmpty items={data?.campaigns} empty={<p className="text-muted">No campaigns match your filters.</p>}>
          {(campaigns) => campaigns.map((c) => (
            <div key={c.id} className="card card-interactive flex justify-between items-center" onClick={() => setSelected(c)}>
              <div><p className="font-medium">{c.name}</p><p className="text-sm text-muted">{c.advertiser?.companyName} · ${Number(c.budgetTotal).toLocaleString()}</p></div>
              <StatusPill status={c.status} />
            </div>
          ))}
        </ListOrEmpty>
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="space-y-4">
            <p>{selected.description}</p>
            <select className="input" value={applyForm.pageId} onChange={(e) => setApplyForm({ ...applyForm, pageId: e.target.value })}>
              <option value="">Select your page</option>
              {pages?.pages?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input className="input" placeholder="Proposed price" type="number" value={applyForm.proposedPrice} onChange={(e) => setApplyForm({ ...applyForm, proposedPrice: e.target.value })} />
            <textarea className="input" placeholder="Your pitch" value={applyForm.message} onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })} />
            <button className="btn-primary" onClick={() => marketplaceApi.apply({ campaignId: selected.id, ...applyForm, proposedPrice: parseFloat(applyForm.proposedPrice) }).then(() => setSelected(null))}>Apply</button>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

export function CreatorInvitations() {
  const { data } = useQuery({ queryKey: ['invitations'], queryFn: () => marketplaceApi.invitations().then((r) => r.data) });
  const qc = useQueryClient();
  return (
    <Layout breadcrumbs={[{ label: 'Invitations' }]} banner={<ConnectBanner />}>
      <h1 className="page-title mb-6">Invitations</h1>
      <ListOrEmpty items={data?.invitations} empty={<p className="text-muted">No invitations</p>}>
        {(items) => items.map((inv) => (
          <div key={inv.id} className="card mb-4 flex justify-between items-center">
            <div><p className="font-medium">{inv.campaign?.name}</p><p className="text-sm text-muted">${Number(inv.offeredAmount)} — {inv.message}</p></div>
            {inv.status === 'PENDING' && (
              <div className="flex gap-2">
                <button className="btn-primary text-sm" onClick={() => marketplaceApi.acceptInvitation(inv.id).then(() => qc.invalidateQueries({ queryKey: ['invitations'] }))}>Accept</button>
                <button className="btn-ghost text-sm" onClick={() => marketplaceApi.rejectInvitation(inv.id).then(() => qc.invalidateQueries({ queryKey: ['invitations'] }))}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </ListOrEmpty>
    </Layout>
  );
}

export function CreatorCollaborationsList() {
  const { data } = useQuery({ queryKey: ['cre-collabs'], queryFn: () => collaborationsApi.list().then((r) => r.data) });
  return (
    <Layout breadcrumbs={[{ label: 'Collaborations' }]} banner={<ConnectBanner />}>
      <h1 className="page-title mb-6">Collaborations</h1>
      <ListOrEmpty items={data?.collaborations} empty={<p className="text-muted">No collaborations</p>}>
        {(items) => items.map((c) => (
          <Link key={c.id} to={`/creator/collaborations/${c.id}`} className="card mb-3 flex justify-between card-interactive">
            <span>{c.campaign?.name} — {c.page?.name}</span>
            <StatusPill status={c.status} />
          </Link>
        ))}
      </ListOrEmpty>
    </Layout>
  );
}

export function CreatorCollaborationDetail() {
  const { id } = useParams();
  const [showProof, setShowProof] = useState(false);
  const [proofForm, setProofForm] = useState({ proofUrl: '', notes: '' });
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['collab', id], queryFn: () => collaborationsApi.get(id).then((r) => r.data) });
  const c = data?.collaboration;
  const gross = Number(c?.agreedAmount || 0);

  return (
    <Layout breadcrumbs={[{ label: 'Collaborations', path: '/creator/collaborations' }, { label: 'Detail' }]} banner={<ConnectBanner />}>
      {c && (
        <>
          <div className="flex justify-between mb-6">
            <div>
              <h1 className="page-title">{c.campaign?.name}</h1>
              <CollaborationMessagesLink collaborationId={id} basePath="/creator/messages" />
            </div>
            <StatusPill status={c.status} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card"><WorkflowTimeline events={c.events} currentStatus={c.status} /></div>
            <div className="card">
              <p className="text-sm mb-4">Expected payout: ${gross} gross → ${(gross * 0.15).toFixed(2)} fee → ${(gross * 0.85).toFixed(2)} net</p>
              {c.status === 'CONTENT_PROVIDED' && <button onClick={() => collaborationsApi.markPublished(id).then(() => qc.invalidateQueries(['collab', id]))} className="btn-primary w-full mb-2">Mark as published</button>}
              {c.status === 'PUBLISHED' && <button onClick={() => setShowProof(true)} className="btn-primary w-full">Submit proof</button>}
              {c.content?.length > 0 && <div className="mt-4 panel-muted"><p className="font-medium">Provided content:</p>{c.content.map((x) => <a key={x.id} href={x.url} className="text-accent-link block">{x.url || x.fileName}</a>)}</div>}
            </div>
          </div>
          <Modal open={showProof} onClose={() => setShowProof(false)} title="Submit proof">
            <div className="space-y-4">
              <div><label className="label">Post URL</label><input className="input" value={proofForm.proofUrl} onChange={(e) => setProofForm({ ...proofForm, proofUrl: e.target.value })} /></div>
              <div><label className="label">Screenshot</label><input type="file" className="input" /></div>
              <button className="btn-primary" onClick={() => collaborationsApi.submitProof(id, proofForm).then(() => { qc.invalidateQueries(['collab', id]); setShowProof(false); })}>Submit</button>
            </div>
          </Modal>
        </>
      )}
    </Layout>
  );
}

export function CreatorEarnings() {
  const { data: earnings } = useQuery({ queryKey: ['earnings'], queryFn: () => walletApi.earnings().then((r) => r.data) });
  const { data: payouts } = useQuery({ queryKey: ['payouts'], queryFn: () => walletApi.payouts().then((r) => r.data) });
  const [amount, setAmount] = useState('');
  return (
    <Layout breadcrumbs={[{ label: 'Earnings & Payouts' }]} banner={<ConnectBanner />}>
      <h1 className="page-title mb-6">Earnings & Payouts</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card"><p className="text-sm text-muted">Available</p><p className="stat-value">${Number(earnings?.available || 0).toLocaleString()}</p></div>
        <div className="card"><p className="text-sm text-muted">Lifetime net</p><p className="stat-value">${Number(earnings?.lifetime?.net || 0).toLocaleString()}</p></div>
        <div className="card"><p className="text-sm text-muted">Platform fee</p><p className="stat-value">{(earnings?.feePct || 0.15) * 100}%</p></div>
      </div>
      <div className="card mb-6">
        <h3 className="font-semibold mb-4">Withdraw</h3>
        <div className="flex gap-3"><input type="number" className="input max-w-xs" value={amount} onChange={(e) => setAmount(e.target.value)} /><button className="btn-primary" onClick={() => walletApi.withdraw(parseFloat(amount))}>Withdraw</button></div>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">Payout history</h3>
        <ListOrEmpty items={payouts?.payouts} empty={<p className="text-muted">No payouts yet</p>}>
          {(items) => items.map((p) => (
            <div key={p.id} className="flex justify-between py-2 border-b text-sm"><span>${Number(p.netAmount).toFixed(2)}</span><span>{p.status}</span></div>
          ))}
        </ListOrEmpty>
      </div>
    </Layout>
  );
}

export function CreatorSettings() {
  const [tab, setTab] = useState('profile');
  const tabs = ['profile', 'payout', 'notifications', 'security', 'account'];
  return (
    <Layout breadcrumbs={[{ label: 'Settings' }]} banner={<ConnectBanner />}>
      <h1 className="page-title mb-6">Settings</h1>
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
      <h1 className="page-title mb-6">Help & Support</h1>
      <div className="card"><p>Contact {BRAND.supportEmail}</p></div>
    </Layout>
  );
}

export function CreatorApplications() {
  const { data } = useQuery({ queryKey: ['applications'], queryFn: () => marketplaceApi.applications().then((r) => r.data) });
  return (
    <Layout breadcrumbs={[{ label: 'My Applications' }]} banner={<ConnectBanner />}>
      <h1 className="page-title mb-6">My Applications</h1>
      <ListOrEmpty items={data?.applications} empty={<p className="text-muted">No applications</p>}>
        {(items) => items.map((a) => (
          <div key={a.id} className="card mb-3 flex justify-between">
            <span>{a.campaign?.name}</span>
            <span className="text-sm">{a.status}</span>
          </div>
        ))}
      </ListOrEmpty>
    </Layout>
  );
}
