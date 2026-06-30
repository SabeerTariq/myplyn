import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardShell from '../../layouts/DashboardShell';
import { filterAdminNav } from '../../config/navigation';
import KpiCard from '../../components/KpiCard';
import StatusPill from '../../components/StatusPill';
import DataTable from '../../components/DataTable';
import TabBar from '../../components/TabBar';
import PageHeader from '../../components/PageHeader';
import ListOrEmpty from '../../components/ListOrEmpty';
import Modal, { ConfirmModal } from '../../components/Modal';
import { adminApi } from '../../services/api';
import { BRAND } from '../../config/brand';
import { useAuth } from '../../hooks/useAuth';

function AdminLayout({ breadcrumbs, children }) {
  const { user } = useAuth();
  const nav = filterAdminNav(user?.adminRole);
  return (
    <DashboardShell navConfig={nav} role="ADMIN" breadcrumbs={breadcrumbs}>
      {children}
    </DashboardShell>
  );
}

export function AdminDashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-dashboard'], queryFn: () => adminApi.dashboard().then((r) => r.data) });
  const kpis = data?.kpis;

  return (
    <AdminLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <PageHeader title="Platform Overview" />
      {isLoading ? <p>Loading...</p> : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <KpiCard title="Advertisers" value={kpis?.totalAdvertisers} />
          <KpiCard title="Creators" value={kpis?.totalCreators} />
          <KpiCard title="Active Campaigns" value={kpis?.activeCampaigns} />
          <KpiCard title="Total Commission" value={`$${Number(kpis?.totalCommission || 0).toLocaleString()}`} />
          <KpiCard title="Funds in Holding" value={`$${Number(kpis?.fundsInHolding || 0).toLocaleString()}`} />
          <KpiCard title="Open Disputes" value={kpis?.openDisputes} />
        </div>
      )}
      <div className="card">
        <h2 className="font-semibold mb-4">Work queues</h2>
        <div className="flex gap-4">
          <Link to="/admin/review" className="btn-ghost">Review Queue</Link>
          <Link to="/admin/users?status=PENDING" className="btn-ghost">Pending Users</Link>
          <Link to="/admin/finance" className="btn-ghost">Finance</Link>
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminUsers() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || '';
  const status = searchParams.get('status') || '';
  const [tab, setTab] = useState(status === 'PENDING' ? 'pending' : role || 'all');

  useEffect(() => {
    if (status === 'PENDING') setTab('pending');
    else if (role) setTab(role.toLowerCase());
    else setTab('all');
  }, [status, role]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', tab, status],
    queryFn: () => adminApi.users({ role: tab === 'all' ? undefined : tab.toUpperCase(), status: status || undefined }).then((r) => r.data),
  });

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'advertiser', label: 'Advertisers' },
    { key: 'creator', label: 'Creators' },
    { key: 'pending', label: 'Pending', status: 'PENDING' },
  ];

  return (
    <AdminLayout breadcrumbs={[{ label: 'Users' }]}>
      <PageHeader title="Users" />
      <div className="flex gap-4 border-b mb-6">
        {tabs.map((t) => (
          <Link
            key={t.key}
            to={t.status ? `/admin/users?status=${t.status}` : t.key === 'all' ? '/admin/users' : `/admin/users?role=${t.key}`}
            className={`pb-2 text-sm capitalize ${(tab === t.key || (t.status && status === t.status)) ? 'border-b-2 border-primary text-accent-link font-medium' : 'text-muted'}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </Link>
        ))}
      </div>
      <div className="card">
        {isLoading ? <p>Loading...</p> : (
          <DataTable
            columns={[
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role', render: (r) => r.role },
              { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status === 'ACTIVE' ? 'ACCEPTED' : r.status === 'SUSPENDED' ? 'CANCELLED' : 'APPLICATION_PENDING'} /> },
              { key: 'actions', label: '', render: (r) => <Link to={`/admin/users/${r.id}`} className="text-accent-link text-sm">View</Link> },
            ]}
            data={data?.users?.filter((u) => u.role !== 'ADMIN') || []}
            emptyMessage="No users found"
          />
        )}
      </div>
    </AdminLayout>
  );
}

export function AdminUserDetail() {
  const { id } = useParams();
  const [showSuspend, setShowSuspend] = useState(false);
  const qc = useQueryClient();

  const { data } = useQuery({ queryKey: ['admin-user', id], queryFn: () => adminApi.user(id).then((r) => r.data) });
  const user = data?.user;

  const updateStatus = useMutation({
    mutationFn: (status) => adminApi.updateUserStatus(id, { status, reason: 'Admin action' }),
    onSuccess: () => { qc.invalidateQueries(['admin-user', id]); setShowSuspend(false); },
  });

  return (
    <AdminLayout breadcrumbs={[{ label: 'Users', path: '/admin/users' }, { label: user?.email || 'User' }]}>
      {user && (
        <>
          <div className="flex justify-between mb-6">
            <div>
              <h1 className="page-title">{user.email}</h1>
              <p className="text-muted">{user.role} · {user.status}</p>
            </div>
            <div className="flex gap-2">
              {user.status !== 'ACTIVE' && <button className="btn-primary" onClick={() => updateStatus.mutate('ACTIVE')}>Approve</button>}
              {user.status === 'ACTIVE' && <button className="btn-danger" onClick={() => setShowSuspend(true)}>Suspend</button>}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Profile</h3>
              {user.advertiserProfile && (
                <div className="space-y-2 text-sm">
                  <p><strong>Company:</strong> {user.advertiserProfile.companyName}</p>
                  <p><strong>Industry:</strong> {user.advertiserProfile.industry}</p>
                  <p><strong>Campaigns:</strong> {user.advertiserProfile.campaigns?.length || 0}</p>
                </div>
              )}
              {user.creatorProfile && (
                <div className="space-y-2 text-sm">
                  <p><strong>Bio:</strong> {user.creatorProfile.bio}</p>
                  <p><strong>Pages:</strong> {user.creatorProfile.pages?.length || 0}</p>
                  <p><strong>Connect:</strong> {user.creatorProfile.connectStatus}</p>
                </div>
              )}
            </div>
            <div className="card">
              <h3 className="font-semibold mb-4">Audit log</h3>
              <ListOrEmpty items={data?.auditLogs} empty={<p className="text-muted">No audit entries</p>}>
                {(logs) => logs.map((log) => (
                  <div key={log.id} className="text-sm py-2 border-b">
                    <p>{log.action}</p>
                    <p className="text-muted text-xs">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </ListOrEmpty>
            </div>
          </div>
          <ConfirmModal open={showSuspend} onClose={() => setShowSuspend(false)} onConfirm={() => updateStatus.mutate('SUSPENDED')} title="Suspend user" message="This will prevent the user from logging in." confirmLabel="Suspend" danger />
        </>
      )}
    </AdminLayout>
  );
}

export function AdminCampaigns() {
  const { data } = useQuery({ queryKey: ['admin-campaigns'], queryFn: () => adminApi.campaigns().then((r) => r.data) });

  return (
    <AdminLayout breadcrumbs={[{ label: 'Campaigns' }]}>
      <PageHeader title="All Campaigns" />
      <div className="card">
        <DataTable
          columns={[
            { key: 'name', label: 'Campaign' },
            { key: 'brand', label: 'Brand', render: (r) => r.advertiser?.companyName },
            { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
            { key: 'budget', label: 'Budget', render: (r) => `$${Number(r.budgetTotal).toLocaleString()}` },
            { key: 'collabs', label: 'Collabs', render: (r) => r.collaborations?.length || 0 },
            { key: 'actions', label: '', render: (r) => <Link to={`/admin/campaigns/${r.id}`} className="text-accent-link text-sm">View</Link> },
          ]}
          data={data?.campaigns || []}
        />
      </div>
    </AdminLayout>
  );
}

export function AdminCampaignDetail() {
  const { id } = useParams();
  const { data } = useQuery({ queryKey: ['admin-campaign', id], queryFn: () => adminApi.campaign(id).then((r) => r.data) });
  const c = data?.campaign;

  return (
    <AdminLayout breadcrumbs={[{ label: 'Campaigns', path: '/admin/campaigns' }, { label: c?.name || 'Detail' }]}>
      {c && (
        <>
          <h1 className="page-title">{c.name}</h1>
          <p className="text-muted mb-6">{c.advertiser?.companyName}</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Details</h3>
              <p className="text-sm text-subtle">{c.description}</p>
              <div className="mt-4 space-y-1 text-sm">
                <p>Budget: ${Number(c.budgetTotal).toLocaleString()}</p>
                <p>Held: ${Number(c.budgetHeld).toLocaleString()}</p>
                <p>Spent: ${Number(c.budgetSpent).toLocaleString()}</p>
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-4">Collaborations ({c.collaborations?.length})</h3>
              {c.collaborations?.map((col) => (
                <div key={col.id} className="flex justify-between py-2 border-b text-sm">
                  <span>{col.pageId?.slice(0, 8)}...</span>
                  <StatusPill status={col.status} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export function AdminReviewQueue() {
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);
  const qc = useQueryClient();

  const { data } = useQuery({ queryKey: ['review-queue'], queryFn: () => adminApi.reviewQueue().then((r) => r.data) });

  const items = data?.items?.filter((i) => tab === 'all' || i.type.toLowerCase() === tab) || [];

  const resolve = async (action, notes) => {
    await adminApi.resolveReview(selected.id, { action, notes });
    qc.invalidateQueries(['review-queue']);
    setSelected(null);
  };

  const verifyPage = async (status) => {
    if (selected?.page) {
      await adminApi.verifyPage(selected.page.id, { status, notes: 'Admin verification' });
      await adminApi.resolveReview(selected.id, { action: 'verify' });
      qc.invalidateQueries(['review-queue']);
      setSelected(null);
    }
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'Review Queue' }]}>
      <PageHeader title="Review Queue" />
      <TabBar
        tabs={[
          { key: 'all', label: 'All' },
          { key: 'proof', label: 'Page verification' },
          { key: 'dispute', label: 'Dispute' },
          { key: 'report', label: 'Report' },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div className="card space-y-3">
        {items.length ? items.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-[var(--surface-2)]" onClick={() => setSelected(item)}>
            <div>
              <p className="font-medium">{item.type}</p>
              <p className="text-sm text-muted">{item.page?.name || item.dispute?.reason || item.report?.reason || item.entityId}</p>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'color-mix(in oklch, var(--warn) 15%, white)', color: 'var(--warn)' }}>{item.status}</span>
          </div>
        )) : <p className="text-muted">Queue empty</p>}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Review item">
        {selected?.type === 'PROOF' && selected.page && (
          <div className="space-y-4">
            <p><strong>{selected.page.name}</strong> — {selected.page.followers?.toLocaleString()} followers</p>
            <p className="text-sm">{selected.page.url}</p>
            <div className="flex gap-2">
              <button className="btn-primary" onClick={() => verifyPage('VERIFIED')}>Verify stats</button>
              <button className="btn-danger" onClick={() => verifyPage('REJECTED')}>Reject</button>
            </div>
          </div>
        )}
        {selected?.type === 'DISPUTE' && (
          <div className="space-y-4">
            <p>{selected.dispute?.reason}</p>
            <button className="btn-primary" onClick={() => resolve('release', 'Resolved in favor of creator')}>Release to creator</button>
            <button className="btn-ghost" onClick={() => resolve('refund', 'Refunded advertiser')}>Refund advertiser</button>
          </div>
        )}
        {selected?.type === 'REPORT' && (
          <div className="space-y-4">
            <p>{selected.report?.reason}</p>
            <button className="btn-ghost" onClick={() => resolve('DISMISSED')}>Dismiss</button>
            <button className="btn-danger" onClick={() => resolve('REMOVED')}>Remove content</button>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

export function AdminFinance() {
  const [tab, setTab] = useState('transactions');
  const { data: txs } = useQuery({ queryKey: ['admin-txs'], queryFn: () => adminApi.transactions().then((r) => r.data), enabled: tab === 'transactions' });
  const { data: comms } = useQuery({ queryKey: ['admin-commissions'], queryFn: () => adminApi.commissions().then((r) => r.data), enabled: tab === 'commissions' });
  const { data: payouts } = useQuery({ queryKey: ['admin-payouts'], queryFn: () => adminApi.payouts().then((r) => r.data), enabled: tab === 'payouts' });

  return (
    <AdminLayout breadcrumbs={[{ label: 'Finance' }]}>
      <PageHeader title="Finance" />
      <TabBar tabs={['transactions', 'commissions', 'payouts']} active={tab} onChange={setTab} />
      <div className="card">
        {tab === 'transactions' && (
          <DataTable columns={[
            { key: 'type', label: 'Type' },
            { key: 'gross', label: 'Amount', render: (r) => `$${Number(r.gross).toFixed(2)}` },
            { key: 'status', label: 'Status' },
            { key: 'date', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
          ]} data={txs?.transactions || []} />
        )}
        {tab === 'commissions' && (
          <>
            <p className="font-bold mb-4">Total commission: ${Number(comms?.total || 0).toFixed(2)}</p>
            <DataTable columns={[
              { key: 'gross', label: 'Gross', render: (r) => `$${Number(r.gross).toFixed(2)}` },
              { key: 'fee', label: 'Fee', render: (r) => `$${Number(r.feeAmount).toFixed(2)}` },
              { key: 'date', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
            ]} data={comms?.commissions || []} />
          </>
        )}
        {tab === 'payouts' && (
          <DataTable columns={[
            { key: 'net', label: 'Net', render: (r) => `$${Number(r.netAmount).toFixed(2)}` },
            { key: 'status', label: 'Status' },
            { key: 'date', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
          ]} data={payouts?.payouts || []} />
        )}
      </div>
    </AdminLayout>
  );
}

export function AdminReports() {
  const { data } = useQuery({ queryKey: ['admin-reports'], queryFn: () => adminApi.reports().then((r) => r.data) });

  const exportCsv = () => {
    const rows = [['Role', 'Count'], ...(data?.signups?.map((s) => [s.role, s._count]) || [])];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${BRAND.slug}-report.csv`;
    a.click();
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'Reports' }]}>
      <div className="flex justify-between mb-6">
        <PageHeader title="Reports & Analytics" />
        <button onClick={exportCsv} className="btn-ghost">Export CSV</button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Signups by role</h3>
          {data?.signups?.map((s) => (
            <div key={s.role} className="flex justify-between py-2 border-b">
              <span>{s.role}</span>
              <span className="font-bold">{s._count}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 className="font-semibold mb-4">Top niches</h3>
          <ListOrEmpty items={data?.topNiches} empty={<p className="text-muted">No data</p>}>
            {(items) => items.map((n) => (
              <div key={n.nicheId} className="flex justify-between py-2 border-b">
                <span>{n.nicheId || 'Unassigned'}</span>
                <span>{n._count} pages</span>
              </div>
            ))}
          </ListOrEmpty>
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminSettings() {
  const [tab, setTab] = useState('commission');
  const { data } = useQuery({ queryKey: ['admin-settings'], queryFn: () => adminApi.settings().then((r) => r.data) });
  const [rate, setRate] = useState('0.15');
  const [newNiche, setNewNiche] = useState('');
  const [newPlatform, setNewPlatform] = useState('');
  const qc = useQueryClient();

  return (
    <AdminLayout breadcrumbs={[{ label: 'Settings' }]}>
      <PageHeader title="Platform Settings" />
      <TabBar tabs={['commission', 'niches', 'platforms', 'email', 'roles', 'flags']} active={tab} onChange={setTab} />
      <div className="card max-w-xl">
        {tab === 'commission' && (
          <div className="space-y-4">
            <label className="label">Commission rate (0–1)</label>
            <input className="input max-w-xs" value={rate} onChange={(e) => setRate(e.target.value)} />
            <button className="btn-primary" onClick={() => adminApi.updateCommission(parseFloat(rate)).then(() => qc.invalidateQueries(['admin-settings']))}>Save</button>
          </div>
        )}
        {tab === 'niches' && (
          <div className="space-y-4">
            {data?.niches?.map((n) => <div key={n.id} className="flex justify-between text-sm"><span>{n.name}</span><span className={n.active ? 'text-ok' : 'text-muted'}>{n.active ? 'Active' : 'Inactive'}</span></div>)}
            <div className="flex gap-2 mt-4">
              <input className="input" placeholder="New niche" value={newNiche} onChange={(e) => setNewNiche(e.target.value)} />
              <button className="btn-primary" onClick={() => adminApi.createNiche({ name: newNiche }).then(() => { setNewNiche(''); qc.invalidateQueries(['admin-settings']); })}>Add</button>
            </div>
          </div>
        )}
        {tab === 'platforms' && (
          <div className="space-y-4">
            {data?.platforms?.map((p) => <div key={p.id} className="text-sm">{p.name}</div>)}
            <div className="flex gap-2">
              <input className="input" placeholder="New platform" value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} />
              <button className="btn-primary" onClick={() => adminApi.createPlatform({ name: newPlatform }).then(() => { setNewPlatform(''); qc.invalidateQueries(['admin-settings']); })}>Add</button>
            </div>
          </div>
        )}
        {tab === 'email' && <p className="text-muted">Email templates stored in database. Basic editor for verification and reset emails.</p>}
        {tab === 'roles' && <p className="text-muted">Super-admin, Moderator, Finance roles configured in RBAC middleware.</p>}
        {tab === 'flags' && <p className="text-muted">Feature flags as JSON in platform_settings.</p>}
      </div>
    </AdminLayout>
  );
}
