import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useMediaQuery } from '../hooks/useMediaQuery';
import Icon from './Icon';
import '../styles/notifications.css';

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function notificationMeta(type) {
  switch (type) {
    case 'message':
      return { icon: 'chat', className: 'notif-item__icon--message' };
    case 'collaboration':
      return { icon: 'handshake', className: 'notif-item__icon--collaboration' };
    case 'application':
      return { icon: 'inbox', className: 'notif-item__icon--application' };
    case 'invitation':
      return { icon: 'mail', className: 'notif-item__icon--invitation' };
    case 'page_verification':
      return { icon: 'verified', className: 'notif-item__icon--page' };
    default:
      return { icon: 'notifications', className: '' };
  }
}

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

  if (n.type === 'application') {
    if (role === 'ADVERTISER' && payload.applicationId) {
      return `/advertiser/proposals/${payload.applicationId}`;
    }
    if (role === 'CREATOR') return '/creator/proposals';
  }

  if (n.type === 'invitation' && role === 'CREATOR') {
    return '/creator/invitations';
  }

  if (n.type === 'page_verification' && role === 'CREATOR' && payload.pageId) {
    return `/creator/pages/${payload.pageId}`;
  }

  if (payload.type === 'message' && payload.threadId) {
    return `${messagesBase}/${payload.threadId}`;
  }

  return null;
}

function NotificationList({ items, userRole, onSelect, isLoading }) {
  if (isLoading) {
    return (
      <div className="notif-loading">
        <Icon name="hourglass_empty" size={28} />
        <p>Loading notifications…</p>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="notif-empty">
        <span className="notif-empty__icon">
          <Icon name="notifications_off" size={26} />
        </span>
        <p><strong>You're all caught up</strong></p>
        <p>New alerts for messages, proposals, and collaborations will show up here.</p>
      </div>
    );
  }

  return (
    <div className="notif-list" role="list">
      {items.map((n) => {
        const path = notificationPath(n, userRole);
        const isUnread = !n.readAt;
        const meta = notificationMeta(n.type);

        return (
          <button
            key={n.id}
            type="button"
            role="listitem"
            className={`notif-item${isUnread ? ' notif-item--unread' : ''}${!path ? ' notif-item--static' : ''}`}
            onClick={() => onSelect(n, path)}
          >
            <span className={`notif-item__icon ${meta.className}`.trim()}>
              <Icon name={meta.icon} size={20} />
            </span>
            <span className="notif-item__body">
              <span className="notif-item__top">
                <span className="notif-item__title">{n.title}</span>
                {isUnread && <span className="notif-item__dot" aria-hidden="true" />}
              </span>
              {n.body && <p className="notif-item__text">{n.body}</p>}
              <time className="notif-item__time" dateTime={n.createdAt}>
                {formatRelativeTime(n.createdAt)}
              </time>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PanelChrome({ unread, onMarkAll, onClose, markAllPending, children, variant, dropdownStyle }) {
  return (
  <div
    className={`notif-panel notif-panel--${variant}`}
    role="dialog"
    aria-label="Notifications"
    style={variant === 'dropdown' ? dropdownStyle : undefined}
  >
    <div className="notif-head">
      <div className="notif-head__title-wrap">
        <h3>Notifications</h3>
        {unread > 0 && (
          <span className="notif-head__count">{unread} new</span>
        )}
      </div>
      <div className="notif-head__actions">
        {unread > 0 && (
          <button
            type="button"
            className="notif-mark-all"
            onClick={onMarkAll}
            disabled={markAllPending}
          >
            Mark all read
          </button>
        )}
        <button
          type="button"
          className="notif-close touch-target"
          onClick={onClose}
          aria-label="Close notifications"
        >
          <Icon name="close" size={20} />
        </button>
      </div>
    </div>
    {children}
    <div className="notif-foot">Select a notification to open the related page</div>
  </div>
  );
}

export default function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const rootRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [dropdownPos, setDropdownPos] = useState({ top: 72, right: 16 });

  const updateDropdownPos = () => {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 8,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  };

  const { data: counts } = useQuery({
    queryKey: ['badgeCounts'],
    queryFn: () => notificationsApi.counts().then((r) => r.data.counts),
    refetchInterval: 30000,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list().then((r) => r.data.notifications),
    enabled: open,
    refetchInterval: open ? 15000 : false,
  });

  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['badgeCounts'] });
    },
  });

  const markRead = useMutation({
    mutationFn: (id) => notificationsApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
      qc.invalidateQueries({ queryKey: ['badgeCounts'] });
    },
  });

  const unread = counts?.notifications || 0;

  const close = () => setOpen(false);
  const toggle = () => setOpen((o) => !o);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open || isMobile) return undefined;
    updateDropdownPos();
    window.addEventListener('resize', updateDropdownPos);
    window.addEventListener('scroll', updateDropdownPos, true);
    return () => {
      window.removeEventListener('resize', updateDropdownPos);
      window.removeEventListener('scroll', updateDropdownPos, true);
    };
  }, [open, isMobile]);

  useEffect(() => {
    if (!open || !isMobile) return undefined;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open, isMobile]);

  const handleSelect = async (notification, path) => {
    if (!notification.readAt) {
      try {
        await markRead.mutateAsync(notification.id);
      } catch {
        /* still navigate */
      }
    }
    close();
    if (path) navigate(path);
  };

  const list = (
    <NotificationList
      items={data}
      userRole={user?.role}
      onSelect={handleSelect}
      isLoading={isLoading || (isFetching && !data)}
    />
  );

  return (
    <div className="notif-root" ref={rootRef}>
      <button
        type="button"
        className="notif-trigger touch-target"
        onClick={toggle}
        aria-label={unread > 0 ? `${unread} unread notifications` : 'Notifications'}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Icon name="notifications" size={22} />
        {unread > 0 && (
          <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="notif-backdrop"
            onClick={close}
            aria-label="Close notifications"
          />

          {isMobile ? (
            <PanelChrome
              variant="sheet"
              unread={unread}
              onMarkAll={() => markAll.mutate()}
              onClose={close}
              markAllPending={markAll.isPending}
            >
              {list}
            </PanelChrome>
          ) : (
            <PanelChrome
              variant="dropdown"
              unread={unread}
              onMarkAll={() => markAll.mutate()}
              onClose={close}
              markAllPending={markAll.isPending}
              dropdownStyle={{ top: dropdownPos.top, right: dropdownPos.right }}
            >
              {list}
            </PanelChrome>
          )}
        </>
      )}
    </div>
  );
}
