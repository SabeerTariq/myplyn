import { COLLAB_STATUS_LABELS } from '../config/navigation';

export default function WorkflowTimeline({ events = [], currentStatus }) {
  const statuses = [
    'REQUESTED', 'APPLICATION_PENDING', 'ACCEPTED', 'CONTENT_PROVIDED',
    'PUBLISHED', 'PROOF_SUBMITTED', 'IN_REVIEW', 'VERIFIED', 'RELEASED', 'PAID_OUT',
  ];

  const currentIdx = statuses.indexOf(currentStatus);

  return (
    <div>
      {statuses.map((status, idx) => {
        const done = idx <= currentIdx;
        const active = status === currentStatus;
        const event = events.find((e) => e.toStatus === status);
        const config = COLLAB_STATUS_LABELS[status] || { label: status };

        return (
          <div key={status} style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: done ? 'var(--accent)' : 'var(--border)',
                  boxShadow: active ? '0 0 0 4px color-mix(in oklch, var(--accent) 20%, transparent)' : 'none',
                }}
              />
              {idx < statuses.length - 1 && (
                <div
                  style={{
                    width: 2,
                    height: 32,
                    background: done && idx < currentIdx ? 'var(--accent)' : 'var(--border)',
                  }}
                />
              )}
            </div>
            <div style={{ paddingBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: done ? 'var(--text)' : 'var(--text-3)' }}>{config.label}</p>
              {event && (
                <p className="text-muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                  {new Date(event.createdAt).toLocaleString()}
                  {event.notes && ` — ${event.notes}`}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
