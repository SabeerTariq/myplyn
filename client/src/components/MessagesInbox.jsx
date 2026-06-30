import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import PageHeader from './PageHeader';
import ListOrEmpty from './ListOrEmpty';
import Icon from './Icon';

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

function senderLabel(sender, user) {
  if (!sender) return 'Unknown';
  if (sender.id === user?.id) return 'You';
  if (sender.role === 'ADMIN') return 'Admin';
  return sender.email?.split('@')[0] || 'Partner';
}

export default function MessagesInbox({ role, basePath, breadcrumbs, shell: Shell }) {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [draft, setDraft] = useState('');

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ['threads'],
    queryFn: () => messagesApi.threads().then((r) => r.data),
    refetchInterval: 15000,
  });

  const { data: threadData, isLoading: threadLoading } = useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => messagesApi.thread(threadId).then((r) => r.data),
    enabled: !!threadId,
    refetchInterval: threadId ? 5000 : false,
  });

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

  const handleSend = (e) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || !threadId) return;
    sendMut.mutate(body);
  };

  return (
    <Shell breadcrumbs={breadcrumbs}>
      <PageHeader title="Messages" />

      <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: 520 }}>
        <div
          className={
            threadId
              ? 'grid grid-cols-1 md:grid-cols-[minmax(260px,320px)_1fr]'
              : threads.length > 0
                ? 'grid grid-cols-1 md:grid-cols-[minmax(260px,320px)_1fr]'
                : 'grid grid-cols-1'
          }
          style={{ minHeight: 520 }}
        >
          <div
            className={threadId ? 'hidden md:block' : ''}
            style={{ borderRight: '1px solid var(--border)', overflowY: 'auto' }}
          >
              {listLoading ? (
                <p className="text-muted" style={{ padding: 20 }}>Loading conversations…</p>
              ) : (
                <ListOrEmpty
                  items={threads}
                  empty={
                    <div style={{ padding: 32, textAlign: 'center' }} className="text-muted">
                      <Icon name="forum" size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
                      <p>No conversations yet.</p>
                      <p style={{ fontSize: 12, marginTop: 8 }}>Messages appear when you have active collaborations.</p>
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
                        style={{
                          display: 'block',
                          padding: '14px 16px',
                          borderBottom: '1px solid var(--border)',
                          background: active ? 'var(--accent-soft)' : 'transparent',
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{threadTitle(t, role)}</div>
                        <div className="text-muted" style={{ fontSize: 11.5, marginTop: 2 }}>{threadSubtitle(t, role)}</div>
                        {preview && (
                          <div style={{ fontSize: 12, marginTop: 6, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {preview.senderId === user?.id ? 'You: ' : ''}{preview.body}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </ListOrEmpty>
              )}
            </div>

          {threadId ? (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 520 }}>
              {threadLoading ? (
                <p className="text-muted" style={{ padding: 20 }}>Loading conversation…</p>
              ) : !activeThread ? (
                <div style={{ padding: 32, textAlign: 'center' }} className="text-muted">
                  <p>Conversation not found.</p>
                  <button type="button" className="btn-ghost" style={{ marginTop: 12 }} onClick={() => navigate(basePath)}>Back to inbox</button>
                </div>
              ) : (
                <>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ marginBottom: 10, height: 32, padding: '0 10px', fontSize: 12 }}
                      onClick={() => navigate(basePath)}
                    >
                      <Icon name="arrow_back" size={16} /> Inbox
                    </button>
                    <div style={{ fontWeight: 700 }}>{threadTitle(activeThread, role)}</div>
                    <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>
                      {threadSubtitle(activeThread, role)}
                      {activeThread.collaboration?.status && (
                        <span style={{ marginLeft: 8 }}>· {activeThread.collaboration.status.replace(/_/g, ' ').toLowerCase()}</span>
                      )}
                    </div>
                    {activeThread.collaborationId && role !== 'ADMIN' && (
                      <Link
                        to={role === 'ADVERTISER'
                          ? `/advertiser/collaborations/${activeThread.collaborationId}`
                          : `/creator/collaborations/${activeThread.collaborationId}`}
                        className="text-accent-link"
                        style={{ fontSize: 12, display: 'inline-block', marginTop: 6 }}
                      >
                        View collaboration →
                      </Link>
                    )}
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <ListOrEmpty
                      items={activeThread.messages}
                      empty={<p className="text-muted text-center" style={{ marginTop: 40 }}>No messages yet. Say hello!</p>}
                    >
                      {(messages) => messages.map((m) => {
                        const mine = m.senderId === user?.id;
                        return (
                          <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                            <div
                              style={{
                                maxWidth: '75%',
                                padding: '10px 14px',
                                borderRadius: mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                background: mine ? 'var(--accent-soft)' : 'var(--surface-2)',
                                border: `1px solid ${mine ? 'color-mix(in oklch, var(--accent) 20%, var(--border))' : 'var(--border)'}`,
                              }}
                            >
                              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', marginBottom: 4 }}>
                                {senderLabel(m.sender, user)}
                              </div>
                              <div style={{ fontSize: 13, lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>{m.body}</div>
                              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 6, textAlign: 'right' }}>
                                {formatTime(m.createdAt)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </ListOrEmpty>
                  </div>

                  {role !== 'ADMIN' ? (
                    <form onSubmit={handleSend} style={{ padding: '14px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                      <input
                        className="input"
                        placeholder="Write a message…"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        disabled={sendMut.isPending}
                      />
                      <button type="submit" className="btn-primary" disabled={!draft.trim() || sendMut.isPending}>
                        <Icon name="send" size={18} />
                        Send
                      </button>
                    </form>
                  ) : (
                    <div className="text-muted" style={{ padding: '14px 18px', borderTop: '1px solid var(--border)', fontSize: 12 }}>
                      Admin view — read-only moderation access.
                    </div>
                  )}
                </>
              )}
            </div>
          ) : !threadId && threads.length > 0 ? (
            <div className="hidden md:flex" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              Select a conversation to view messages
            </div>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}
