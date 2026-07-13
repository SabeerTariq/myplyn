import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useMediaQuery } from '../hooks/useMediaQuery';
import ListOrEmpty from './ListOrEmpty';
import Icon from './Icon';
import StatusPill from './StatusPill';
import CollaborationThreadContext from './messages/CollaborationThreadContext';
import MessageActivityCard from './messages/MessageActivityCard';
import { buildThreadFeed, isMessagingWorkspace } from '../utils/messageThread';
import '../styles/messages.css';

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function threadTitle(thread, role) {
  const campaign = thread.collaboration?.campaign?.name;
  const page = thread.collaboration?.page?.name;
  if (role === 'ADVERTISER') return campaign || 'Collaboration';
  if (role === 'CREATOR') return campaign || 'Campaign';
  return `${campaign || 'Campaign'} · ${page || 'Page'}`;
}

function threadSubtitle(thread, role) {
  if (role === 'ADMIN') {
    const adv = thread.collaboration?.campaign?.advertiser?.companyName;
    const creator = thread.collaboration?.page?.creator?.user?.email || thread.collaboration?.page?.name;
    return [adv, creator].filter(Boolean).join(' ↔ ');
  }
  return thread.collaboration?.page?.name || thread.collaboration?.campaign?.advertiser?.companyName || '';
}

function collabPathFor(role, collaborationId) {
  if (!collaborationId || role === 'ADMIN') return null;
  return role === 'ADVERTISER'
    ? `/advertiser/collaborations/${collaborationId}`
    : `/creator/collaborations/${collaborationId}`;
}

