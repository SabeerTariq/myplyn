import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Icon from './Icon';

function notificationPath(n, role) {
  const payload = n.payload || {};
  const messagesBase = role === 'ADVERTISER'
    ? '/advertiser/messages'
    : role === 'CREATOR'
      ? '/creator/messages'
      : '/admin/messages';

  if (payload.threadId) return `${messagesBase}/${payload.threadId}`;
  if (payload.collaborationId) {
    if (role === 'ADVERTISER') return `/advertiser/collaborations/${payload.collaborationId}`;
    if (role === 'CREATOR') return `/creator/collaborations/${payload.collaborationId}`;
  }
  if (payload.type === 'message' && payload.threadId) return `${messagesBase}/${payload.threadId}`;
  return null;
}

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: counts } = useQuery({
    queryKey: ['badgeCounts'],
    queryFn: () => notificationsApi.counts().then((r) => r.data.counts),
    refetchInterval: 30000,
  });

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list().then((r) => r.data.notifications),
    enabled: open,
  });

  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['badgeCounts'] });
    },
  });

  const unread = counts?.notifications || 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center transition-colors"
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          border: 'none',
          background: open ? 'var(--surface-2)' : 'transparent',
          cursor: 'pointer',
          color: 'var(--text-2)',
        }}
        aria-label="Notifications"
      >
        <Icon name="notifications" size={22} />
        {unread > 0 && (
          <span
            className="absolute font-mono font-bold flex items-center justify-center"
            style={{
              top: 4,
              right: 4,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              borderRadius: 8,
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 10,
            }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="notifications-dropdown absolute right-0 z-50 overflow-auto"
            style={{
              top: 'calc(100% + 8px)',
              width: 320,
              maxWidth: 'calc(100vw - 24px)',
              maxHeight: 384,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              boxShadow: '0 24px 60px -20px rgba(0,0,0,.4)',
            }}
          >
            <div className="flex items-center justify-between" style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <h3 className="font-bold" style={{ fontSize: 14 }}>Notifications</h3>
              <button type="button" onClick={() => markAll.mutate()} className="text-[var(--accent-text)] font-semibold" style={{ fontSize: 12 }}>
                Mark all read
              </button>
            </div>
            {data?.length ? data.map((n) => {
              const path = notificationPath(n, user?.role);
              return (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (path) navigate(path);
                }}
                className="block w-full text-left"
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border)',
                  fontSize: 13,
                  opacity: n.readAt ? 0.6 : 1,
                  background: 'transparent',
                  border: 'none',
                  cursor: path ? 'pointer' : 'default',
                }}
              >
                <p className="font-bold">{n.title}</p>
                {n.body && <p style={{ color: 'var(--text-3)', marginTop: 2 }}>{n.body}</p>}
                <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{new Date(n.createdAt).toLocaleString()}</p>
              </button>
            );}) : (
              <p style={{ padding: 16, color: 'var(--text-3)', fontSize: 13 }}>No notifications</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
