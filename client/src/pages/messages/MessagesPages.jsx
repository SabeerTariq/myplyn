import { Link, useParams } from 'react-router-dom';
import DashboardShell from '../../layouts/DashboardShell';
import { advertiserNav, creatorNav, filterAdminNav } from '../../config/navigation';
import MessagesInbox from '../../components/MessagesInbox';
import { useAuth } from '../../hooks/useAuth';

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
      Set up payouts to withdraw earnings.{' '}
      <Link to="/creator/earnings" style={{ fontWeight: 700, textDecoration: 'underline' }}>Connect Stripe →</Link>
    </div>
  );
}

function AdvertiserShell({ breadcrumbs, children }) {
  return (
    <DashboardShell navConfig={advertiserNav} role="ADVERTISER" breadcrumbs={breadcrumbs}>
      {children}
    </DashboardShell>
  );
}

function CreatorShell({ breadcrumbs, children, banner }) {
  return (
    <DashboardShell navConfig={creatorNav} role="CREATOR" breadcrumbs={breadcrumbs} banner={banner}>
      {children}
    </DashboardShell>
  );
}

function AdminShell({ breadcrumbs, children }) {
  const { user } = useAuth();
  const nav = filterAdminNav(user?.adminRole);
  return (
    <DashboardShell navConfig={nav} role="ADMIN" breadcrumbs={breadcrumbs}>
      {children}
    </DashboardShell>
  );
}

export function AdvertiserMessagesInbox() {
  const { threadId } = useParams();
  const crumbs = threadId
    ? [{ label: 'Messages', path: '/advertiser/messages' }, { label: 'Conversation' }]
    : [{ label: 'Messages' }];
  return (
    <MessagesInbox
      role="ADVERTISER"
      basePath="/advertiser/messages"
      breadcrumbs={crumbs}
      shell={AdvertiserShell}
    />
  );
}

export function CreatorMessagesInbox() {
  const { threadId } = useParams();
  const crumbs = threadId
    ? [{ label: 'Messages', path: '/creator/messages' }, { label: 'Conversation' }]
    : [{ label: 'Messages' }];

  function Shell(props) {
    return <CreatorShell {...props} banner={<ConnectBanner />} />;
  }

  return (
    <MessagesInbox
      role="CREATOR"
      basePath="/creator/messages"
      breadcrumbs={crumbs}
      shell={Shell}
    />
  );
}

export function AdminMessagesInbox() {
  const { threadId } = useParams();
  const crumbs = threadId
    ? [{ label: 'Messages', path: '/admin/messages' }, { label: 'Conversation' }]
    : [{ label: 'Messages' }];
  return (
    <MessagesInbox
      role="ADMIN"
      basePath="/admin/messages"
      breadcrumbs={crumbs}
      shell={AdminShell}
    />
  );
}