export default function MessagesInbox({ role, basePath, breadcrumbs, shell: Shell }) {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [draft, setDraft] = useState('');
  const [contextOpen, setContextOpen] = useState(false);
  const feedRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ['threads'],
    queryFn: () => messagesApi.threads().then((r) => r.data),
    refetchInterval: 10000,
  });

  const { data: threadData, isLoading: threadLoading } = useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => messagesApi.thread(threadId).then((r) => r.data),
    enabled: !!threadId,
    refetchInterval: threadId ? 5000 : false,
  });

  useEffect(() => {
    if (!threadData?.thread || !threadId) return;
    qc.invalidateQueries({ queryKey: ['badgeCounts'] });
    qc.invalidateQueries({ queryKey: ['threads'] });
    if (typeof threadData.unreadTotal === 'number') {
      qc.setQueryData(['badgeCounts'], (prev) => {
        if (!prev) return prev;
        return { ...prev, messages: threadData.unreadTotal };
      });
    }
  }, [threadData?.thread?.id, threadData?.unreadTotal, threadId, qc]);

  useEffect(() => {
    setContextOpen(false);
  }, [threadId]);

  useEffect(() => {
    if (!contextOpen) return undefined;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [contextOpen]);

  const sendMut = useMutation({
    mutationFn: (body) => messagesApi.send(threadId, body),
    onSuccess: () => {
      setDraft('');
      qc.invalidateQueries({ queryKey: ['thread', threadId] });
      qc.invalidateQueries({ queryKey: ['threads'] });
      qc.invalidateQueries({ queryKey: ['badgeCounts'] });
    },
  });

  const threads = listData?.threads || [];
  const activeThread = threadData?.thread;
  const unreadTotal = threads.reduce((sum, t) => sum + (t.unreadCount || 0), 0);

  useEffect(() => {
    if (typeof listData?.unreadTotal !== 'number') return;
    qc.setQueryData(['badgeCounts'], (prev) => {
      if (!prev) return prev;
      return { ...prev, messages: listData.unreadTotal };
    });
  }, [listData?.unreadTotal, qc]);

  const collaboration = activeThread?.collaboration;
  const workspaceOpen = isMessagingWorkspace(collaboration?.status);
  const collabPath = collabPathFor(role, activeThread?.collaborationId);

  const feed = useMemo(
    () => buildThreadFeed(collaboration, activeThread?.messages || []),
    [collaboration, activeThread?.messages],
  );

  const lastFeedKey = feed.length
    ? `${feed[feed.length - 1].type}-${feed[feed.length - 1].data?.id || feed.length}`
    : null;

  useEffect(() => {
    if (!threadId || !activeThread) return;
    const scrollToBottom = () => {
      if (feedRef.current) {
        feedRef.current.scrollTop = feedRef.current.scrollHeight;
      }
    };
    const raf = requestAnimationFrame(scrollToBottom);
    return () => cancelAnimationFrame(raf);
  }, [threadId, activeThread, lastFeedKey, feed.length]);

  const handleSend = (e) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !threadId || role === 'ADMIN') return;
    sendMut.mutate(body);
  };

  const gridClass = threadId
    ? 'msg-inbox-grid msg-inbox-grid--with-thread'
    : threads.length > 0
      ? 'msg-inbox-grid msg-inbox-grid--list-only'
      : 'msg-inbox-grid';

  const showMobileContext = isMobile && threadId && activeThread && role !== 'ADMIN';

  return (
    <Shell breadcrumbs={breadcrumbs}>
      <div className="msg-page">
        <div className="card msg-inbox-card">
          <div className={gridClass}>
            {!threadId && (
              <div className="msg-list-header hide-above-tablet">
                <h2 className="msg-list-header__title">Inbox</h2>
                {unreadTotal > 0 && (
                  <span className="msg-list-header__badge">{unreadTotal} unread</span>
                )}
              </div>
            )}

            <div className={`msg-thread-list${threadId ? ' msg-thread-list--hidden-mobile' : ''}`}>
              {listLoading ? (
                <p className="text-muted msg-list-loading">Loading conversations…</p>
              ) : (
                <ListOrEmpty
                  items={threads}
                  empty={
                    <div className="msg-list-empty text-muted">
                      <Icon name="forum" size={40} />
                      <p>No active collaboration messages yet.</p>
                      <p className="msg-list-empty__hint">
                        Threads appear once a proposal is accepted by both sides. The workspace opens when promotional content is shared.
                      </p>
                    </div>
                  }
                >
                  {(items) => items.map((t) => {
                    const preview = t.messages?.[0];
                    const active = t.id === threadId;
                    return (
                      <Link
                        key={t.id}
                        to={`${basePath}/${t.id}`}
                        className={`msg-thread-item ${active ? 'msg-thread-item--active' : ''}`}
                      >
                        <div className="msg-thread-item-top">
                          <div className="msg-thread-item-title">{threadTitle(t, role)}</div>
                          {t.unreadCount > 0 && (
                            <span className="msg-thread-unread">{t.unreadCount > 9 ? '9+' : t.unreadCount}</span>
                          )}
                        </div>
                        <div className="msg-thread-item-meta">
                          {t.collaboration?.status && (
                            <StatusPill status={t.collaboration.status} />
                          )}
                          <span className="msg-thread-item-sub">
                            {threadSubtitle(t, role)}
                            {preview && (
                              <>{' · '}{preview.senderId === user?.id ? 'You: ' : ''}{preview.body}</>
                            )}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </ListOrEmpty>
              )}
            </div>

            {threadId ? (
              <div className="msg-thread-main">
                {threadLoading ? (
                  <p className="text-muted msg-list-loading">Loading conversation…</p>
                ) : !activeThread ? (
                  <div className="msg-thread-empty text-muted">
                    <p>Conversation not found or not yet active.</p>
                    <button type="button" className="btn-ghost" onClick={() => navigate(basePath)}>Back to inbox</button>
                  </div>
                ) : (
                  <>
                    <div className="msg-thread-header">
                      <div className="msg-thread-header-top">
                        <button
                          type="button"
                          className="btn-ghost msg-thread-back touch-target"
                          onClick={() => navigate(basePath)}
                          aria-label="Back to inbox"
                        >
                          <Icon name="arrow_back" size={20} />
                        </button>
                        <div className="msg-thread-header-titles">
                          <h2>{threadTitle(activeThread, role)}</h2>
                          <p className="msg-thread-header-lead">{threadSubtitle(activeThread, role)}</p>
                        </div>
                        <div className="msg-thread-header-actions">
                          {collaboration?.status && (
                            <span className="msg-thread-header-status hide-mobile">
                              <StatusPill status={collaboration.status} />
                            </span>
                          )}
                          {showMobileContext && (
                            <button
                              type="button"
                              className="msg-context-toggle touch-target"
                              onClick={() => setContextOpen(true)}
                              aria-label="Conversation details"
                            >
                              <Icon name="info" size={20} />
                            </button>
                          )}
                          {collabPath && isMobile && (
                            <Link
                              to={collabPath}
                              className="msg-context-toggle touch-target"
                              aria-label="Open collaboration"
                            >
                              <Icon name="handshake" size={20} />
                            </Link>
                          )}
                        </div>
                      </div>
                      {!workspaceOpen && collaboration?.status === 'ACCEPTED' && (
                        <p className="msg-context-hint msg-thread-header-hint">
                          {role === 'ADVERTISER'
                            ? 'Provide campaign content from the collaboration page to unlock this workspace.'
                            : 'The brand will share assets soon. You will be notified when this workspace opens.'}
                        </p>
                      )}
                    </div>

                    <div className="msg-thread-feed" ref={feedRef}>
                      {feed.map((item, idx) => (
                        <MessageActivityCard
                          key={`${item.type}-${item.data?.id || idx}`}
                          item={item}
                          role={role}
                          user={user}
                          collaboration={collaboration}
                        />
                      ))}
                    </div>

                    {role !== 'ADMIN' ? (
                      <form onSubmit={handleSend} className="msg-compose">
                        <input
                          className="input msg-compose-input"
                          placeholder={workspaceOpen ? 'Message…' : 'Workspace opens after content is shared…'}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          disabled={sendMut.isPending || !workspaceOpen}
                        />
                        <button
                          type="submit"
                          className="btn-primary msg-compose-send touch-target"
                          disabled={!draft.trim() || sendMut.isPending || !workspaceOpen}
                          aria-label="Send message"
                        >
                          <Icon name="send" size={20} />
                          <span className="msg-compose-send-label">Send</span>
                        </button>
                      </form>
                    ) : (
                      <div className="text-muted msg-compose msg-compose--readonly">
                        Admin view — read-only moderation access.
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : !threadId && threads.length > 0 ? (
              <div className="msg-inbox-placeholder">
                Select a collaboration workspace
              </div>
            ) : null}

            {threadId && activeThread && role !== 'ADMIN' && !isMobile && (
              <CollaborationThreadContext
                collaboration={collaboration}
                role={role}
                collabPath={collabPath}
              />
            )}
          </div>
        </div>

        {showMobileContext && contextOpen && (
          <>
            <button
              type="button"
              className="msg-context-backdrop"
              onClick={() => setContextOpen(false)}
              aria-label="Close details"
            />
            <div className="msg-context-drawer safe-bottom">
              <div className="msg-context-drawer-head">
                <h3>Conversation details</h3>
                <button
                  type="button"
                  className="msg-context-drawer-close touch-target"
                  onClick={() => setContextOpen(false)}
                  aria-label="Close details"
                >
                  <Icon name="close" size={22} />
                </button>
              </div>
              <CollaborationThreadContext
                collaboration={collaboration}
                role={role}
                collabPath={collabPath}
              />
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
