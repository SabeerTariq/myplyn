import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardShell from '../../layouts/DashboardShell';
import { advertiserNav } from '../../config/navigation';
import KpiCard from '../../components/KpiCard';
import EmptyState from '../../components/EmptyState';
import StatusPill from '../../components/StatusPill';
import Icon from '../../components/Icon';
import PageHeader from '../../components/PageHeader';
import { campaignsApi, collaborationsApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

function AdvertiserLayout({ breadcrumbs, children, banner }) {
  return (
    <DashboardShell navConfig={advertiserNav} role="ADVERTISER" breadcrumbs={breadcrumbs} banner={banner}>
      {children}
    </DashboardShell>
  );
}

export function AdvertiserDashboard() {
  const { user } = useAuth();
  const name = user?.advertiserProfile?.companyName?.split(' ')[0] || 'there';
  const { data: campaigns } = useQuery({ queryKey: ['adv-campaigns'], queryFn: () => campaignsApi.list().then((r) => r.data) });
  const { data: collabs } = useQuery({ queryKey: ['adv-collabs'], queryFn: () => collaborationsApi.list().then((r) => r.data) });

  const active = campaigns?.campaigns?.filter((c) => c.status === 'LIVE').length || 0;
  const pendingApps = campaigns?.campaigns?.reduce((s, c) => s + (c.applications?.filter((a) => a.status === 'PENDING').length || 0), 0) || 0;
  const needsAttention = collabs?.collaborations?.filter((c) => ['PROOF_SUBMITTED', 'IN_REVIEW'].includes(c.status)) || [];
  const liveCollabs = collabs?.collaborations?.filter((c) => !['PAID_OUT', 'CANCELLED'].includes(c.status)).length || 0;

  if (!campaigns?.campaigns?.length) {
    return (
      <AdvertiserLayout breadcrumbs={[{ label: 'Dashboard' }]}>
        <EmptyState
          title="Create your first campaign"
          description="Start connecting with creators by publishing a funded campaign."
          action={<Link to="/advertiser/campaigns/new" className="btn-primary">New Campaign</Link>}
        />
      </AdvertiserLayout>
    );
  }

  return (
    <AdvertiserLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <PageHeader
        greeting={`Good morning, ${name}`}
        title="Dashboard"
        actions={
          <>
            <button type="button" className="btn-ghost"><Icon name="calendar_today" size={18} />Last 30 days<Icon name="expand_more" size={18} /></button>
            <Link to="/advertiser/campaigns/new" className="btn-primary"><Icon name="add" size={19} />New campaign</Link>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5" style={{ gap: 13, marginBottom: 16 }}>
        <KpiCard title="Active Campaigns" value={active} icon="campaign" iconColor="var(--accent)" delta="↑ 2 this month" deltaColor="var(--ok)" />
        <KpiCard title="Funds in Holding" value="$2,500" icon="lock" iconColor="var(--warn)" />
        <KpiCard title="Total Spent" value="$850" icon="payments" iconColor="var(--text-3)" delta="↑ 12% vs last month" deltaColor="var(--ok)" />
        <KpiCard title="Pending Applications" value={pendingApps} icon="inbox" iconColor="var(--info)" />
        <KpiCard title="Live Collaborations" value={liveCollabs} icon="handshake" iconColor="var(--ok)" />
      </div>

      {needsAttention.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="section-title" style={{ marginBottom: 14 }}>Needs attention</div>
          {needsAttention.map((c) => (
            <Link
              key={c.id}
              to={`/advertiser/collaborations/${c.id}`}
              className="flex items-center justify-between transition-colors hover:bg-[var(--surface-2)]"
              style={{ padding: '10px 8px', borderRadius: 9, marginBottom: 4 }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>{c.campaign?.name} — {c.page?.name}</span>
              <StatusPill status={c.status} />
            </Link>
          ))}
        </div>
      )}
    </AdvertiserLayout>
  );
}

export function AdvertiserCampaignsList() {
  const { data, isLoading } = useQuery({ queryKey: ['adv-campaigns'], queryFn: () => campaignsApi.list().then((r) => r.data) });

  return (
    <AdvertiserLayout breadcrumbs={[{ label: 'Dashboard', path: '/advertiser' }, { label: 'Campaigns' }]}>
      <PageHeader
        title="Campaigns"
        actions={<Link to="/advertiser/campaigns/new" className="btn-primary"><Icon name="add" size={19} />New campaign</Link>}
      />
      <div className="card">
        {isLoading ? <p style={{ color: 'var(--text-3)' }}>Loading…</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data?.campaigns?.map((c) => (
              <Link
                key={c.id}
                to={`/advertiser/campaigns/${c.id}`}
                className="flex items-center justify-between transition-colors hover:bg-[var(--surface-2)]"
                style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border)' }}
              >
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</p>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-3)', marginTop: 2 }}>Budget: ${Number(c.budgetTotal).toLocaleString()}</p>
                </div>
                <StatusPill status={c.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdvertiserLayout>
  );
}